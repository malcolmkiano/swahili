const SWList = require('../../interpreter/types/list');
const SWObject = require('../../interpreter/types/object');
const SWBoolean = require('../../interpreter/types/boolean');
const SWString = require('../../interpreter/types/string');
const SWNull = require('../../interpreter/types/null');
const SWNumber = require('../../interpreter/types/number');

/**
 * Replaces JSON data types with Swahili-safe values
 * @param {*} data JSON data value to be "un-translated"
 */
function unTranslate(data) {
  let output = SWNull.NULL;

  if (Array.isArray(data)) {
    // data is an array
    output = new SWList();
    data.forEach((el) => {
      output.elements.push(unTranslate(el));
    });
  } else if (typeof data === 'object' && data !== null) {
    // data is an object
    output = new SWObject();
    Object.keys(data).forEach((key) => {
      output.symbolTable.set(key, unTranslate(data[key]));
    });
  } else if (typeof data === 'boolean') {
    output = new SWBoolean(data);
  } else if (typeof data === 'string') {
    output = new SWString(data);
  } else if (typeof data === 'number') {
    output = new SWNumber(data);
  } else {
    output = SWNull.NULL;
  }

  return output;
}

module.exports = unTranslate;
