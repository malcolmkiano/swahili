const SWBoolean = include('bin/interpreter/types/boolean');
const SWString = include('bin/interpreter/types/string');
const SWNull = include('bin/interpreter/types/null');

// instantiate global constants
module.exports = {
  kweli: SWBoolean.TRUE,
  uwongo: SWBoolean.FALSE,
  tupu: SWNull.NULL,
  wamlambez: new SWString('wamnyonyez'),
};
