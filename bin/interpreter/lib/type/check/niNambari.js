const SWBoolean = require('../../../types/boolean');
const SWNumber = require('../../../types/number');
const RTResult = require('../../../runtimeResult');
const { RTError } = require('../../../error');

/**
 * Checks if a value is a number
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niNambari(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');
  if (!kitu)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kitu' is required`,
        executionContext
      )
    );

  let isNumber = kitu instanceof SWNumber;
  return res.success(isNumber ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niNambari, args: ['kitu'] };
