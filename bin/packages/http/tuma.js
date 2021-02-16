const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');
const translate = require('./_translate');

/**
 * Sends a HTTP response
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function tuma(inst, executionContext) {
  let res = new RTResult();
  let data = executionContext.symbolTable.get('data');

  const http = executionContext.symbolTable.get('*http');
  let response = http.symbolTable.get('__res');

  if (response.headersSent)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `A response was already sent`,
        executionContext
      )
    );

  // convert the stuff
  const jsonSafeData = translate(data);

  // send the result out
  response.end(
    typeof jsonSafeData === 'string'
      ? jsonSafeData
      : JSON.stringify(jsonSafeData)
  );

  // update the response reference
  http.symbolTable.set('__res', response, true);
  executionContext.symbolTable.set('*http', http, true);

  return res.success(SWNull.NULL);
}

module.exports = { method: tuma, args: ['data'] };
