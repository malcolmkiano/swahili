const SWString = require('../../../../types/string');
const SWList = require('../../../../types/list');
const SWNumber = require('../../../../types/number');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

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

  if (!mwanzo)
    return res.failure(
      new RTError(
        kitu.posStart,
        inst.posEnd,
        `Parameter 'mwanzo' is required`,
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
  let source = kitu.elements || kitu.value;
  let output = endIndex
    ? source.slice(startIndex, endIndex)
    : source.slice(startIndex);

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
