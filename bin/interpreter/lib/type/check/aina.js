const SWString = require('@types/string');
const RTResult = require('@int/runtimeResult');
const { RTError } = require('@int/error');

/**
 * Returns the type of a value
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function aina(inst, executionContext) {
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

  return res.success(new SWString(kitu.typeName));
}

module.exports = { method: aina, args: ['kitu'] };
