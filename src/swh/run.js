const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');
const Context = require('./context');

function run(fn, text) {
  // Generate tokens
  const lexer = new Lexer(fn, text);
  const [tokens, error] = lexer.makeTokens();
  if (error) return [null, error];

  // Generate abstract syntax tree
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.error) return [null, ast.error];

  // Run program
  const interpreter = new Interpreter();
  const context = new Context('<program>');
  const result = interpreter.visit(ast.node, context);

  return [result.value, result.error];
}

module.exports = run;
