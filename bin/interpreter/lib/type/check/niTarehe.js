const SWBoolean = include('bin/interpreter/types/boolean');
const SWDateTime = include('bin/interpreter/types/datetime');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

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
