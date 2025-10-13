use core::traits::Into;
use core::option::OptionTrait;
use core::array::SpanTrait;
use starknet::core::pedersen::PedersenTrait;

fn hash_array(data: Span<felt252>) -> felt252 {
    let mut state = 0;
    let mut i = 0;
    
    loop {
        if i >= data.len() {
            break state;
        }
        state = PedersenTrait::new(state).update(*data.at(i)).finalize();
        i = i + 1;
    }
}

fn hash_u256(value: u256) -> felt252 {
    PedersenTrait::new(0)
        .update(value.low.into())
        .update(value.high.into())
        .finalize()
}