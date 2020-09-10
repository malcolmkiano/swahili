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
  let shughuli = executionContext.symbolTable.get('shughuli');

  if (!shughuli)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'shughuli' is required`,
        executionContext
      )
    );

  // check types
  if (!(shughuli instanceof SWBaseFunction))
    return res.failure(
      new RTError(
        shughuli.posStart,
        shughuli.posEnd,
        `'shughuli' must be a function`,
        executionContext
      )
    );

  // map the elements
  let els = [];
  for (let i = 0; i < orodha.elements.length; i++) {
    let el = orodha.elements[i];
    let idx = new SWNumber(i);
    let res = shughuli.execute([el, idx]);
    if (res.error) return res;
    els.push(res.value || SWNull.NULL);
  }

  let result = new SWList(els);
  return res.success(result);
}

module.exports = {
  method: fanya,
  args: ['orodha', 'shughuli'],
  types: [SWList],
};
