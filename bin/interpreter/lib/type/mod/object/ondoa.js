const SWObject = require('../../../../types/object');
const SWString = require('../../../../types/string');
const SWNull = require('../../../../types/null');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Removes a property from an object
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function ondoa(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');
  let jina = executionContext.symbolTable.get('jina');

  if (!jina)
    return res.failure(
      new RTError(
        kitu.posStart,
        inst.posEnd,
        `Parameter 'jina' is required`,
        executionContext
      )
    );

  if (!(jina instanceof SWString))
    return res.failure(
      new RTError(
        jina.posStart,
        jina.posEnd,
        `Parameter 'jina' must be a string`,
        executionContext
      )
    );

  kitu.symbolTable.remove(jina.value);
  executionContext.symbolTable.set(kitu.name, kitu, true);
  return res.success(SWNull.NULL);
}

module.exports = { method: ondoa, args: ['kitu', 'jina'], types: [SWObject] };
