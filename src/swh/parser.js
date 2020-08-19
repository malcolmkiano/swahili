const TT = require('./token_types');
const { NumberNode, BinOpNode, UnaryOpNode } = require('./nodes');
const ParseResult = require('./parseResult');
const { InvalidSyntaxError } = require('./error');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.tok_idx = -1;
    this.advance();
  }

  advance() {
    this.tok_idx++;
    if (this.tok_idx < this.tokens.length) {
      this.current_tok = this.tokens[this.tok_idx];
    }
    return this.current_tok;
  }

  parse() {
    let res = this.expr();
    if (!res.error && this.current_tok.type !== TT.EOF) {
      return res.failure(new InvalidSyntaxError(
        this.current_tok.pos_start, this.current_tok.pos_end,
        `Expected "+", "-", "*" or "/"`
      ));
    }
    return res;
  }

  atom = () => {
    let res = new ParseResult();
    const tok = this.current_tok;

    if ([TT.INT, TT.FLOAT].includes(tok.type)) {
      res.register(this.advance());
      return res.success(new NumberNode(tok));

    } else if (tok.type === TT.LPAREN) {
      res.register(this.advance());
      let expr = res.register(this.expr());
      if (res.error) return res;
      if (this.current_tok.type === TT.RPAREN) {
        res.register(this.advance());
        return res.success(expr);
      } else {
        return res.failure(new InvalidSyntaxError(
          this.current_tok.pos_start, this.current_tok.pos_end,
          "Expected ')'"
        ));
      }
    }

    return res.failure(new InvalidSyntaxError(
      tok.pos_start, tok.pos_end,
      'Expected int, float, "+", "-" or "("'
    ));
  }

  power = () => {
    return this.bin_op(this.atom, [TT.POW], this.factor);
  }

  factor = () => {
    let res = new ParseResult();
    const tok = this.current_tok;

    if ([TT.PLUS, TT.MINUS].includes(tok.type)) {
      res.register(this.advance());
      let factor = res.register(this.factor());
      if (res.error) return res;
      return res.success(new UnaryOpNode(tok, factor));
    }

    return this.power()
  }

  term = () => {
    return this.bin_op(this.factor, [TT.MUL, TT.DIV]);
  }

  expr = () => {
    return this.bin_op(this.term, [TT.PLUS, TT.MINUS]);
  }

  // binary operation
  bin_op(func_a, ops, func_b = null) {
    if (func_b === null) func_b = func_a;

    let res = new ParseResult();
    let left = res.register(func_a());
    if (res.error) return res;

    while (ops.includes(this.current_tok.type)) {
      let op_tok = this.current_tok;
      res.register(this.advance());
      let right = res.register(func_b());
      if (res.error) return res;
      left = new BinOpNode(left, op_tok, right);
    }

    return res.success(left);
  }
}

module.exports = Parser;