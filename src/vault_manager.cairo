use starknet::ContractAddress;
use starknet::get_caller_address;
use starknet::get_block_timestamp;

#[starknet::interface]
trait IVaultManager<TContractState> {
    fn create_vault(ref self: TContractState, asset_type: u256, initial_deposit: u256) -> u256;
    fn deposit(ref self: TContractState, vault_id: u256, amount: u256, asset: ContractAddress);
    fn withdraw(ref self: TContractState, vault_id: u256, amount: u256) -> bool;
    fn stake_btc(ref self: TContractState, vault_id: u256, amount: u256) -> bool;
    fn unstake_btc(ref self: TContractState, vault_id: u256, amount: u256) -> bool;
    fn calculate_yield(self: @TContractState, vault_id: u256) -> u256;
    fn emergency_withdraw(ref self: TContractState, vault_id: u256) -> bool;
    fn get_vault_info(self: @TContractState, vault_id: u256) -> Vault;
    fn get_total_btc_staked(self: @TContractState) -> u256;
}

#[derive(Drop, Serde, starknet::Store)]
struct Vault {
    owner: ContractAddress,
    asset_type: u256, // 0 = BTC, 1 = ETH, 2 = STRK
    total_deposited: u256,
    staked_amount: u256,
    last_yield_calculation: u64,
    created_at: u64,
    is_active: bool,
}

