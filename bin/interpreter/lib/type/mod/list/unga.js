const SWList = require('@types/list');
const SWString = require('@types/string');
const RTResult = require('@int/runtimeResult');
const { RTError } = require('@int/error');

/**
 * Joins a list using a given join character
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function unga(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
  let kiungo = executionContext.symbolTable.get('kiungo');

  if (!orodha)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'orodha' is required`,
        executionContext
      )
    );

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
  if (!(orodha instanceof SWList))
    return res.failure(
      new RTError(
        orodha.posStart,
        orodha.posEnd,
        `'orodha' must be a list`,
        executionContext
      )
    );

  if (!(kiungo instanceof SWString))
    return res.failure(
      new RTError(
        pahala.posStart,
        pahala.posEnd,
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
