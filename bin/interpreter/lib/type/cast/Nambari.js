const SWString = require('../../../types/string');
const SWNumber = require('../../../types/number');
const SWBoolean = require('../../../types/boolean');
const RTResult = require('../../../runtimeResult');
const { RTError } = require('../../../error');

/**
 * Casts a value to a SWNumber
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function Nambari(inst, executionContext) {
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

  try {
    if (
      kitu instanceof SWString ||
      kitu instanceof SWNumber ||
      kitu instanceof SWBoolean
    ) {
      return res.success(new SWNumber(Number(kitu.value)));
    } else {
      throw new Error('Illegal conversion');
    }
  } catch (err) {
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Illegal conversion`,
        executionContext
      )
    );
  }
}

module.exports = { method: Nambari, args: ['kitu'] };
