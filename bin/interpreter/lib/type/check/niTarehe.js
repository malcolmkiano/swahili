const SWBoolean = require('@types/boolean');
const SWDateTime = require('@types/datetime');
const RTResult = require('@int/runtimeResult');
const { RTError } = require('@int/error');

/**
 * Checks if a value is a date
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niTarehe(inst, executionContext) {
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

  let isDateTime = kitu instanceof SWDateTime;
  return res.success(isDateTime ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niTarehe, args: ['kitu'] };
