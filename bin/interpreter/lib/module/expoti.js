const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Exports a value from a module
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function expoti(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');
  if (!kitu)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kitu' is required`,
        executionContext
      )
    );

  inst.interpreter.exportValue = kitu;
  return res.success(kitu);
}

module.exports = { method: expoti, args: ['kitu'] };
