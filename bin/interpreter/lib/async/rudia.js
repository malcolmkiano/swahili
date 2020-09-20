const SWBaseFunction = require('../../types/base-function');
const SWNumber = require('../../types/number');
const SWTimeout = require('../../types/timeout');
const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Repeats a function each given amount of time
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function rudia(inst, executionContext) {
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

  if (!muda)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'muda' is required`,
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

  if (!(muda instanceof SWNumber) || muda.value < 5)
    return res.failure(
      new RTError(
        muda.posStart,
        muda.posEnd,
        `'muda' must be a number >= 5`,
        executionContext
      )
    );

  let params = args.elements.slice(2);
  let int = setInterval(() => {
    shug.execute(params);
  }, muda.value);
  inst.interpreter.callbackQueue.push(int);

  return res.success(new SWTimeout('interval', shug, muda.value, int));
}

module.exports = { method: rudia, args: ['shug', 'muda'] };
