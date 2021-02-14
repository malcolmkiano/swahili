//Remember 0 < r < q < total_number_of_bits

const bit_string_generator = function bit_string_generator(
  q,
  r,
  total_no_of_bits
) {
  let init_sequence = []; //creates initial bit array of q-1 bits.
  for (let i = 0; i < q; i++) {
    if (Math.random() > 0.5) {
      init_sequence[i] = 1;
    } else {
      init_sequence[i] = 0;
    }
  }

  let initial_bits = init_sequence;
  //genrates the next bits from q to the total number of bits required.
  for (let i = q; i < total_no_of_bits; i++) {
    initial_bits[i] = (initial_bits[i - r] + initial_bits[i - q]) % 2;
  }

  return initial_bits; //return an array of bits
};

module.exports = bit_string_generator;
