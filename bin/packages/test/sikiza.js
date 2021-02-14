const print = require('../../utils/print');

const SWNumber = require('../../interpreter/types/number');
const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');

/**
 * Print a value to the screen
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function sikiza(inst, executionContext) {
  let res = new RTResult();

  let poti = executionContext.symbolTable.get('poti');
  if (!poti)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'poti' is required`,
        executionContext
      )
    );

  if (!(poti instanceof SWNumber) || !Number.isInteger(poti.value))
    return res.failure(
      new RTError(
        poti.posStart,
        poti.posEnd,
        `'poti' must be an int`,
        executionContext
      )
    );

  print(`Now listening on http://localhost:${poti.value}`);
  return res.success(SWNull.NULL);
}

module.exports = { method: sikiza, args: ['poti'] };
