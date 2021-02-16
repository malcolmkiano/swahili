const { VALID_HEADERS } = require('./_validResponse');

const SWString = require('../../interpreter/types/string');
const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');

/**
 * Updates the given header of a HTTP response
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function wekaKichwa(inst, executionContext) {
  let res = new RTResult();
  let jina = executionContext.symbolTable.get('jina');
  let data = executionContext.symbolTable.get('data');

  for (let [argName, arg] of [
    ['jina', jina],
    ['data', data],
  ]) {
    if (!arg)
      return res.failure(
        new RTError(
          inst.posStart,
          inst.posEnd,
          `Parameter '${argName}' is required`,
          executionContext
        )
      );

    if (!(arg instanceof SWString))
      return res.failure(
        new RTError(
          arg.posStart,
          arg.posEnd,
          `'${argName}' must be a string`,
          executionContext
        )
      );
  }

  if (!VALID_HEADERS.includes(jina.value))
    return res.failure(
      new RTError(
        jina.posStart,
        jina.posEnd,
        `'${jina.value}' is not a valid HTTP response header`
      )
    );

  const http = executionContext.symbolTable.get('*http');
  let response = http.symbolTable.get('__res');

  // update the response status code
  response.setHeader(jina.value, data.value);
  http.symbolTable.set('__res', response, true);
  executionContext.symbolTable.set('*http', http, true);

  return res.success(SWNull.NULL);
}

module.exports = { method: wekaKichwa, args: ['jina', 'data'] };
