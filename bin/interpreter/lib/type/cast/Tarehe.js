const SWString = require('../../../types/string');
const SWDateTime = require('../../../types/datetime');
const RTResult = require('../../../runtimeResult');
const { RTError } = require('../../../error');

/**
 * Creates a new SWDateTime value
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function Tarehe(inst, executionContext) {
  let res = new RTResult();
  let tarehe = executionContext.symbolTable.get('tarehe');

  let val = null;
  try {
    if (tarehe instanceof SWString || tarehe instanceof SWDateTime) {
      let dateString = tarehe.value;
      val = new Date(dateString);
      if (val.toString() === 'Invalid Date') throw new Error('Invalid date');
    } else if (!tarehe) {
      val = new Date();
    } else {
      throw new Error('Invalid date');
    }
  } catch (err) {
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Could not create date`,
        executionContext
      )
    );
  }

  let date = new SWDateTime(val);

  return res.success(date);
}

module.exports = { method: Tarehe, args: ['tarehe'] };
