const print = include('bin/utils/print');
const SWNull = include('bin/interpreter/types/null');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Print a value to the screen
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function andika(inst, executionContext) {
  let res = new RTResult();
  let ujumbe = executionContext.symbolTable.get('ujumbe');
  if (!ujumbe)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'ujumbe' is required`,
        executionContext
      )
    );

  ujumbe = ujumbe.toString(false);
  print(ujumbe);
  return res.success(SWNull.NULL);
}

module.exports = { method: andika, args: ['ujumbe'] };
