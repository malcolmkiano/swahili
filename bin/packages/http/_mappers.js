const hali = require('./hali');
const wekaKichwa = require('./wekaKichwa');
const tuma = require('./tuma');
const unTranslate = require('./_unTranslate');

const SWObject = require('../../interpreter/types/object');
const SWString = require('../../interpreter/types/string');
const SWExecutable = require('../../interpreter/types/_executable');

/**
 * Generates a request object valid for use in callbacks
 * @param {*} request the HTTP request
 * @param {string} url the requested url, sans querystring
 * @param {{}} params params extracted from the requested url
 */
function mapRequest(request, url, params) {
  const swali = new SWObject();

  // request.url
  swali.symbolTable.setConstant('url', new SWString(url));

  // request.method
  swali.symbolTable.setConstant('kitenzi', new SWString(request.method));

  // request.headers
  const kichwa = new SWObject();
  for (let name of Object.keys(request.headers)) {
    kichwa.symbolTable.setConstant(name, new SWString(request.headers[name]));
  }
  swali.symbolTable.setConstant('kichwa', kichwa);

  // request.params [NEW]
  const vyaguo = new SWObject();
  for (let name of Object.keys(params)) {
    vyaguo.symbolTable.setConstant(name, new SWString(params[name]));
  }
  swali.symbolTable.setConstant('vyaguo', vyaguo);

  // request.body, conditional [NEW]
  const mwili = unTranslate(request.body);
  swali.symbolTable.setConstant('mwili', mwili);

  return swali;
}

/**
 * Generates a response object valid for use in callbacks
 */
function mapResponse() {
  const jibu = new SWObject();

  // response.setStatus(statusCode) [NEW]
  // response.setHeader(name, value)
  // response.end(content)
  const functions = [hali, wekaKichwa, tuma];
  functions.forEach((fn) => {
    const { method, args } = fn;
    const swFunction = new SWExecutable(method.name);
    swFunction[method.name] = method;
    swFunction.args = args;
    jibu.symbolTable.setConstant(method.name, swFunction);
  });

  return jibu;
}

module.exports = { mapRequest, mapResponse };
