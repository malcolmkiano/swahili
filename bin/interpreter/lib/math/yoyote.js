const SWNumber = require('../../types/number');
const SWBoolean = require('../../types/boolean');
const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Generates a random number
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function yoyote(inst, executionContext) {
  let res = new RTResult();
  let nambari = 0;

  let mwanzo = executionContext.symbolTable.get('mwanzo');
  let mwisho = executionContext.symbolTable.get('mwisho');
  let raundi = executionContext.symbolTable.get('raundi');
  if (mwanzo && !(mwanzo instanceof SWNumber))
    return res.failure(
      new RTError(
        mwanzo.posStart,
        mwanzo.posEnd,
        `'mwanzo' must be a number`,
        executionContext
      )
    );

  if (mwanzo && !mwisho)
    return res.failure(
      new RTError(
        mwanzo.posStart,
        mwanzo.posEnd,
        `Parameter 'miwsho' is required since 'mwanzo' is provided`,
        executionContext
      )
    );

  if (mwisho && !(mwisho instanceof SWNumber))
    return res.failure(
      new RTError(
        mwisho.posStart,
        mwisho.posEnd,
        `'mwisho' must be a number`,
        executionContext
      )
    );

  if (raundi && !(raundi instanceof SWBoolean))
    return res.failure(
      new RTError(
        raundi.posStart,
        raundi.posEnd,
        `'raundi' must be a boolean`,
        executionContext
      )
    );

  if (mwisho) {
    const min = mwanzo.value;
    const max = mwisho.value;
    nambari = Math.random() * (max - min) + min;
    if (raundi && raundi.value) nambari = Math.floor(nambari);
  } else {
    nambari = Math.random();
  }

  return res.success(new SWNumber(nambari));
}

module.exports = { method: yoyote, args: ['mwanzo', 'mwisho', 'raundi'] };
