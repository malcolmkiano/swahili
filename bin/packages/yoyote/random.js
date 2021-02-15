const bitStringGenerator = require('./bitStringGenerator');

let bitCount = 48; // total number of bits to be generated.
// NOTE: More bits means a larger period for the random numbers generated.

const random = function rand() {
  let bitArray = bitStringGenerator(6, 3, bitCount);
  let bitString = bitArray.join('');
  let l = bitCount + 1;
  let numerator = parseInt(bitString, 2); // convert bit string to decimal from binary.
  let randomNumber = (numerator * 1.0) / Math.pow(2, l); // convert bit string to a fraction.

  return randomNumber.toFixed(18); // returns the fraction to a fixed number of decimal places.
};

module.exports = random;
