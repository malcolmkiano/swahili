const SWList = require('../../../../types/list');
const SWString = require('../../../../types/string');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Splits a string into a list using a given delimiter
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function tenga(inst, executionContext) {
  let res = new RTResult();
  let jina = executionContext.symbolTable.get('jina');
  let kitengo = executionContext.symbolTable.get('kitengo');

  if (!kitengo)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kitengo' is required`,
        executionContext
      )
    );

  // check types
  if (!(kitengo instanceof SWString))
    return res.failure(
      new RTError(
        kitengo.posStart,
        kitengo.posEnd,
        `'kitengo' must be a string`,
        executionContext
      )
    );

  // split the string
  let split = jina.value.split(kitengo.value);
  let result = new SWList(split.map((s) => new SWString(s)));

  return res.success(result);
}

module.exports = {
  method: tenga,
  args: ['jina', 'kitengo'],
  types: [SWString],
};
