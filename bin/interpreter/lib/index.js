// =====================================================
// Constants
const constants = require('./constants');

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
const niKamusi = require('./type/check/niKamusi');
const aina = require('./type/check/aina');

// > Casting
const Nambari = require('./type/cast/Nambari');
const Jina = require('./type/cast/Jina');
const Tarehe = require('./type/cast/Tarehe');

// > Modification & reading
// >>> Iterables (Lists & Strings)
const idadi = require('./type/mod/iterable/idadi');
const sehemu = require('./type/mod/iterable/sehemu');
const ina = require('./type/mod/iterable/ina');

// >>> Lists
const badili = require('./type/mod/list/badili');
const unga = require('./type/mod/list/unga');

// >>> Strings
const tenga = require('./type/mod/string/tenga');
const herufiNdogo = require('./type/mod/string/herufiNdogo');
const herufiKubwa = require('./type/mod/string/herufiKubwa');

// >>> Numbers
const ndogo = require('./type/mod/number/ndogo');
const kubwa = require('./type/mod/number/kubwa');

// =====================================================
// Exports
module.exports = {
  constants,
  functions: [
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
    niKamusi,
    aina,
    Nambari,
    Jina,
    Tarehe,
    idadi,
    badili,
    sehemu,
    ina,
    unga,
    tenga,
    herufiNdogo,
    herufiKubwa,
    ndogo,
    kubwa,
  ],
};
