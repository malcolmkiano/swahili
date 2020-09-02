const SWString = include('bin/interpreter/types/string');
const SWList = include('bin/interpreter/types/list');
const SWNumber = include('bin/interpreter/types/number');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Returns the length of a list/string
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function idadi(inst, executionContext) {
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

  if (kitu instanceof SWString || kitu instanceof SWList) {
    return res.success(
      new SWNumber(kitu.elements ? kitu.elements.length : kitu.value.length)
    );
  } else {
    return res.failure(
      new RTError(
        kitu.posStart,
        kitu.posEnd,
        `Cannot find length of non-iterable value`,
        executionContext
      )
    );
  }
}

module.exports = { method: idadi, args: ['kitu'], types: [SWString, SWList] };
