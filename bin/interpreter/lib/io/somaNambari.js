const prompt = require('prompt-sync')();
const SWNumber = require('@types/number');
const RTResult = require('@int/runtimeResult');

/**
 * Gets numeric input from STDIN
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function somaNambari(inst, executionContext) {
  let res = new RTResult();
  let swali = executionContext.symbolTable.get('swali');
  swali = swali ? swali.toString(false) : '> ';
  let numInput = 0;
  while (true) {
    numInput = prompt(swali);
    if (isNaN(numInput)) {
      print('Jibu lako si nambari. Jaribu tena.');
    } else {
      break;
    }
  }

  return res.success(new SWNumber(numInput || 0));
}

module.exports = { method: somaNambari, args: ['swali'] };
