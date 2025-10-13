use starknet::{
    ContractAddress, 
    get_caller_address,
    get_block_timestamp,
    storage::{StorageBaseAddress, StorageAccess, Store, StorageMap},
    contract_address_const
};

#[starknet::interface]
trait IBTCBridge<TContractState> {
    fn initiate_btc_deposit(ref self: TContractState, btc_txid: felt252, amount: u256, recipient: ContractAddress);
    fn verify_btc_transaction(ref self: TContractState, txid: felt252, proof: Array<u256>) -> bool;
    fn mint_wrapped_btc(ref self: TContractState, recipient: ContractAddress, amount: u256);
    fn burn_wrapped_btc(ref self: TContractState, amount: u256, btc_address: felt252) -> felt252;
    fn process_withdrawal(ref self: TContractState, withdrawal_id: felt252) -> bool;
    fn update_btc_price(ref self: TContractState, price: u256, timestamp: u64);
    fn get_btc_deposit_info(self: @TContractState, txid: felt252) -> BTCDeposit;
    fn get_wrapped_btc_supply(self: @TContractState) -> u256;
    fn get_btc_price(self: @TContractState) -> u256;
}

#[derive(Drop, Serde, starknet::Store)]
struct BTCDeposit {
    txid: felt252,
    amount: u256,
    recipient: ContractAddress,
    confirmed: bool,
    processed: bool,
    timestamp: u64,
    confirmations: u256,
}

#[derive(Drop, Serde, starknet::Store)]
struct WithdrawalRequest {
    id: felt252,
    user: ContractAddress,
    amount: u256,
    btc_address: felt252,
    status: u256, // 0 = pending, 1 = processing, 2 = completed, 3 = failed
    created_at: u64,
}

#[starknet::contract]
mod BTCBridge {
    // Component implementations
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    
    impl PausableImpl = PausableComponent::PausableImpl<ContractState>;
    impl PausableInternalImpl = PausableComponent::InternalImpl<ContractState>;
    use super::{BTCDeposit, WithdrawalRequest, IBTCBridge};
    use starknet::{
        ContractAddress, 
        get_caller_address, 
        get_block_timestamp, 
        get_contract_address,
        storage::{StorageAccess, Store, StorageMap}
    };
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::pausable::PausableComponent;
    use core::array::SpanTrait;
    use core::traits::TryInto;
    use core::traits::Into;
    use core::zeroable::Zeroable;

