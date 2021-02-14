const bit_string_generator = require('./bit_string_generator');

let total_no_of_bits = 48;
//total number of bits to be generated.
//More bits means a larger period for the random numbers generated.

const random = function rand() {
  let bit_arr = bit_string_generator(6, 3, total_no_of_bits);
  let bit_string = bit_arr.join('');
  let l = total_no_of_bits + 1;
  let numerator = parseInt(bit_string, 2); //convert bit string to decimal from binary.
  let random_number = (numerator * 1.0) / Math.pow(2, l); //convert bit string to a fraction.

  return random_number.toFixed(18); //returns the fraction to a fixed number of decimal places.
};

module.exports = random;
