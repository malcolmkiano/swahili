const SWString = require('../../../../types/string');
const SWDateTime = require('../../../../types/datetime');
const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Formats a SWDateTime value as a SWString
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function unda(inst, executionContext) {
  let res = new RTResult();
  let tarehe = executionContext.symbolTable.get('tarehe');
  let muundo = executionContext.symbolTable.get('muundo');

  if (muundo && !(muundo instanceof SWString))
    return res.failure(
      new RTError(
        muundo.posStart,
        muundo.posEnd,
        `Parameter 'muundo' must be a string`,
        executionContext
      )
    );

  let format = muundo ? muundo : new SWString('sa:d M t, MK');

  return res.success(new SWString(tarehe.toFormat(format)));
}

module.exports = {
  method: unda,
  args: ['tarehe', 'muundo'],
  types: [SWDateTime],
};