    #[storage]
    struct Storage {
        btc_deposits: StorageMap<felt252, BTCDeposit>,
        withdrawal_requests: StorageMap<felt252, WithdrawalRequest>,
        wrapped_btc_supply: u256,
        btc_price: u256, // Price in USD with 8 decimals
        bridge_fee: u256, // Fee in basis points (10000 = 100%)
        min_confirmations: u256, 
        wrapped_btc_token: ContractAddress,
        oracle_address: ContractAddress,
        withdrawal_counter: u256,
        ownable: OwnableComponent::Storage,
        pausable: PausableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        BTCDepositInitiated: BTCDepositInitiated,
        BTCTransactionVerified: BTCTransactionVerified,
        WrappedBTCMinted: WrappedBTCMinted,
        WrappedBTCBurned: WrappedBTCBurned,
        WithdrawalProcessed: WithdrawalProcessed,
        BTCPriceUpdated: BTCPriceUpdated,
        BridgeFeeUpdated: BridgeFeeUpdated,
        #[flat]
        Ownable: OwnableComponent::Event,
        #[flat]
        Pausable: PausableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct BTCDepositInitiated {
        #[key]
        txid: felt252,
        #[key]
        recipient: ContractAddress,
        amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct BTCTransactionVerified {
        #[key]
        txid: felt252,
        confirmations: u256,
        verified: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct WrappedBTCMinted {
        #[key]
        recipient: ContractAddress,
        amount: u256,
        txid: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct WrappedBTCBurned {
        #[key]
        user: ContractAddress,
        amount: u256,
        btc_address: felt252,
        withdrawal_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct WithdrawalProcessed {
        #[key]
        withdrawal_id: felt252,
        #[key]
        user: ContractAddress,
        amount: u256,
        status: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct BTCPriceUpdated {
        price: u256,
        timestamp: u64,
        oracle: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct BridgeFeeUpdated {
        old_fee: u256,
        new_fee: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        wrapped_btc_token: ContractAddress,
        oracle_address: ContractAddress,
        initial_btc_price: u256,
        bridge_fee: u256
    ) {
        self.ownable.initializer(owner);
        self.wrapped_btc_token.write(wrapped_btc_token);
        self.oracle_address.write(oracle_address);
        self.btc_price.write(initial_btc_price);
        self.bridge_fee.write(bridge_fee);
        self.min_confirmations.write(6); // Require 6 Bitcoin confirmations
        self.wrapped_btc_supply.write(0);
        self.withdrawal_counter.write(0);
    }

    #[abi(embed_v0)]
    impl BTCBridgeImpl of IBTCBridge<ContractState> {
        fn initiate_btc_deposit(
            ref self: ContractState,
            btc_txid: felt252,
            amount: u256,
            recipient: ContractAddress
        ) {
            self.pausable.assert_not_paused();

            let current_time = get_block_timestamp();
            let existing_deposit = self.btc_deposits.read(btc_txid);

            assert(existing_deposit.timestamp == 0, 'Deposit already exists');
            assert(amount > 0, 'Amount must be positive');

            let deposit = BTCDeposit {
                txid: btc_txid,
                amount,
                recipient,
                confirmed: false,
                processed: false,
                timestamp: current_time,
                confirmations: 0,
            };

            self.btc_deposits.write(btc_txid, deposit);

            self.emit(BTCDepositInitiated {
                txid: btc_txid,
                recipient,
                amount,
                timestamp: current_time,
            });
        }

        fn verify_btc_transaction(
            ref self: ContractState,
            txid: felt252,
            proof: Array<u256>
        ) -> bool {
            self.ownable.assert_only_owner();

            let mut deposit = self.btc_deposits.read(txid);
            assert(deposit.timestamp != 0, 'Deposit does not exist');
            assert(!deposit.processed, 'Deposit already processed');

            // In a real implementation, this would verify the Bitcoin transaction
            // using SPV proofs or other cryptographic verification methods
            let verified = self._verify_spv_proof(txid, proof);

            if verified {
                deposit.confirmations += 1;

                if deposit.confirmations >= self.min_confirmations.read() {
                    deposit.confirmed = true;

                    // Automatically mint wrapped BTC if confirmed
                    self._mint_wrapped_btc_internal(deposit.recipient, deposit.amount, txid);
                    deposit.processed = true;
                }

                self.btc_deposits.write(txid, deposit);
            }

            self.emit(BTCTransactionVerified {
                txid,
                confirmations: deposit.confirmations,
                verified,
            });

            verified
        }

        fn mint_wrapped_btc(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.ownable.assert_only_owner();
            self.pausable.assert_not_paused();

            self._mint_wrapped_btc_internal(recipient, amount, 0);
        }

        fn burn_wrapped_btc(
            ref self: ContractState,
            amount: u256,
            btc_address: felt252
        ) -> felt252 {
            self.pausable.assert_not_paused();

            let caller = get_caller_address();
            let current_time = get_block_timestamp();
            let withdrawal_id = self._generate_withdrawal_id();

            assert(amount > 0, 'Amount must be positive');

            // Calculate fee
            let fee = (amount * self.bridge_fee.read()) / 10000;
            let net_amount = amount - fee;

            // Burn wrapped BTC tokens
            let wrapped_btc = IERC20Dispatcher { contract_address: self.wrapped_btc_token.read() };
            wrapped_btc.transfer_from(caller, get_contract_address(), amount);

            self.wrapped_btc_supply.write(self.wrapped_btc_supply.read() - amount);

            // Create withdrawal request
            let withdrawal = WithdrawalRequest {
                id: withdrawal_id,
                user: caller,
                amount: net_amount,
                btc_address,
                status: 0, // pending
                created_at: current_time,
            };

            self.withdrawal_requests.write(withdrawal_id, withdrawal);

            self.emit(WrappedBTCBurned {
                user: caller,
                amount,
                btc_address,
                withdrawal_id,
            });

            withdrawal_id
        }

        fn process_withdrawal(ref self: ContractState, withdrawal_id: felt252) -> bool {
            self.ownable.assert_only_owner();

            let mut withdrawal = self.withdrawal_requests.read(withdrawal_id);
            assert(withdrawal.created_at != 0, 'Withdrawal does not exist');
            assert(withdrawal.status == 0, 'Withdrawal already processed');

            // In a real implementation, this would trigger a Bitcoin transaction
            // For now, we'll mark it as completed
            withdrawal.status = 2; // completed
            self.withdrawal_requests.write(withdrawal_id, withdrawal);

            self.emit(WithdrawalProcessed {
                withdrawal_id,
                user: withdrawal.user,
                amount: withdrawal.amount,
                status: withdrawal.status,
            });

            true
        }

        fn update_btc_price(ref self: ContractState, price: u256, timestamp: u64) {
            let caller = get_caller_address();
            let oracle = self.oracle_address.read();

            assert(caller == oracle || caller == self.ownable.owner(), 'Unauthorized price update');
            assert(price > 0, 'Price must be positive');

            self.btc_price.write(price);

            self.emit(BTCPriceUpdated {
                price,
                timestamp,
                oracle: caller,
            });
        }

        fn get_btc_deposit_info(self: @ContractState, txid: felt252) -> BTCDeposit {
            self.btc_deposits.read(txid)
        }

        fn get_wrapped_btc_supply(self: @ContractState) -> u256 {
            self.wrapped_btc_supply.read()
        }

        fn get_btc_price(self: @ContractState) -> u256 {
            self.btc_price.read()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _mint_wrapped_btc_internal(
            ref self: ContractState,
            recipient: ContractAddress,
            amount: u256,
            txid: felt252
        ) {
            let wrapped_btc = IERC20Dispatcher { contract_address: self.wrapped_btc_token.read() };
            wrapped_btc.transfer(recipient, amount);

            self.wrapped_btc_supply.write(self.wrapped_btc_supply.read() + amount);

            self.emit(WrappedBTCMinted {
                recipient,
                amount,
                txid,
            });
        }

        fn _verify_spv_proof(self: @ContractState, txid: felt252, proof: Array<u256>) -> bool {
            // Simplified verification - in reality, this would implement full SPV verification
            // This would check Merkle proofs, block headers, and difficulty adjustments
            proof.len() > 0 && txid != 0
        }

        fn _generate_withdrawal_id(ref self: ContractState) -> felt252 {
            let counter = self.withdrawal_counter.read() + 1;
            self.withdrawal_counter.write(counter);
            counter.into()
        }
    }

    // Admin functions
    #[external(v0)]
    fn set_bridge_fee(ref self: ContractState, new_fee: u256) {
        self.ownable.assert_only_owner();
        assert(new_fee <= 1000, 'Fee too high'); // Max 10%

        let old_fee = self.bridge_fee.read();
        self.bridge_fee.write(new_fee);

        self.emit(BridgeFeeUpdated {
            old_fee,
            new_fee,
        });
    }

    #[external(v0)]
    fn set_min_confirmations(ref self: ContractState, confirmations: u256) {
        self.ownable.assert_only_owner();
        assert(confirmations > 0 && confirmations <= 20, 'Invalid confirmation count');
        self.min_confirmations.write(confirmations);
    }

    #[external(v0)]
    fn pause(ref self: ContractState) {
        self.ownable.assert_only_owner();
        self.pausable.pause();
    }

    #[external(v0)]
    fn unpause(ref self: ContractState) {
        self.ownable.assert_only_owner();
        self.pausable.unpause();
    }
}