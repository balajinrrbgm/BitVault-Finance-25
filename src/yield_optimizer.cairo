use starknet::ContractAddress;
use starknet::get_caller_address;
use starknet::get_block_timestamp;
use starknet::storage::{LegacyMap, StorageAccess};
use openzeppelin::access::ownable::interface::IOwnable;
use openzeppelin::security::reentrancyguard::interface::IReentrancyGuard;
use openzeppelin::access::ownable::ownable::OwnableComponent;
use openzeppelin::security::reentrancyguard::reentrancyguard::ReentrancyGuardComponent;

#[starknet::interface]
trait IYieldOptimizer<TContractState> {
    fn optimize_yield(ref self: TContractState, vault_id: u256) -> bool;
    fn rebalance_portfolio(ref self: TContractState, vault_id: u256) -> bool;
    fn compound_rewards(ref self: TContractState, vault_id: u256) -> u256;
    fn calculate_apy(self: @TContractState, protocol_id: u256) -> u256;
    fn migrate_funds(ref self: TContractState, vault_id: u256, from_protocol: u256, to_protocol: u256, amount: u256) -> bool;
    fn harvest_rewards(ref self: TContractState, vault_id: u256) -> u256;
    fn add_protocol(ref self: TContractState, protocol_address: ContractAddress, base_apy: u256) -> u256;
    fn update_protocol_apy(ref self: TContractState, protocol_id: u256, new_apy: u256);
    fn get_vault_allocation(self: @TContractState, vault_id: u256) -> Allocation;
    fn get_protocol_info(self: @TContractState, protocol_id: u256) -> Protocol;
    fn get_best_yield_protocol(self: @TContractState) -> u256;
}

#[derive(Drop, Serde, starknet::Store)]
struct Allocation {
    vault_id: u256,
    protocol_allocations: LegacyMap<u256, u256>, // protocol_id -> amount
    total_allocated: u256,
    last_rebalance: u64,
    target_allocation: LegacyMap<u256, u256>, // protocol_id -> percentage (basis points)
}

#[derive(Drop, Serde, starknet::Store)]
struct Protocol {
    id: u256,
    apy: u256,
    total_tvl: u256,
    min_allocation: u256,
    max_allocation: u256,
    is_active: bool,
    last_update: u64,
    current_apy: u256,
    risk_level: u8,
}

#[derive(Drop, Serde, starknet::Store)]
struct RewardHarvest {
    vault_id: u256,
    protocol_id: u256,
    amount_harvested: u256,
    timestamp: u64,
    gas_cost: u256,
}

#[starknet::contract]
mod YieldOptimizer {
    use super::{Allocation, Protocol, RewardHarvest, IYieldOptimizer};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::access::ownable::interface::IOwnable;
    use openzeppelin::security::reentrancyguard::interface::IReentrancyGuard;
    use openzeppelin::access::ownable::ownable::OwnableComponent;
    use openzeppelin::security::reentrancyguard::reentrancyguard::ReentrancyGuardComponent;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum OwnableEvent {}

    #[event]
    #[derive(Drop, starknet::Event)]
    enum ReentrancyGuardEvent {}

    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl ReentrancyGuardImpl = ReentrancyGuardComponent::ReentrancyGuardImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;
    impl StorageAccessStorageField = starknet::storage_access::StorageFieldImpl<ContractState>;
    impl StorageAccessComponents = starknet::storage_access::StorageAccessImpl<ContractState>;

