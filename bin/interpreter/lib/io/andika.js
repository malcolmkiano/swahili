const print = require('@utils/print');
const SWNull = require('@types/null');
const RTResult = require('@int/runtimeResult');
const { RTError } = require('@int/error');

/**
 * Print a value to the screen
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function andika(inst, executionContext) {
  let res = new RTResult();
  let ujumbe = executionContext.symbolTable.get('ujumbe');
  if (!ujumbe)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'ujumbe' is required`,
        executionContext
      )
    );

  ujumbe = ujumbe.toString(false);
  print(ujumbe);
  return res.success(SWNull.NULL);
}

module.exports = { method: andika, args: ['ujumbe'] };
