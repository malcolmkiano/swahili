const SWBoolean = include('bin/interpreter/types/boolean');
const SWObject = include('bin/interpreter/types/object');
const SWBaseFunction = include('bin/interpreter/types/base-function');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

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
