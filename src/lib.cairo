use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use openzeppelin::prelude::SnTrait;
use openzeppelin::access::ownable::OwnableComponent;
use openzeppelin::security::pausable::PausableComponent;
use openzeppelin::security::reentrancyguard::ReentrancyGuardComponent;
use starknet::storage_access::{StorageAddress, Store};
use core::array::SpanTrait;

mod utils {
    pub mod hash;
}

#[cfg(test)]
mod tests;

pub mod vault_manager;
pub mod btc_bridge;
pub mod yield_optimizer;
pub mod privacy_mixer;

#[derive(Drop, Copy, Serde, storage_access::StorageAccess)]
struct EventEmitter;

impl EventEmitterImpl of SnTrait<EventEmitter> {
    fn emit<T, impl TEvent: starknet::Event<T>>(self: EventEmitter, event: T) {
        starknet::emit_event(event);
    }
}
