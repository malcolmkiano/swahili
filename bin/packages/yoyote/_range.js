const bitStringGenerator = require('./_bitStringGenerator');

let bitCount = 42; // total number of bits to be generated.
// More bits means a larger period for the random numbers generated.

function range(min, max) {
  let bitArray = bitStringGenerator(6, 3, bitCount);
  let bitString = bitArray.join('');
  let l = bitCount + 1;
  let numerator = parseInt(bitString, 2);
  let randomNumber = numerator / Math.pow(2, l);
  randomNumber = min + randomNumber * (max - min); // Generates a random number in the specified range

  return Math.floor(randomNumber);
}

module.exports = range;
