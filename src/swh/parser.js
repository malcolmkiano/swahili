const TT = require('./token_types');
const {
  NumberNode,
  VarAccessNode,
  VarAssignNode,
  BinOpNode,
  UnaryOpNode,
} = require('./nodes');
const ParseResult = require('./parseResult');
const { InvalidSyntaxError } = require('./error');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.tokIdx = -1;
    this.advance();
  }

  advance() {
    this.tokIdx++;
    if (this.tokIdx < this.tokens.length) {
      this.currentTok = this.tokens[this.tokIdx];
    }
    return this.currentTok;
  }

  parse() {
    let res = this.expr();
    if (!res.error && this.currentTok.type !== TT.EOF) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '+', '-', '*' or '/'`
        )
      );
    }
    return res;
  }

  atom = () => {
    let res = new ParseResult();
    const tok = this.currentTok;

    if ([TT.INT, TT.FLOAT].includes(tok.type)) {
      res.registerAdvancement();
      this.advance();
      return res.success(new NumberNode(tok));
    } else if (tok.type === TT.IDENTIFIER) {
      res.registerAdvancement();
      this.advance();
      return res.success(new VarAccessNode(tok));
    } else if (tok.type === TT.LPAREN) {
      res.registerAdvancement();
      this.advance();
      let expr = res.register(this.expr());
      if (res.error) return res;
      if (this.currentTok.type === TT.RPAREN) {
        res.registerAdvancement();
        this.advance();
        return res.success(expr);
      } else {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected ')'`
          )
        );
      }
    }

    return res.failure(
      new InvalidSyntaxError(
        tok.posStart,
        tok.posEnd,
        `Expected int, float, identifier, '+', '-' or '('`
      )
    );
  };

  power = () => {
    return this.binOp(this.atom, [TT.POW], this.factor);
  };

  factor = () => {
    let res = new ParseResult();
    const tok = this.currentTok;

    if ([TT.PLUS, TT.MINUS].includes(tok.type)) {
      res.registerAdvancement();
      this.advance();
      let factor = res.register(this.factor());
      if (res.error) return res;
      return res.success(new UnaryOpNode(tok, factor));
    }

    return this.power();
  };

  term = () => {
    return this.binOp(this.factor, [TT.MUL, TT.DIV]);
  };

  expr = () => {
    let res = new ParseResult();
    if (this.currentTok.matches(TT.KEYWORD, 'wacha')) {
      res.registerAdvancement();
      this.advance();

      if (this.currentTok.type !== TT.IDENTIFIER)
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected identifier`
          )
        );

      let varName = this.currentTok;
      res.registerAdvancement();
      this.advance();

      if (this.currentTok.type !== TT.EQ)
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected '='`
          )
        );

      res.registerAdvancement();
      this.advance();
      let expr = res.register(this.expr());
      if (res.error) return res;
      return res.success(new VarAssignNode(varName, expr));
    }

    let node = res.register(this.binOp(this.term, [TT.PLUS, TT.MINUS]));
    if (res.error)
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected 'wacha', int, float, identifier, '+', '-' or '('`
        )
      );

    return res.success(node);
  };

  // binary operation
  binOp(funcA, ops, funcB = null) {
    if (funcB === null) funcB = funcA;

    let res = new ParseResult();
    let left = res.register(funcA());
    if (res.error) return res;

    while (ops.includes(this.currentTok.type)) {
      let opTok = this.currentTok;
      res.registerAdvancement();
      this.advance();
      let right = res.register(funcB());
      if (res.error) return res;
      left = new BinOpNode(left, opTok, right);
    }

    return res.success(left);
  }
}

module.exports = Parser;
