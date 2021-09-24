const colors = require('colors');
const print = require('../../utils/print');
const { mapRequest, mapResponse } = require('./_mappers');

const RTResult = require('../../interpreter/runtimeResult');

const PARSERS = {
  'application/json': JSON.parse,
};

/**
 * Determines the associated callback method for the requested route and executes it
 * @param {{}} request the http request object
 * @param {{}} response the http response object
 * @param {{}} routes the stored routes and their associated methods
 * @param {Boolean} logging whether to log each request or not
 */
function handleRequest(request, response, routes, logging = true) {
  let res = new RTResult();
  const reqInfo = { params: {} };
  let method = null;

  const url = request.url;
  const urlParts = url.split('/').map((part) => {
    if (part.includes('?')) {
      const query = part.substring(part.indexOf('?') + 1);
      reqInfo.params = {
        ...JSON.parse(
          '{"' +
            decodeURI(query)
              .replace(/"/g, '\\"')
              .replace(/&/g, '","')
              .replace(/=/g, '":"') +
            '"}'
        ),
      };
    }
    return part.includes('?') ? part.substring(0, part.indexOf('?')) : part;
  });

  if (routes[urlParts.join('/')]) {
    method = routes[urlParts.join('/')];
  } else {
    let match = false;
    for (let route of Object.keys(routes)) {
      const routeParts = route.split('/');
      if (routeParts.length === urlParts.length) {
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i] === urlParts[i]) {
            match = true;
          } else if (
            routeParts[i] !== urlParts[i] &&
            routeParts[i].startsWith(':') &&
            match
          ) {
            reqInfo.params[routeParts[i].substr(1)] = urlParts[i];
            method = routes[route];
            break;
          } else {
            match = false;
          }
        }
      }
    }
  }

  const executeRequest = () => {
    // map the request and response to something swahili can work with
    const swali = mapRequest(request, urlParts.join('/'), reqInfo.params);
    const jibu = mapResponse();

    // execute the method, if found
    if (method) {
      res.register(method.execute([swali, jibu]));
      if (res.error) {
        // log it
        print(colors.red(res.error.toString()), true);

        // send it out
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(
          JSON.stringify({
            message: 'Shida ilitokea kwenye seva',
            error: res.error.details,
          })
        );
      }
    }

    if (!response.headersSent) {
      response.statusCode = 501;
      response.end('Jibu haikutumwa');
    }

    if (logging) {
      const spacer = (str) => str + ' '.repeat(Math.max(20 - str.length, 0));
      const status = (str) =>
        response.statusCode.toString().startsWith('2')
          ? colors.brightGreen(str)
          : colors.brightRed(str);
      print(
        colors.brightCyan(new Date().toLocaleString()) +
          '   ' +
          status(spacer(request.method + ' ' + urlParts.join('/'))) +
          status(response.statusCode)
      );
    }
  };

  // check request type and handle appropriately
  if (['POST', 'PATCH', 'PUT'].includes(request.method)) {
    // handle request data received
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      const mimeType = (
        request.headers['content-type'] || 'application/json'
      ).split(';')[0];
      const parse = PARSERS[mimeType];
      if (parse) {
        request.body = body ? parse(body) : null;
      }

      executeRequest();
    });
  } else {
    executeRequest();
  }
}

module.exports = handleRequest;
