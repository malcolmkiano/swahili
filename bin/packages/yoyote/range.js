const bit_string_generator = require('./bit_string_generator');

let total_no_of_bits = 42;
//total number of bits to be generated.
//More bits means a larger period for the random numbers generated.

const range = function rand_in_range(min, max) {
  let bit_string = bit_string_generator(6, 3, total_no_of_bits);
  bit_string = bit_string.join('');
  this.max = max;
  this.min = min;
  let l = total_no_of_bits + 1;
  let numerator = parseInt(bit_string, 2);
  let random_number = numerator / Math.pow(2, l);
  random_number = min + random_number * (max - min); //Genrates a random number in the specified range

  return Math.floor(random_number);
};

module.exports = range;
