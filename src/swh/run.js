const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');
const Context = require('./context');
const NUMBER = require('./types/number');
const SymbolTable = require('./symbolTable');

const globalSymbolTable = new SymbolTable();
globalSymbolTable.set('tupu', new NUMBER(0));
globalSymbolTable.set('kweli', new NUMBER(1));
globalSymbolTable.set('uwongo', new NUMBER(0));

function run(fn, text) {
  /** Generate tokens */
  const lexer = new Lexer(fn, text);
  const [tokens, error] = lexer.makeTokens();
  if (error) return [null, error];

  /** Generate abstract syntax tree */
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.error) return [null, ast.error];

  /** Run program */
  const interpreter = new Interpreter();
  const context = new Context('<program>');
  context.symbolTable = globalSymbolTable;
  const result = interpreter.visit(ast.node, context);

  return [result.value, result.error];
}

module.exports = run;
