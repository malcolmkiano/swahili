const Lexer = require('@lex');
const Parser = require('@parse');
const Context = require('@int/context');
const Interpreter = require('@int');
const SymbolTable = require('@int/symbolTable');

const SWBuiltInFunction = require('@types/built-in-function');
const { functions, constants } = require('@lib');

/** holds all variables and their values in the global scope */
const globalSymbolTable = new SymbolTable();

// library injection
for (let [libConst, value] of Object.entries(constants)) {
  globalSymbolTable.setConstant(libConst, value);
}

for (let fn of functions) {
  let libFn = fn.method.name;
  globalSymbolTable.setConstant(libFn, new SWBuiltInFunction(libFn));
}

/**
 * Processes a file through the lexer, parser and interpreter
 * @param {String} fileName name of file to be processed
 * @param {String} text content of the file
 * @param {Boolean} temp run the program in a temporary isolated scope if true
 * @returns {[String, Error]}
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

  return [result.value, result.error];
}

module.exports = run;
