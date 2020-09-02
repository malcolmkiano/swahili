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
function sehemu(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');
  let mwanzo = executionContext.symbolTable.get('mwanzo');
  let mwisho = executionContext.symbolTable.get('mwisho');

  if (!kitu)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kitu' is required`,
        executionContext
      )
    );

  if (!mwanzo)
    return res.failure(
      new RTError(
        kitu.posStart,
        inst.posEnd,
        `Parameter 'mwanzo' is required`,
        executionContext
      )
    );

  if (!(kitu instanceof SWString) && !(kitu instanceof SWList))
    return res.failure(
      new RTError(
        kitu.posStart,
        kitu.posEnd,
        `Cannot find segment of non-iterable value`,
        executionContext
      )
    );

  if (!(mwanzo instanceof SWNumber) || !Number.isInteger(mwanzo.value))
    return res.failure(
      new RTError(
        mwanzo.posStart,
        mwanzo.posEnd,
        `Parameter 'mwanzo' must be an int`,
        executionContext
      )
    );

  if (
    mwisho &&
    (!(mwisho instanceof SWNumber) || !Number.isInteger(mwisho.value))
  )
    return res.failure(
      new RTError(
        mwisho.posStart,
        mwisho.posEnd,
        `Parameter 'mwisho' must be an int`,
        executionContext
      )
    );

  let startIndex = mwanzo.value;
  let endIndex = mwisho ? mwisho.value : null;
  let output = kitu.elements
    ? endIndex
      ? kitu.elements.slice(startIndex, endIndex)
      : kitu.elements.slice(startIndex)
    : endIndex
    ? kitu.value.slice(startIndex, endIndex)
    : kitu.value.slice(startIndex);

  let outputValue;
  if (kitu instanceof SWString) {
    outputValue = new SWString(output);
  } else if (kitu instanceof SWList) {
    outputValue = new SWList(output);
  }

  return res.success(outputValue);
}

module.exports = {
  method: sehemu,
  args: ['kitu', 'mwanzo', 'mwisho'],
  types: [SWString, SWList],
};
