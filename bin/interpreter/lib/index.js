// =====================================================
// Constants
const constants = require('./constants');

// =====================================================
// Async methods
const subiri = require('./async/subiri');
const rudia = require('./async/rudia');
const komesha = require('./async/komesha');

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
const RegEx = require('./type/cast/RegEx');

// > Modification & reading
// >>> Iterables (Lists & Strings)
const idadi = require('./type/mod/iterable/idadi');
const sehemu = require('./type/mod/iterable/sehemu');
const ina = require('./type/mod/iterable/ina');
const pahala = require('./type/mod/iterable/pahala');

// >>> Lists
const weka = require('./type/mod/list/weka');
const unga = require('./type/mod/list/unga');
const fanya = require('./type/mod/list/fanya');
const panga = require('./type/mod/list/panga');

// >>> Strings
const tenga = require('./type/mod/string/tenga');
const badili = require('./type/mod/string/badili');
const herufiNdogo = require('./type/mod/string/herufiNdogo');
const herufiKubwa = require('./type/mod/string/herufiKubwa');

// >>> Numbers
const ndogo = require('./type/mod/number/ndogo');
const kubwa = require('./type/mod/number/kubwa');

// >>> Objects
const viingilio = require('./type/mod/object/viingilio');

// >>> Dates
const unda = require('./type/mod/date/unda');

// =====================================================
// Exports
module.exports = {
  constants,
  functions: [
    subiri,
    rudia,
    komesha,
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
    RegEx,
    idadi,
    sehemu,
    ina,
    pahala,
    weka,
    unga,
    fanya,
    panga,
    tenga,
    badili,
    herufiNdogo,
    herufiKubwa,
    ndogo,
    kubwa,
    viingilio,
    unda,
  ],
};
