// =====================================================
// Constants
const constants = require('@lib/constants');

// =====================================================
// I/O methods
const andika = require('@lib/io/andika');
const soma = require('@lib/io/soma');
const somaNambari = require('@lib/io/somaNambari');
const futa = require('@lib/io/futa');

// =====================================================
// Type methods
// > Checking
const niNambari = require('@lib/type/check/niNambari');
const niJina = require('@lib/type/check/niJina');
const niOrodha = require('@lib/type/check/niOrodha');
const niShughuli = require('@lib/type/check/niShughuli');
const niTupu = require('@lib/type/check/niTupu');
const niTarehe = require('@lib/type/check/niTarehe');
const niKamusi = require('@lib/type/check/niKamusi');
const aina = require('@lib/type/check/aina');

// > Casting
const Nambari = require('@lib/type/cast/Nambari');
const Jina = require('@lib/type/cast/Jina');
const Tarehe = require('@lib/type/cast/Tarehe');

// > Modification & reading
// >>> Iterables (Lists & Strings)
const idadi = require('@lib/type/mod/iterable/idadi');
const badili = require('@lib/type/mod/list/badili');

// >>> Lists
const unga = require('@lib/type/mod/list/unga');

// >>> Strings
const tenga = require('@lib/type/mod/string/tenga');
const herufiNdogo = require('@lib/type/mod/string/herufiNdogo');
const herufiKubwa = require('@lib/type/mod/string/herufiKubwa');

// >>> Numbers
const ndogo = require('@lib/type/mod/number/ndogo');
const kubwa = require('@lib/type/mod/number/kubwa');

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
    unga,
    tenga,
    herufiNdogo,
    herufiKubwa,
    ndogo,
    kubwa,
  ],
};
