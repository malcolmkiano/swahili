const SWBoolean = require('../types/boolean');
const SWString = require('../types/string');
const SWNull = require('../types/null');

// instantiate global constants
module.exports = {
  kweli: SWBoolean.TRUE,
  uwongo: SWBoolean.FALSE,
  tupu: SWNull.NULL,
  wamlambez: new SWString('wamnyonyez'),
};
