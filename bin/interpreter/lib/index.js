// =====================================================
// Constants
const constants = include('bin/interpreter/lib/constants');

// =====================================================
// I/O methods
const andika = include('bin/interpreter/lib/io/andika');
const soma = include('bin/interpreter/lib/io/soma');
const somaNambari = include('bin/interpreter/lib/io/somaNambari');
const futa = include('bin/interpreter/lib/io/futa');

// =====================================================
// Type methods
// > Checking
const niNambari = include('bin/interpreter/lib/type/check/niNambari');
const niJina = include('bin/interpreter/lib/type/check/niJina');
const niOrodha = include('bin/interpreter/lib/type/check/niOrodha');
const niShughuli = include('bin/interpreter/lib/type/check/niShughuli');
const niTupu = include('bin/interpreter/lib/type/check/niTupu');
const niTarehe = include('bin/interpreter/lib/type/check/niTarehe');
const niKamusi = include('bin/interpreter/lib/type/check/niKamusi');
const aina = include('bin/interpreter/lib/type/check/aina');

// > Casting
const Nambari = include('bin/interpreter/lib/type/cast/Nambari');
const Jina = include('bin/interpreter/lib/type/cast/Jina');
const Tarehe = include('bin/interpreter/lib/type/cast/Tarehe');

// > Modification & reading
// >>> Iterables (Lists & Strings)
const idadi = include('bin/interpreter/lib/type/mod/iterable/idadi');
const sehemu = include('bin/interpreter/lib/type/mod/iterable/sehemu');
const ina = include('bin/interpreter/lib/type/mod/iterable/ina');

// >>> Lists
const badili = include('bin/interpreter/lib/type/mod/list/badili');
const unga = include('bin/interpreter/lib/type/mod/list/unga');

// >>> Strings
const tenga = include('bin/interpreter/lib/type/mod/string/tenga');
const herufiNdogo = include('bin/interpreter/lib/type/mod/string/herufiNdogo');
const herufiKubwa = include('bin/interpreter/lib/type/mod/string/herufiKubwa');

// >>> Numbers
const ndogo = include('bin/interpreter/lib/type/mod/number/ndogo');
const kubwa = include('bin/interpreter/lib/type/mod/number/kubwa');

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
