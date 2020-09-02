const SWString = include('bin/interpreter/types/string');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Converts a string to lowercase
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function herufiNdogo(inst, executionContext) {
  let res = new RTResult();
  let neno = executionContext.symbolTable.get('neno');

  if (!neno)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'neno' is required`,
        executionContext
      )
    );

  // check types
  if (!(neno instanceof SWString))
    return res.failure(
      new RTError(
        neno.posStart,
        neno.posEnd,
        `'neno' must be a string`,
        executionContext
      )
    );

  // convert to lowercase
  let str = neno.value;
  let result = new SWString(str.toLowerCase());

  return res.success(result);
}

module.exports = { method: herufiNdogo, args: ['neno'], types: [SWString] };
