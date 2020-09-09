const SWString = require('../../../../types/string');
const SWList = require('../../../../types/list');
const SWNumber = require('../../../../types/number');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Returns the length of a list/string
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function idadi(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');

  return res.success(
    new SWNumber(kitu.elements ? kitu.elements.length : kitu.value.length)
  );
}

module.exports = { method: idadi, args: ['kitu'], types: [SWString, SWList] };
