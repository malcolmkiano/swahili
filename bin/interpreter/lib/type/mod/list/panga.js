const SWList = require('../../../../types/list');
const SWNumber = require('../../../../types/number');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Sorts a list using a javascripts built-in sort function
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function panga(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
 
  // default to the args list
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
  
  // Ensure the list contains numerical values
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
  }

 // sort the list items
  //let result = list.sort();   
  orodha.elements.sort();
  return res.success(orodha);

}

module.exports = { method: panga, args: ['orodha'], types: [SWList] };
