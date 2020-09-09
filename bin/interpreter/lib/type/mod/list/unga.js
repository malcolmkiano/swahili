const SWString = require('../../../../types/string');
const SWList = require('../../../../types/list');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Joins a list using a given join character
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function unga(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
  let kiungo = executionContext.symbolTable.get('kiungo');

  if (!kiungo)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kiungo' is required`,
        executionContext
      )
    );

  // check types
  if (!(kiungo instanceof SWString))
    return res.failure(
      new RTError(
        kiungo.posStart,
        kiungo.posEnd,
        `'kiungo' must be a string`,
        executionContext
      )
    );

  // join the list items
  let joined = orodha.elements
    .map((el) => el.toString(false))
    .join(kiungo.value);
  let result = new SWString(joined);

  return res.success(result);
}

module.exports = { method: unga, args: ['orodha', 'kiungo'], types: [SWList] };
