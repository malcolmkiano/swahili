const SWString = require('../../../types/string');
const SWRegEx = require('../../../types/regex');
const RTResult = require('../../../runtimeResult');
const { RTError } = require('../../../error');

/**
 * Casts a value to a SWRegEx
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function RegEx(inst, executionContext) {
  let res = new RTResult();
  let muundo = executionContext.symbolTable.get('muundo');
  let bendera = executionContext.symbolTable.get('bendera');

  if (!muundo)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'muundo' is required`,
        executionContext
      )
    );

  if (!(muundo instanceof SWString))
    return res.failure(
      new RTError(
        muundo.posStart,
        muundo.posEnd,
        `Parameter 'muundo' must be a string`,
        executionContext
      )
    );

  if (bendera && !(bendera instanceof SWString))
    return res.failure(
      new RTError(
        bendera.posStart,
        bendera.posEnd,
        `Parameter 'bendera' must be a string`,
        executionContext
      )
    );

  let pattern = muundo.value;
  let flags = bendera ? bendera.value : '';

  const validFlags = 'igmsuy';
  for (let i = 0; i < flags.length; i++) {
    let char = flags[i];
    if (!validFlags.includes(char)) {
      return res.failure(
        new RTError(
          bendera.posStart,
          bendera.posEnd,
          `Parameter 'bendera' contains an invalid flag value: '${char}'`,
          executionContext
        )
      );
    }
  }

  return res.success(new SWRegEx(pattern, flags));
}

module.exports = { method: RegEx, args: ['muundo', 'bendera'] };
