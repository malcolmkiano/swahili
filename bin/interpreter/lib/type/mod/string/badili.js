const SWString = require('../../../../types/string');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');
const SWBoolean = require('../../../../types/boolean');

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
  let kamili = executionContext.symbolTable.get('kamili');

  if (!jina)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'jina' is required`,
        executionContext
      )
    );

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
  if (!(jina instanceof SWString))
    return res.failure(
      new RTError(
        jina.posStart,
        jina.posEnd,
        `'jina' must be a string`,
        executionContext
      )
    );

  if (!(kitafuto instanceof SWString))
    return res.failure(
      new RTError(
        kitafuto.posStart,
        kitafuto.posEnd,
        `'kitafuto' must be a string`,
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

  if (kamili && !(kamili instanceof SWBoolean))
    return res.failure(
      new RTError(
        kamili.posStart,
        kamili.posEnd,
        `'kamili' must be a boolean`,
        executionContext
      )
    );

  let replaceAll = kamili ? kamili.value : false;

  // do the replacement
  let result = jina.value.replace(kitafuto.value, mbadala.value);
  if (replaceAll) {
    while (result.includes(kitafuto.value)) {
      result = result.replace(kitafuto.value, mbadala.value);
    }
  }

  return res.success(new SWString(result));
}

module.exports = {
  method: badili,
  args: ['jina', 'kitafuto', 'mbadala', 'kamili'],
  types: [SWString],
};
