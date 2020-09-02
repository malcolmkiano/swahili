const SWNull = include('bin/interpreter/types/null');
const RTResult = include('bin/interpreter/runtimeResult');

/**
 * Clears the terminal
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function futa(inst, executionContext) {
  let res = new RTResult();
  console.clear();
  return res.success(SWNull.NULL);
}

module.exports = { method: futa, args: [] };