    #[storage]
    struct Storage {
        protocol_apys: LegacyMap<u256, u256>,
        protocols: LegacyMap<u256, Protocol>,
        vault_allocations: LegacyMap<u256, Allocation>,
        last_rebalance: LegacyMap<u256, u64>,
        protocol_allocations: LegacyMap<(u256, u256), u256>, // (protocol_id, vault_id) -> amount
        target_allocations: LegacyMap<(u256, u256), u256>, // (protocol_id, vault_id) -> percentage
        protocol_count: u256,
        vault_manager: ContractAddress,
        rebalance_threshold: u256, // Basis points difference to trigger rebalance
        min_rebalance_interval: u64, // Minimum seconds between rebalances
        performance_fee: u256, // Fee in basis points for yield optimization
        reward_harvests: LegacyMap<u256, RewardHarvest>, // harvest_id -> harvest info
        harvest_counter: u256,
        ownable: OwnableComponent::Storage,
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        YieldOptimized: YieldOptimized,
        PortfolioRebalanced: PortfolioRebalanced,
        RewardsCompounded: RewardsCompounded,
        FundsMigrated: FundsMigrated,
        RewardsHarvested: RewardsHarvested,
        ProtocolAdded: ProtocolAdded,
        ProtocolAPYUpdated: ProtocolAPYUpdated,
        PerformanceFeeCollected: PerformanceFeeCollected,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    struct YieldOptimized {
        #[key]
        vault_id: u256,
        old_apy: u256,
        new_apy: u256,
        optimization_strategy: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct PortfolioRebalanced {
        #[key]
        vault_id: u256,
        rebalance_reason: felt252,
        gas_used: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct RewardsCompounded {
        #[key]
        vault_id: u256,
        rewards_amount: u256,
        new_total: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct FundsMigrated {
        #[key]
        vault_id: u256,
        from_protocol: u256,
        to_protocol: u256,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct RewardsHarvested {
        #[key]
        vault_id: u256,
        #[key]
        protocol_id: u256,
        amount: u256,
        gas_cost: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ProtocolAdded {
        #[key]
        protocol_id: u256,
        contract_address: ContractAddress,
        name: felt252,
        initial_apy: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ProtocolAPYUpdated {
        #[key]
        protocol_id: u256,
        old_apy: u256,
        new_apy: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct PerformanceFeeCollected {
        #[key]
        vault_id: u256,
        fee_amount: u256,
        performance_period: u64,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        vault_manager: ContractAddress,
        rebalance_threshold: u256,
        performance_fee: u256
    ) {
        self.ownable.initializer(owner);
        self.vault_manager.write(vault_manager);
        self.rebalance_threshold.write(rebalance_threshold);
        self.min_rebalance_interval.write(3600); // 1 hour minimum
        self.performance_fee.write(performance_fee);
        self.protocol_count.write(0);
        self.harvest_counter.write(0);
    }

    #[abi(embed_v0)]
    impl YieldOptimizerImpl of IYieldOptimizer<ContractState> {
        fn optimize_yield(ref self: ContractState, vault_id: u256) -> bool {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            self._assert_vault_owner_or_manager(vault_id, caller);

            let current_time = get_block_timestamp();
            let allocation = self.vault_allocations.read(vault_id);

            // Check if rebalancing is needed based on APY changes
            let best_protocol = self.get_best_yield_protocol();
            let best_apy = self.protocol_apys.read(best_protocol);

            // Get current weighted APY
            let current_apy = self._calculate_portfolio_apy(vault_id);

            if best_apy > current_apy + self.rebalance_threshold.read() {
                // Trigger rebalancing to higher yield protocols
                self.rebalance_portfolio(vault_id);

                self.emit(YieldOptimized {
                    vault_id,
                    old_apy: current_apy,
                    new_apy: best_apy,
                    optimization_strategy: 'apy_maximization',
                });
            }

            self.reentrancy_guard.end();
            true
        }

        fn rebalance_portfolio(ref self: ContractState, vault_id: u256) -> bool {
            let caller = get_caller_address();
            self._assert_vault_owner_or_manager(vault_id, caller);

            let current_time = get_block_timestamp();
            let mut allocation = self.vault_allocations.read(vault_id);

            // Check minimum rebalance interval
            if current_time - allocation.last_rebalance < self.min_rebalance_interval.read() {
                return false;
            }

            // Calculate optimal allocation based on current APYs and risk
            let optimal_allocation = self._calculate_optimal_allocation(vault_id);

            // Execute rebalancing trades
            self._execute_rebalancing(vault_id, optimal_allocation);

            allocation.last_rebalance = current_time;
            self.vault_allocations.write(vault_id, allocation);

            self.emit(PortfolioRebalanced {
                vault_id,
                rebalance_reason: 'scheduled_optimization',
                gas_used: 0, // Would track actual gas in production
                timestamp: current_time,
            });

            true
        }

        fn compound_rewards(ref self: ContractState, vault_id: u256) -> u256 {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            self._assert_vault_owner_or_manager(vault_id, caller);

            let total_rewards = self.harvest_rewards(vault_id);

            if total_rewards > 0 {
                // Calculate performance fee
                let fee = (total_rewards * self.performance_fee.read()) / 10000;
                let net_rewards = total_rewards - fee;

                // Reinvest net rewards back into the vault
                self._reinvest_rewards(vault_id, net_rewards);

                // Transfer performance fee to owner
                if fee > 0 {
                    self._transfer_performance_fee(vault_id, fee);
                }

                self.emit(RewardsCompounded {
                    vault_id,
                    rewards_amount: net_rewards,
                    new_total: net_rewards, // Would be actual new total in production
                });
            }

            self.reentrancy_guard.end();
            total_rewards
        }

        fn calculate_apy(self: @ContractState, protocol_id: u256) -> u256 {
            let protocol = self.protocols.read(protocol_id);
            if !protocol.is_active {
                return 0;
            }

            // In production, this would fetch real-time APY from the protocol
            protocol.current_apy
        }

        fn migrate_funds(
            ref self: ContractState,
            vault_id: u256,
            from_protocol: u256,
            to_protocol: u256,
            amount: u256
        ) -> bool {
            let caller = get_caller_address();
            self._assert_vault_owner_or_manager(vault_id, caller);

            assert(amount > 0, 'Amount must be positive');
            assert(from_protocol != to_protocol, 'Same protocol');

            let from_protocol_info = self.protocols.read(from_protocol);
            let to_protocol_info = self.protocols.read(to_protocol);

            assert(from_protocol_info.is_active, 'From protocol inactive');
            assert(to_protocol_info.is_active, 'To protocol inactive');

            // Execute the migration (simplified)
            self._execute_migration(vault_id, from_protocol, to_protocol, amount);

            self.emit(FundsMigrated {
                vault_id,
                from_protocol,
                to_protocol,
                amount,
            });

            true
        }

        fn harvest_rewards(ref self: ContractState, vault_id: u256) -> u256 {
            let caller = get_caller_address();
            self._assert_vault_owner_or_manager(vault_id, caller);

            let current_time = get_block_timestamp();
            let allocation = self.vault_allocations.read(vault_id);

            let mut total_harvested: u256 = 0;

            // Harvest from each protocol (simplified implementation)
            let protocol_count = self.protocol_count.read();
            let mut i: u256 = 1;

            loop {
                if i > protocol_count {
                    break;
                }

                let protocol = self.protocols.read(i);
                if protocol.is_active {
                    let harvested = self._harvest_from_protocol(vault_id, i);
                    total_harvested += harvested;

                    if harvested > 0 {
                        // Record harvest
                        let harvest_id = self.harvest_counter.read() + 1;
                        self.harvest_counter.write(harvest_id);

                        let harvest_record = RewardHarvest {
                            vault_id,
                            protocol_id: i,
                            amount_harvested: harvested,
                            timestamp: current_time,
                            gas_cost: 0, // Would track actual gas
                        };

                        self.reward_harvests.write(harvest_id, harvest_record);

                        self.emit(RewardsHarvested {
                            vault_id,
                            protocol_id: i,
                            amount: harvested,
                            gas_cost: 0,
                        });
                    }
                }

                i += 1;
            };

            total_harvested
        }

        fn add_protocol(
            ref self: ContractState,
            protocol_address: ContractAddress,
            base_apy: u256
        ) -> u256 {
            self.ownable.assert_only_owner();

            let protocol_id = self.protocol_count.read() + 1;
            self.protocol_count.write(protocol_id);

            let protocol = Protocol {
                id: protocol_id,
                contract_address: protocol_address,
                name: 'new_protocol', // Would be passed as parameter
                current_apy: base_apy,
                risk_level: 5, // Default medium risk
                tvl: 0,
                is_active: true,
                last_updated: get_block_timestamp(),
            };

            self.protocols.write(protocol_id, protocol);
            self.protocol_apys.write(protocol_id, base_apy);

            self.emit(ProtocolAdded {
                protocol_id,
                contract_address: protocol_address,
                name: 'new_protocol',
                initial_apy: base_apy,
            });

            protocol_id
        }

        fn update_protocol_apy(ref self: ContractState, protocol_id: u256, new_apy: u256) {
            self.ownable.assert_only_owner();

            let old_apy = self.protocol_apys.read(protocol_id);
            self.protocol_apys.write(protocol_id, new_apy);

            let mut protocol = self.protocols.read(protocol_id);
            protocol.current_apy = new_apy;
            protocol.last_updated = get_block_timestamp();
            self.protocols.write(protocol_id, protocol);

            self.emit(ProtocolAPYUpdated {
                protocol_id,
                old_apy,
                new_apy,
                timestamp: get_block_timestamp(),
            });
        }

        fn get_vault_allocation(self: @ContractState, vault_id: u256) -> Allocation {
            self.vault_allocations.read(vault_id)
        }

        fn get_protocol_info(self: @ContractState, protocol_id: u256) -> Protocol {
            self.protocols.read(protocol_id)
        }

        fn get_best_yield_protocol(self: @ContractState) -> u256 {
            let protocol_count = self.protocol_count.read();
            let mut best_protocol: u256 = 1;
            let mut best_apy: u256 = 0;
            let mut i: u256 = 1;

            loop {
                if i > protocol_count {
                    break;
                }

                let protocol = self.protocols.read(i);
                if protocol.is_active && protocol.current_apy > best_apy {
                    best_apy = protocol.current_apy;
                    best_protocol = i;
                }

                i += 1;
            };

            best_protocol
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _assert_vault_owner_or_manager(self: @ContractState, vault_id: u256, caller: ContractAddress) {
            // Would check vault ownership or manager permissions
            // For now, simplified check
            assert(caller != starknet::contract_address_const::<0>(), 'Invalid caller');
        }

        fn _calculate_portfolio_apy(self: @ContractState, vault_id: u256) -> u256 {
            // Calculate weighted average APY of current allocation
            // Simplified implementation
            let allocation = self.vault_allocations.read(vault_id);

            if allocation.total_allocated == 0 {
                return 0;
            }

            // In production, would calculate weighted average based on actual allocations
            500 // Return 5% as default
        }

        fn _calculate_optimal_allocation(self: @ContractState, vault_id: u256) -> Array<(u256, u256)> {
            // Calculate optimal allocation based on APY and risk
            // Simplified implementation returning array of (protocol_id, percentage)
            let mut allocations = ArrayTrait::new();
            allocations.append((1, 5000)); // 50% to protocol 1
            allocations.append((2, 5000)); // 50% to protocol 2
            allocations
        }

        fn _execute_rebalancing(ref self: ContractState, vault_id: u256, allocations: Array<(u256, u256)>) {
            // Execute actual rebalancing trades
            // Simplified implementation
        }

        fn _reinvest_rewards(ref self: ContractState, vault_id: u256, amount: u256) {
            // Reinvest rewards back into optimal protocols
            // Simplified implementation
        }

        fn _transfer_performance_fee(ref self: ContractState, vault_id: u256, fee: u256) {
            // Transfer performance fee to contract owner
            // Simplified implementation
            self.emit(PerformanceFeeCollected {
                vault_id,
                fee_amount: fee,
                performance_period: 86400, // 1 day
            });
        }

        fn _execute_migration(
            ref self: ContractState,
            vault_id: u256,
            from_protocol: u256,
            to_protocol: u256,
            amount: u256
        ) {
            // Execute fund migration between protocols
            // Simplified implementation
        }

        fn _harvest_from_protocol(ref self: ContractState, vault_id: u256, protocol_id: u256) -> u256 {
            // Harvest rewards from specific protocol
            // Simplified implementation returns mock reward
            if protocol_id <= self.protocol_count.read() {
                100 // Mock reward amount
            } else {
                0
            }
        }
    }
}