const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');
const SWString = require('../../interpreter/types/string');
const SWBaseFunction = require('../../interpreter/types/base-function');

function taka(inst, executionContext) {
  let res = new RTResult();
  let anwani = executionContext.symbolTable.get('anwani');
  let shug = executionContext.symbolTable.get('shug');

  if (!anwani)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'anwani' is required`,
        executionContext
      )
    );

  if (!(anwani instanceof SWString))
    return res.failure(
      new RTError(
        anwani.posStart,
        anwani.posEnd,
        `'anwani' must be a string`,
        executionContext
      )
    );

  if (!shug)
    return res.failure(
      new RTError(
        anwani.posEnd,
        inst.posEnd,
        `Parameter 'shug' is required`,
        executionContext
      )
    );

  if (!(shug instanceof SWBaseFunction))
    return res.failure(
      new RTError(
        shug.posStart,
        shug.posEnd,
        `'shug' must be a function`,
        executionContext
      )
    );

  const http = executionContext.symbolTable.get('*http');
  let routes = http.symbolTable.get('__routes') || {};

  // add the route and handler to the http package routes
  routes[anwani.value] = shug;
  http.symbolTable.set('__routes', routes, true);
  executionContext.symbolTable.set('*http', http, true);

  return res.success(SWNull.NULL);
}

module.exports = { method: taka, args: ['anwani', 'shug'] };
