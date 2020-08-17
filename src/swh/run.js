const Lexer = require('./lexer');
const Parser = require('./parser');

function run(fn, text) {
  // Generate tokens
  const lexer = new Lexer(fn, text);
  const [tokens, error] = lexer.makeTokens();
  if (error) return [null, error];

  // Generate abstract syntax tree
  const parser = new Parser(tokens);
  const ast = parser.parse();

  return [ast.node, ast.error];
}

module.exports = run;