const SWString = require('../../../../types/string');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Converts a string to uppercase
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function herufiNdogo(inst, executionContext) {
  let res = new RTResult();
  let neno = executionContext.symbolTable.get('neno');

  if (!neno)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'neno' is required`,
        executionContext
      )
    );

  // check types
  if (!(neno instanceof SWString))
    return res.failure(
      new RTError(
        neno.posStart,
        neno.posEnd,
        `'neno' must be a string`,
        executionContext
      )
    );

  // convert to uppercase
  let str = neno.value;
  let result = new SWString(str.toLowerCase());

  return res.success(result);
}

module.exports = { method: herufiNdogo, args: ['neno'] };
