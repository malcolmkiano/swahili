const SWString = include('bin/interpreter/types/string');
const SWBaseFunction = include('bin/interpreter/types/base-function');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Casts a value to a SWString
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function Jina(inst, executionContext) {
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

  let value = kitu.toString(false);
  if (kitu instanceof SWBaseFunction) value = kitu.name;

  return res.success(new SWString(value));
}

module.exports = { method: Jina, args: ['kitu'] };
