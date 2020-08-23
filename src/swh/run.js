const Lexer = require('./lexer');
const Parser = require('./parser');
const { Interpreter, SWBuiltInFunction } = require('./interpreter');
const Context = require('./context');
const SWNull = require('./types/null');
const SWBoolean = require('./types/boolean');
const SymbolTable = require('./symbolTable');

/** holds all variables and their values in the global scope */
const globalSymbolTable = new SymbolTable();

/** instantiate predefined global vars */
globalSymbolTable.set('tupu', SWNull.NULL); // NULL
globalSymbolTable.set('kweli', SWBoolean.TRUE); // TRUE
globalSymbolTable.set('uwongo', SWBoolean.FALSE); // FALSE

/** built in functions */
globalSymbolTable.set('andika', SWBuiltInFunction.print);
globalSymbolTable.set('soma', SWBuiltInFunction.input);
globalSymbolTable.set('somaNambari', SWBuiltInFunction.inputNumber);
globalSymbolTable.set('futa', SWBuiltInFunction.clear);

globalSymbolTable.set('niNambari', SWBuiltInFunction.isNumber);
globalSymbolTable.set('niJina', SWBuiltInFunction.isString);
globalSymbolTable.set('niOrodha', SWBuiltInFunction.isList);
globalSymbolTable.set('niShughuli', SWBuiltInFunction.isFunction);

globalSymbolTable.set('idadi', SWBuiltInFunction.sizeof);

/**
 * Processes a file through the lexer, parser and interpreter
 * @param {String} fileName name of file to be processed
 * @param {String} text content of the file
 * @returns {[String, Error]}
 */
function run(fileName, text) {
  // Generate tokens
  const lexer = new Lexer(fileName, text);
  const [tokens, error] = lexer.makeTokens();
  if (error) return [null, error];

  // Generate abstract syntax tree
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.error) return [null, ast.error];

  // Run program
  const intr = new Interpreter();
  const context = new Context('<program>');
  context.symbolTable = globalSymbolTable;
  const result = intr.visit(ast.node, context);

  return [result.value, result.error];
}

module.exports = run;
