const SWNumber = require('../../../../types/number');
const SWList = require('../../../../types/list');

const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Gets the highest number in a list
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function kubwa(inst, executionContext) {
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

  // ensure 'orodha' is a list
  if (!(orodha instanceof SWList))
    return res.failure(
      new RTError(
        orodha.posStart,
        orodha.posEnd,
        `'orodha' must be a list`,
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
        `'orodha' must have at least one element`,
        executionContext
      )
    );

  // check that all elements are numbers
  // and find the one with highest value
  let maxElement = list[0];
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
    if (element.value > maxElement.value) maxElement = element;
  }

  return res.success(maxElement);
}

module.exports = { method: kubwa, args: ['orodha'] };
