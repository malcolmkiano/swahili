const print = require('../../../utils/print');
const SWNull = require('../../types/null');
const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Print a value to the screen
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function andika(inst, executionContext) {
  let res = new RTResult();
  let args = executionContext.symbolTable.get('__hoja');
  if (!args.elements.length)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'ujumbe' is required`,
        executionContext
      )
    );

  let output = '';
  for (let arg of args.elements) {
    output += arg.toString(false) + ' ';
  }
  print(output);
  return res.success(SWNull.NULL);
}

module.exports = { method: andika, args: ['ujumbe'] };
