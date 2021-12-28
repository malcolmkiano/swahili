const SWList = require('../../../../types/list');
const SWNumber = require('../../../../types/number');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');
/**
 * Gets the lowest number in a list
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function ndogo(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
  let list = orodha.elements;

  // ensure at least one element in the list
  if (!list.length)
    return res.failure(
      new RTError(
        orodha.posStart,
        orodha.posEnd,
        `'orodha' must have at least one element`,
        executionContext
      )
    );

  // check that all elements are numbers
  // and find the one with least value
  let minElement = list[0];
  for (let element of list) {
    if (!(element instanceof SWNumber))
      return res.failure(
        new RTError(
          element.posStart,
          element.posEnd,
          `'${element.toString(false)}' is not a number`,
          executionContext
        )
      );
    if (element.value < minElement.value) minElement = element;
  }

  return res.success(minElement);
}

module.exports = { method: ndogo, args: ['orodha'], types: [SWList] };
