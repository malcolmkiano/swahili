const SWNull = require('../../../../types/null');
const SWNumber = require('../../../../types/number');
const SWBaseFunction = require('../../../../types/base-function');
const SWList = require('../../../../types/list');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Runs each item in a list through a function and returns the resulting list
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function fanya(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
  let shug = executionContext.symbolTable.get('shug');

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
        `'shug' must be a function`,
        executionContext
      )
    );

  // map the elements
  let els = [];
  for (let i = 0; i < orodha.elements.length; i++) {
    let el = orodha.elements[i];
    let idx = new SWNumber(i);
    let innerRes = shug.execute([el, idx]);
    if (innerRes.error) return innerRes;
    els.push(innerRes.value || SWNull.NULL);
  }

  let result = new SWList(els);
  return res.success(result);
}

module.exports = {
  method: fanya,
  args: ['orodha', 'shug'],
  types: [SWList],
};
