const SWBoolean = require('../../../types/boolean');
const SWList = require('../../../types/list');
const RTResult = require('../../../runtimeResult');
const { RTError } = require('../../../error');

/**
 * Checks if a value is a list
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function niOrodha(inst, executionContext) {
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

  let isList = kitu instanceof SWList;
  return res.success(isList ? SWBoolean.TRUE : SWBoolean.FALSE);
}

module.exports = { method: niOrodha, args: ['kitu'] };
