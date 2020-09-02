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

  // ensure param was provided
  if (!orodha)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'orodha' is required`,
        executionContext
      )
    );

  // at least one element in the list
  let list = orodha.elements;
  if (!list.length)
    return res.failure(
      new RTError(
        orodha.posStart,
        orodha.posEnd,
        `'orodha' must have at least one element'`,
        executionContext
      )
    );

  // check that all elements are numbers
  // and find the one with least value
  let minElement = list[0];
  for (let i = 0; i < list.length; i++) {
    let element = list[i];
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

module.exports = { method: ndogo, args: ['orodha'] };
