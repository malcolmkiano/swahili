const SWTimeout = require('../../types/timeout');
const SWNull = require('../../types/null');
const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Kills a timeout
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function komesha(inst, executionContext) {
  let res = new RTResult();
  let muda = executionContext.symbolTable.get('muda');

  if (!muda)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'muda' is required`,
        executionContext
      )
    );

  if (!(muda instanceof SWTimeout))
    return res.failure(
      new RTError(
        muda.posStart,
        muda.posEnd,
        `'muda' must be a timeout`,
        executionContext
      )
    );

  if (muda.type === 'interval') {
    clearInterval(muda.value);
  } else {
    clearTimeout(muda.value);
  }

  inst.interpreter.callbackQueue.shift();

  return res.success(SWNull.NULL);
}

module.exports = { method: komesha, args: ['muda'] };
