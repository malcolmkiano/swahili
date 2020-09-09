const SWString = require('../../../../types/string');
const SWList = require('../../../../types/list');
const SWBoolean = require('../../../../types/boolean');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Returns a boolean indicating whether an iterable contains a value
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function ina(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');
  let kitafuto = executionContext.symbolTable.get('kitafuto');

  if (!kitafuto)
    return res.failure(
      new RTError(
        kitu.posStart,
        kitu.posEnd,
        `Parameter 'kitafuto' is required`,
        executionContext
      )
    );

  return res.success(
    new SWBoolean(
      kitu.elements
        ? kitu.elements
            .map((el) => el.toString(false))
            .includes(kitafuto.toString(false))
        : kitu.toString(false).includes(kitafuto.toString(false))
    )
  );
}

module.exports = {
  method: ina,
  args: ['kitu', 'kitafuto'],
  types: [SWString, SWList],
};
