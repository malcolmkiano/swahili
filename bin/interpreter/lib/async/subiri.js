const SWBaseFunction = require('../../types/base-function');
const SWNumber = require('../../types/number');
const SWTimeout = require('../../types/timeout');
const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Waits for given amount of time before running a function
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function subiri(inst, executionContext) {
  let res = new RTResult();
  let shug = executionContext.symbolTable.get('shug');
  let muda = executionContext.symbolTable.get('muda');
  let args = executionContext.symbolTable.get('__hoja');

  if (!shug)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'shug' is required`,
        executionContext
      )
    );

  // check types
  if (!(shug instanceof SWBaseFunction))
    return res.failure(
      new RTError(
        shug.posStart,
        shug.posEnd,
        `Parameter 'shug' must be a function`,
        executionContext
      )
    );

  if (muda && (!(muda instanceof SWNumber) || muda.value < 0))
    return res.failure(
      new RTError(
        muda.posStart,
        muda.posEnd,
        `'muda' must be a number >= 0`,
        executionContext
      )
    );

  let delay = muda ? muda.value : 0;
  let params = args.elements.slice(2);
  let tm = setTimeout(() => {
    shug.execute(params);
  }, delay);
  inst.interpreter.callbackQueue.push(tm);

  return res.success(new SWTimeout('timeout', shug, muda.value, tm));
}

module.exports = { method: subiri, args: ['shug', 'muda'] };
