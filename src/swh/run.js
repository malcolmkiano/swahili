const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');
const Context = require('./context');
const NUMBER = require('./types/number');
const SymbolTable = require('./symbolTable');

/** holds all variables and their values in the global scope */
const globalSymbolTable = new SymbolTable();

/** instantiate predefined global vars */
globalSymbolTable.set('tupu', new NUMBER(0)); // NULL
globalSymbolTable.set('kweli', new NUMBER(1)); // TRUE
globalSymbolTable.set('uwongo', new NUMBER(0)); // FALSE

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
  const interpreter = new Interpreter();
  const context = new Context('<program>');
  context.symbolTable = globalSymbolTable;
  const result = interpreter.visit(ast.node, context);

  return [result.value, result.error];
}

module.exports = run;
