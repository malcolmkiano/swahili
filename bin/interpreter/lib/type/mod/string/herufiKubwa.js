const SWString = require('../../../../types/string');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Converts a string to uppercase
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function herufiKubwa(inst, executionContext) {
  let res = new RTResult();
  let neno = executionContext.symbolTable.get('neno');

  // convert to uppercase
  let str = neno.value;
  let result = new SWString(str.toUpperCase());

  return res.success(result);
}

module.exports = { method: herufiKubwa, args: ['neno'], types: [SWString] };
