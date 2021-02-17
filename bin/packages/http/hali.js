const { VALID_CODES } = require('./_validResponse');

const SWNumber = require('../../interpreter/types/number');
const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');

/**
 * Updates the status code of a HTTP response
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function hali(inst, executionContext) {
  let res = new RTResult();
  let namba = executionContext.symbolTable.get('namba');

  if (!namba)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'namba' is required`,
        executionContext
      )
    );

  if (!(namba instanceof SWNumber) || !Number.isInteger(namba.value))
    return res.failure(
      new RTError(
        namba.posStart,
        namba.posEnd,
        `'namba' must be a number`,
        executionContext
      )
    );

  if (!VALID_CODES.includes(namba.value))
    return res.failure(
      new RTError(
        namba.posStart,
        namba.posEnd,
        `'${namba.value}' is not a valid HTTP response code`
      )
    );

  const http = executionContext.symbolTable.get('*http');
  let response = http.symbolTable.get('__res');

  // update the response status code
  response.statusCode = namba.value;
  http.symbolTable.set('__res', response, true);
  executionContext.symbolTable.set('*http', http, true);

  return res.success(SWNull.NULL);
}

module.exports = { method: hali, args: ['namba'] };
