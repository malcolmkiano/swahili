const print = require('../../utils/print');

const SWString = require('../../interpreter/types/string');
const SWBaseFunction = require('../../interpreter/types/base-function');
const SWNumber = require('../../interpreter/types/number');
const SWNull = require('../../interpreter/types/null');
const RTResult = require('../../interpreter/runtimeResult');
const { RTError } = require('../../interpreter/error');

const http = require('http');
const handleRequest = require('./_handleRequest');
const SWBoolean = require('../../interpreter/types/boolean');
const createServer = (callback) => http.createServer(callback);

// Serevr
const hostname = 'localhost';
const port = 9000;

/**
 * Starts a server listening on the given port
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function sikiza(inst, executionContext) {
  let res = new RTResult();

  let poti = executionContext.symbolTable.get('poti');
  let shug = executionContext.symbolTable.get('shug');
  let maandishi = executionContext.symbolTable.get('maandishi');

  if (shug && (!(poti instanceof SWNumber) || !Number.isInteger(poti.value)))
    return res.failure(
      new RTError(
        poti.posStart,
        poti.posEnd,
        `'poti' must be an int`,
        executionContext
      )
    );

  if (shug && !(shug instanceof SWBaseFunction))
    return res.failure(
      new RTError(
        shug.posStart,
        shug.posEnd,
        `Parameter 'shug' must be a function`,
        executionContext
      )
    );

  let logging = true;
  if (maandishi && !(maandishi instanceof SWBoolean))
    return res.failure(
      new RTError(
        maandishi.posStart,
        maandishi.posEnd,
        `Parameter 'maandishi' must be a boolean`,
        executionContext
      )
    );

  if (maandishi) logging = !!maandishi.value;

  // check for configured routes and add them to the server
  const http = executionContext.symbolTable.get('*http');
  const routes = http.symbolTable.get('__routes') || {};

  // instantiate the server add add the routes to it
  const server = createServer((request, response) => {
    // Powered by Swahili
    response.setHeader('X-Powered-By', 'Swahili');

    // hold references to request and response
    http.symbolTable.setConstant('__req', request);
    http.symbolTable.setConstant('__res', response);
    executionContext.symbolTable.set('*http', http, true);

    handleRequest(request, response, routes, logging);
  });

  // actually start listening
  const callbackHolder = {
    _destroyed: false,
    isServer: true,
    serverRef: server,
  };
  const actualPort = poti ? poti.value : port;
  inst.interpreter.callbackQueue.push(callbackHolder);
  server.listen(actualPort, hostname, () => {
    if (shug) shug.execute([new SWString(hostname), new SWNumber(actualPort)]);
    if (logging) print('');
  });

  // close handling
  server.on('close', () => {
    print('Seva imekomeshwa.');
    delete callbackHolder.isServer;
    callbackHolder._destroyed = true;
  });

  return res.success(SWNull.NULL);
}

module.exports = { method: sikiza, args: ['poti', 'shug', 'maandishi'] };
