// =====================================================
// I/O methods
const andika = require('./io/andika');
const soma = require('./io/soma');
const somaNambari = require('./io/somaNambari');
const futa = require('./io/futa');

// =====================================================
// Type methods
// > Checking
const niNambari = require('./type/check/niNambari');
const niJina = require('./type/check/niJina');
const niOrodha = require('./type/check/niOrodha');
const niShughuli = require('./type/check/niShughuli');
const niTupu = require('./type/check/niTupu');
const niTarehe = require('./type/check/niTarehe');

// > Casting
const Nambari = require('./type/cast/Nambari');
const Jina = require('./type/cast/Jina');
const Tarehe = require('./type/cast/Tarehe');

// > Modification & reading
const idadi = require('./type/mod/iterable/idadi');
const badili = require('./type/mod/list/badili');

// =====================================================
// Misc methods
const wamlambez = require('./misc/wamlambez');

// =====================================================
// Exports
module.exports = [
  andika,
  soma,
  somaNambari,
  futa,
  niNambari,
  niJina,
  niOrodha,
  niShughuli,
  niTupu,
  niTarehe,
  Nambari,
  Jina,
  Tarehe,
  idadi,
  badili,
  wamlambez,
];
