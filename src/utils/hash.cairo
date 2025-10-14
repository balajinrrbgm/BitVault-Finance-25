use core::traits::Into;
use core::array::SpanTrait;
use core::poseidon::poseidon_hash_span;

pub fn hash_array(data: Span<felt252>) -> felt252 {
    poseidon_hash_span(data)
}

pub fn hash_u256(value: u256) -> felt252 {
    let data = array![value.low.into(), value.high.into()];
    poseidon_hash_span(data.span())
}
