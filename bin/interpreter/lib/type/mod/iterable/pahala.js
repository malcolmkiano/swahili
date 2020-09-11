const SWString = require('../../../../types/string');
const SWList = require('../../../../types/list');
const SWNumber = require('../../../../types/number');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Returns the index of a value in an iterable, or -1 if value does not exist
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function pahala(inst, executionContext) {
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
    new SWNumber(
      kitu.elements
        ? kitu.elements
            .map((el) => el.toString(false))
            .indexOf(kitafuto.toString(false))
        : kitu.toString(false).indexOf(kitafuto.toString(false))
    )
  );
}

module.exports = {
  method: pahala,
  args: ['kitu', 'kitafuto'],
  types: [SWString, SWList],
};
