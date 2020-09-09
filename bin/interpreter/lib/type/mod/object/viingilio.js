const SWString = require('../../../../types/string');
const SWObject = require('../../../../types/object');
const SWList = require('../../../../types/list');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Returns an array of tuples containing the key/value pairs of an object
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function viingilio(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');

  let entries = Object.entries(kitu.symbolTable.symbols);
  let mapped = entries.map(
    ([key, value]) => new SWList([new SWString(key), value])
  );
  return res.success(new SWList(mapped));
}

module.exports = { method: viingilio, args: ['kitu'], types: [SWObject] };
