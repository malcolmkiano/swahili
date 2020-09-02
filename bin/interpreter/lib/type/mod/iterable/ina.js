const SWString = include('bin/interpreter/types/string');
const SWList = include('bin/interpreter/types/list');
const SWBoolean = include('bin/interpreter/types/boolean');
const RTResult = include('bin/interpreter/runtimeResult');
const { RTError } = include('bin/interpreter/error');

/**
 * Returns a boolean indicating whether an iterable contains a value
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function ina(inst, executionContext) {
  let res = new RTResult();
  let kitu = executionContext.symbolTable.get('kitu');
  let kitafuto = executionContext.symbolTable.get('kitafuto');
  if (!kitu)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'kitu' is required`,
        executionContext
      )
    );

  if (!kitafuto)
    return res.failure(
      new RTError(
        kitu.posStart,
        kitu.posEnd,
        `Parameter 'kitafuto' is required`,
        executionContext
      )
    );

  if (kitu instanceof SWString || kitu instanceof SWList) {
    return res.success(
      new SWBoolean(
        kitu.elements
          ? kitu.elements
              .map((el) => el.toString())
              .includes(kitafuto.toString())
          : kitu.toString().includes(kitafuto.toString())
      )
    );
  } else {
    return res.failure(
      new RTError(
        kitu.posStart,
        kitu.posEnd,
        `Cannot check non-iterable value for elements`,
        executionContext
      )
    );
  }
}

module.exports = {
  method: ina,
  args: ['kitu', 'kitafuto'],
  types: [SWString, SWList],
};
