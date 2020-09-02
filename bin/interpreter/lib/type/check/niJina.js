const SWBoolean = include('bin/interpreter/types/boolean');
const SWString = include('bin/interpreter/types/string');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Checks if a value is a string
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niJina(inst, executionContext) {
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

  let isString = kitu instanceof SWString;
  return res.success(isString ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niJina, args: ['kitu'] };
