const SWBoolean = require('../../../types/boolean');
const SWBaseFunction = require('../../../types/base-function');
const RTResult = require('../../../runtimeResult');
const { RTError } = require('../../../error');

/**
 * Checks if a value is a function
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niShughuli(inst, executionContext) {
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

  let isFunction = kitu instanceof SWBaseFunction;
  return res.success(isFunction ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niShughuli, args: ['kitu'] };
