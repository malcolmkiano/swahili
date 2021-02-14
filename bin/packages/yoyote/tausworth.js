const random = require('./random');
const range = require('./range');

const print = require('../../utils/print');

const SWNumber = require('../../interpreter/types/number');
const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');

/**
 * Print a value to the screen
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function tausworth(inst, executionContext) {
  let res = new RTResult();
  let nambari = 0;

  let mwanzo = executionContext.symbolTable.get('mwanzo');
  let mwisho = executionContext.symbolTable.get('mwisho');
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

  if (mwisho) {
    const min = mwanzo.value;
    const max = mwisho.value;
    nambari = range(min, max);
  } else {
    nambari = random();
  }

  return res.success(new SWNumber(nambari));
}

module.exports = { method: tausworth, args: ['mwanzo', 'mwisho'] };
