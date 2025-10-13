use starknet::storage::{Store, StorageMapMemberAccessTrait, StorageAddress, storage_base_address_from_felt252, storage_access};

#[derive(Drop)]
struct FeltBoolMap {
    base_address: StorageAddress,
}

impl FeltBoolMapImpl of StorageMapMemberAccessTrait<felt252, bool> {
    fn read(self: @FeltBoolMap, key: felt252) -> bool {
        let raw = starknet::storage_access::storage_read_syscall(*self.base_address, key.into()).unwrap();
        if raw == 0 {
            false
        } else {
            true
        }
    }

    fn write(ref self: FeltBoolMap, key: felt252, value: bool) {
        let raw = if value { 1 } else { 0 };
        starknet::storage_access::storage_write_syscall(*self.base_address, key.into(), raw.into());
    }
}