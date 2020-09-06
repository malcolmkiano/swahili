const SWString = require('../../../../types/string');
const SWObject = require('../../../../types/object');
const SWList = require('../../../../types/list');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Returns the length of a list/string
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function viingilio(inst, executionContext) {
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

  if (!(kitu instanceof SWObject))
    return res.failure(
      new RTError(
        kitu.posStart,
        kitu.posEnd,
        `Parameter 'kitu' must be an object`,
        executionContext
      )
    );

  let entries = Object.entries(kitu.symbolTable.symbols);
  let mapped = entries.map(
    ([key, value]) => new SWList([new SWString(key), value])
  );
  return res.success(new SWList(mapped));
}

module.exports = { method: viingilio, args: ['kitu'], types: [SWObject] };