#[starknet::contract]
mod VaultManager {
    use super::{Vault, IVaultManager};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_security::reentrancyguard::ReentrancyGuardComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        vaults: starknet::storage::Map<u256, Vault>,
        vault_count: u256,
        total_btc_staked: u256,
        yield_rate: u256, // Annual yield rate in basis points (10000 = 100%)
        btc_token: ContractAddress,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        VaultCreated: VaultCreated,
        Deposited: Deposited,
        Withdrawn: Withdrawn,
        BTCStaked: BTCStaked,
        BTCUnstaked: BTCUnstaked,
        YieldCalculated: YieldCalculated,
        EmergencyWithdrawal: EmergencyWithdrawal,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct VaultCreated {
        #[key]
        vault_id: u256,
        #[key]
        owner: ContractAddress,
        asset_type: u256,
        initial_deposit: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Deposited {
        #[key]
        vault_id: u256,
        #[key]
        user: ContractAddress,
        amount: u256,
        asset: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct Withdrawn {
        #[key]
        vault_id: u256,
        #[key]
        user: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct BTCStaked {
        #[key]
        vault_id: u256,
        amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct BTCUnstaked {
        #[key]
        vault_id: u256,
        amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct YieldCalculated {
        #[key]
        vault_id: u256,
        yield_amount: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct EmergencyWithdrawal {
        #[key]
        vault_id: u256,
        #[key]
        owner: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, btc_token: ContractAddress) {
        self.ownable.initializer(owner);
        self.vault_count.write(0);
        self.total_btc_staked.write(0);
        self.yield_rate.write(500); // 5% annual yield
        self.btc_token.write(btc_token);
    }

    #[abi(embed_v0)]
    impl VaultManagerImpl of IVaultManager<ContractState> {
        fn create_vault(ref self: ContractState, asset_type: u256, initial_deposit: u256) -> u256 {
            let caller = get_caller_address();
            let current_time = get_block_timestamp();
            let vault_id = self.vault_count.read() + 1;

            let new_vault = Vault {
                owner: caller,
                asset_type,
                total_deposited: initial_deposit,
                staked_amount: 0,
                last_yield_calculation: current_time,
                created_at: current_time,
                is_active: true,
            };

            self.vaults.write(vault_id, new_vault);
            self.vault_count.write(vault_id);

            // Handle initial deposit if provided
            if initial_deposit > 0 {
                self._handle_deposit(vault_id, initial_deposit, caller);
            }

            self.emit(VaultCreated {
                vault_id,
                owner: caller,
                asset_type,
                initial_deposit,
            });

            vault_id
        }

        fn deposit(ref self: ContractState, vault_id: u256, amount: u256, asset: ContractAddress) {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            let mut vault = self.vaults.read(vault_id);

            assert(vault.is_active, 'Vault is not active');
            assert(vault.owner == caller, 'Not vault owner');
            assert(amount > 0, 'Amount must be positive');

            // Transfer tokens from user to contract
            let token = IERC20Dispatcher { contract_address: asset };
            token.transfer_from(caller, get_contract_address(), amount);

            vault.total_deposited += amount;
            self.vaults.write(vault_id, vault);

            self.emit(Deposited {
                vault_id,
                user: caller,
                amount,
                asset,
            });

            self.reentrancy_guard.end();
        }

        fn withdraw(ref self: ContractState, vault_id: u256, amount: u256) -> bool {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            let mut vault = self.vaults.read(vault_id);

            assert(vault.is_active, 'Vault is not active');
            assert(vault.owner == caller, 'Not vault owner');
            assert(amount > 0, 'Amount must be positive');
            assert(vault.total_deposited >= amount, 'Insufficient balance');

            vault.total_deposited -= amount;
            self.vaults.write(vault_id, vault);

            // Transfer tokens back to user
            let btc_token = IERC20Dispatcher { contract_address: self.btc_token.read() };
            btc_token.transfer(caller, amount);

            self.emit(Withdrawn {
                vault_id,
                user: caller,
                amount,
            });

            self.reentrancy_guard.end();
            true
        }

        fn stake_btc(ref self: ContractState, vault_id: u256, amount: u256) -> bool {
            let caller = get_caller_address();
            let mut vault = self.vaults.read(vault_id);
            let current_time = get_block_timestamp();

            assert(vault.is_active, 'Vault is not active');
            assert(vault.owner == caller, 'Not vault owner');
            assert(amount > 0, 'Amount must be positive');
            assert(vault.total_deposited >= amount, 'Insufficient balance');

            vault.staked_amount += amount;
            vault.total_deposited -= amount;
            self.vaults.write(vault_id, vault);

            self.total_btc_staked.write(self.total_btc_staked.read() + amount);

            self.emit(BTCStaked {
                vault_id,
                amount,
                timestamp: current_time,
            });

            true
        }

        fn unstake_btc(ref self: ContractState, vault_id: u256, amount: u256) -> bool {
            let caller = get_caller_address();
            let mut vault = self.vaults.read(vault_id);
            let current_time = get_block_timestamp();

            assert(vault.is_active, 'Vault is not active');
            assert(vault.owner == caller, 'Not vault owner');
            assert(amount > 0, 'Amount must be positive');
            assert(vault.staked_amount >= amount, 'Insufficient staked amount');

            vault.staked_amount -= amount;
            vault.total_deposited += amount;
            self.vaults.write(vault_id, vault);

            self.total_btc_staked.write(self.total_btc_staked.read() - amount);

            self.emit(BTCUnstaked {
                vault_id,
                amount,
                timestamp: current_time,
            });

            true
        }

        fn calculate_yield(self: @ContractState, vault_id: u256) -> u256 {
            let vault = self.vaults.read(vault_id);
            let current_time = get_block_timestamp();
            let time_diff = current_time - vault.last_yield_calculation;

            if vault.staked_amount == 0 || time_diff == 0 {
                return 0;
            }

            let yield_rate = self.yield_rate.read();
            let seconds_in_year: u256 = 31536000;

            // Calculate yield: (staked_amount * yield_rate * time_diff) / (10000 * seconds_in_year)
            let yield_amount = (vault.staked_amount * yield_rate * time_diff.into()) / (10000 * seconds_in_year);

            yield_amount
        }

        fn emergency_withdraw(ref self: ContractState, vault_id: u256) -> bool {
            let caller = get_caller_address();
            let mut vault = self.vaults.read(vault_id);

            assert(vault.owner == caller, 'Not vault owner');

            let total_amount = vault.total_deposited + vault.staked_amount;

            vault.total_deposited = 0;
            vault.staked_amount = 0;
            vault.is_active = false;

            self.vaults.write(vault_id, vault);

            // Transfer all funds back to owner
            if total_amount > 0 {
                let btc_token = IERC20Dispatcher { contract_address: self.btc_token.read() };
                btc_token.transfer(caller, total_amount);
            }

            self.emit(EmergencyWithdrawal {
                vault_id,
                owner: caller,
                amount: total_amount,
            });

            true
        }

        fn get_vault_info(self: @ContractState, vault_id: u256) -> Vault {
            self.vaults.read(vault_id)
        }

        fn get_total_btc_staked(self: @ContractState) -> u256 {
            self.total_btc_staked.read()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _handle_deposit(ref self: ContractState, vault_id: u256, amount: u256, caller: ContractAddress) {
            // Internal logic for handling deposits
            let btc_token = IERC20Dispatcher { contract_address: self.btc_token.read() };
            btc_token.transfer_from(caller, get_contract_address(), amount);
        }
    }
}