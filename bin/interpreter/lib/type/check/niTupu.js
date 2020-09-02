const SWBoolean = include('bin/interpreter/types/boolean');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Checks if a value is empty
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niTupu(inst, executionContext) {
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

  let isEmpty = !kitu.isTrue();
  return res.success(isEmpty ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niTupu, args: ['kitu'] };
