const SWString = require('../../../../types/string');
const SWRegEx = require('../../../../types/regex');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Replaces first instance of
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function badili(inst, executionContext) {
  let res = new RTResult();
  let jina = executionContext.symbolTable.get('jina');
  let kitafuto = executionContext.symbolTable.get('kitafuto');
  let mbadala = executionContext.symbolTable.get('mbadala');

  if (!kitafuto)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kitafuto' is required`,
        executionContext
      )
    );

  if (!mbadala)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'mbadala' is required`,
        executionContext
      )
    );

  // check types
  if (!(kitafuto instanceof SWString) && !(kitafuto instanceof SWRegEx))
    return res.failure(
      new RTError(
        kitafuto.posStart,
        kitafuto.posEnd,
        `'kitafuto' must be a string or regular expression`,
        executionContext
      )
    );

  if (!(mbadala instanceof SWString))
    return res.failure(
      new RTError(
        mbadala.posStart,
        mbadala.posEnd,
        `'mbadala' must be a string`,
        executionContext
      )
    );

  // do the replacement
  let result = jina.value.replace(kitafuto.value, mbadala.value);
  return res.success(new SWString(result));
}

module.exports = {
  method: badili,
  args: ['jina', 'kitafuto', 'mbadala'],
  types: [SWString],
};
