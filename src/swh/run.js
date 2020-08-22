const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');
const Context = require('./context');
const SWNumber = require('./types/number');
const SWBoolean = require('./types/boolean');
const SymbolTable = require('./symbolTable');

/** holds all variables and their values in the global scope */
const globalSymbolTable = new SymbolTable();

/** instantiate predefined global vars */
globalSymbolTable.set('kweli', new SWBoolean(true)); // TRUE
globalSymbolTable.set('uwongo', new SWBoolean(false)); // FALSE

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
  // console.log(tokens);

  // Generate abstract syntax tree
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.error) return [null, ast.error];
  // console.log(ast.node);

  // Run program
  const intr = new Interpreter();
  const context = new Context('<program>');
  context.symbolTable = globalSymbolTable;
  const result = intr.visit(ast.node, context);

  return [result.value, result.error];
}

module.exports = run;
