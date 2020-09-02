const SWBoolean = require('@types/boolean');
const SWObject = require('@types/object');
const SWBaseFunction = require('@types/base-function');
const RTResult = require('@int/runtimeResult');
const { RTError } = require('@int/error');

/**
 * Checks if a value is an object
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niKamusi(inst, executionContext) {
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

  let isObject = kitu instanceof SWObject && !(kitu instanceof SWBaseFunction);
  return res.success(isObject ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niKamusi, args: ['kitu'] };
