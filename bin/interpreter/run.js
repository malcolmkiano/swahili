const Lexer = require('../lexer');
const Parser = require('../parser');
const Context = require('./context');
const Interpreter = require('.');
const SymbolTable = require('./symbolTable');

const SWPackage = require('./types/_package');
const SWBuiltInFunction = require('./types/built-in-function');

const { functions, constants } = require('./lib');
const packages = require('../packages');
const injectEnv = require('../utils/env');

/** holds all variables and their values in the global scope */
const globalSymbolTable = new SymbolTable();

// environment injection
injectEnv(globalSymbolTable);

// library injection
for (let [libConst, value] of Object.entries(constants)) {
  globalSymbolTable.setConstant(libConst, value);
}

for (let fn of functions) {
  let types = fn.types ? '$' : '';
  let libFn = types + fn.method.name;
  globalSymbolTable.setConstant(
    libFn,
    new SWBuiltInFunction(libFn.replace('$', ''))
  );
}

// package injection
for (let [name, { constants, methods }] of Object.entries(packages)) {
  const package = new SWPackage();
  package.name = name;

  // add constants
  for (let [constant, value] of Object.entries(constants)) {
    package.symbolTable.setConstant(constant, value);
  }

  // add methods
  for (let { method, args } of methods) {
    const fn = new SWBuiltInFunction(method.name);
    fn[method.name] = method;
    fn.args = args;
    package.symbolTable.setConstant(method.name, fn);
  }

  globalSymbolTable.setConstant(`*${name}`, package);
}

/**
 * Processes a file through the lexer, parser and interpreter
 * @param {String} fileName name of file to be processed
 * @param {String} text content of the file
 * @param {Boolean} temp run the program in a temporary isolated scope if true
 * @returns {[String, Error, [], Interpreter]}
 */
function run(fileName, text, temp = false) {
  // Generate tokens
  const lexer = new Lexer(fileName, text);
  const [tokens, error] = lexer.makeTokens();
  if (error) return [null, error];
  if (tokens.length === 1) return [null, null];

  // Generate abstract syntax tree
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.error) return [null, ast.error];

  // Run program
  const intr = new Interpreter();
  const context = new Context('<program>');
  context.symbolTable = temp
    ? new SymbolTable(globalSymbolTable)
    : globalSymbolTable;

  const result = intr.visit(ast.node, context);
  const callbackQueue = intr.callbackQueue;

  return [result.value, result.error, callbackQueue, intr];
}

module.exports = run;
