function bitStringGenerator(q, r, bitCount) {
  // Remember 0 < r < q < bitCount
  let initSquence = []; // creates initial bit array of q-1 bits.
  for (let i = 0; i < q; i++) {
    initSquence[i] = Math.round(Math.random());
  }

  let initialBits = initSquence;
  // generates the next bits from q to the total number of bits required.
  for (let i = q; i < bitCount; i++) {
    initialBits[i] = (initialBits[i - r] + initialBits[i - q]) % 2;
  }

  return initialBits; // returns an array of bits
}

module.exports = bitStringGenerator;
