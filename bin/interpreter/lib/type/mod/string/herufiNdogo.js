const SWString = require('../../../../types/string');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Converts a string to lowercase
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function herufiNdogo(inst, executionContext) {
  let res = new RTResult();
  let neno = executionContext.symbolTable.get('neno');

  // convert to lowercase
  let str = neno.value;
  let result = new SWString(str.toLowerCase());

  return res.success(result);
}

module.exports = { method: herufiNdogo, args: ['neno'], types: [SWString] };
