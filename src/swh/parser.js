const TT = require('./tokenTypes');
const {
  NumberNode,
  VarAccessNode,
  VarAssignNode,
  BinOpNode,
  UnaryOpNode,
  IfNode,
  ForNode,
  WhileNode,
} = require('./nodes');
const ParseResult = require('./parseResult');
const { InvalidSyntaxError } = require('./error');

class Parser {
  /**
   * instantiates a parser
   * @param {Token[]} tokens list of tokens from the lexer
   */
  constructor(tokens) {
    this.tokens = tokens;
    this.tokIdx = -1;
    this.advance();
  }

  /**
   * moves to the next token from the lexer
   * @returns {Token}
   */
  advance() {
    this.tokIdx++;
    if (this.tokIdx < this.tokens.length) {
      this.currentTok = this.tokens[this.tokIdx];
    }
    return this.currentTok;
  }

  /**
   * combines a set of tokens into node(s)
   * @returns {ParseResult}
   */
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

  /** parse tokens to make an If Node with cases and an optional else case */
  ifExpr = () => {
    let res = new ParseResult();
    let cases = [];
    let elseCase = null;
    let output = null;

    if (!this.currentTok.matches(TT.KEYWORD, 'kama')) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected 'kama'`
        )
      );
    }

    /**
     * extract a case (condition, expr) from a set of tokens
     * @returns {Error}
     */
    const getCase = () => {
      res.registerAdvancement();
      this.advance();

      let condition = res.register(this.expr());
      if (res.error) return res;

      if (this.currentTok.type !== TT.LCURL) {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected '{'`
          )
        );
      }

      res.registerAdvancement();
      this.advance();

      let expr = res.register(this.expr());
      if (res.error) return res;

      if (this.currentTok.type !== TT.RCURL) {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected '}'`
          )
        );
      }

      cases.push([condition, expr]);

      res.registerAdvancement();
      this.advance();
    };

    // Get the first case
    output = getCase();
    if (output) return output;

    // Grab the cases from any ELSEIF(AU) blocks
    while (this.currentTok.matches(TT.KEYWORD, 'au')) {
      output = getCase();
      if (output) return output;
    }

    if (this.currentTok.matches(TT.KEYWORD, 'sivyo')) {
      res.registerAdvancement();
      this.advance();

      if (this.currentTok.type !== TT.LCURL) {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected '{'`
          )
        );
      }

      res.registerAdvancement();
      this.advance();

      elseCase = res.register(this.expr());
      if (res.error) return res;

      if (this.currentTok.type !== TT.RCURL) {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected '}'`
          )
        );
      }

      res.registerAdvancement();
      this.advance();
    }

    return res.success(new IfNode(cases, elseCase));
  };

  /** creates a For Node */
  forExpr = () => {
    let res = new ParseResult();

    if (!this.currentTok.matches(TT.KEYWORD, 'kwa')) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected 'kwa'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    if (this.currentTok.type !== TT.IDENTIFIER) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected identifier`
        )
      );
    }

    let varName = this.currentTok;
    res.registerAdvancement();
    this.advance();

    if (this.currentTok.type !== TT.EQ) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '='`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    let startValue = res.register(this.expr());
    if (res.error) return res;

    if (!this.currentTok.matches(TT.KEYWORD, 'mpaka')) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected 'mpaka'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    let endValue = res.register(this.expr());
    if (res.error) return res;

    let stepValue = null;
    if (this.currentTok.matches(TT.KEYWORD, 'hatua')) {
      res.registerAdvancement();
      this.advance();

      stepValue = res.register(this.expr());
      if (res.error) return res;
    }

    if (this.currentTok.type !== TT.LCURL) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '{'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    let body = res.register(this.expr());
    if (res.error) return res;

    if (this.currentTok.type !== TT.RCURL) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '}'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    return res.success(
      new ForNode(varName, startValue, endValue, stepValue, body)
    );
  };

  /** creates a while node */
  whileExpr = () => {
    let res = new ParseResult();

    if (!this.currentTok.matches(TT.KEYWORD, 'ambapo')) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected 'ambapo'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    let condition = res.register(this.expr());
    if (res.error) return res;

    if (this.currentTok.type !== TT.LCURL) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '{'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    let body = res.register(this.expr());
    if (res.error) return res;

    if (this.currentTok.type !== TT.RCURL) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '}'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    return res.success(new WhileNode(condition, body));
  };

  /** creates nodes based on the atom rule in the grammar document */
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
    } else if (tok.matches(TT.KEYWORD, 'kama')) {
      let ifExpr = res.register(this.ifExpr());
      if (res.error) return res;
      return res.success(ifExpr);
    } else if (tok.matches(TT.KEYWORD, 'kwa')) {
      let forExpr = res.register(this.forExpr());
      if (res.error) return res;
      return res.success(forExpr);
    } else if (tok.matches(TT.KEYWORD, 'ambapo')) {
      let whileExpr = res.register(this.whileExpr());
      if (res.error) return res;
      return res.success(whileExpr);
    }

    return res.failure(
      new InvalidSyntaxError(
        tok.posStart,
        tok.posEnd,
        `Expected int, float, identifier, '+', '-' or '('`
      )
    );
  };

  /** creates nodes based on the power rule in the grammar document */
  power = () => {
    return this.binOp(this.atom, [TT.POW], this.factor);
  };

  /** creates nodes based on the power rule in the grammar document */
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

  /** creates nodes based on the term rule in the grammar document */
  term = () => {
    return this.binOp(this.factor, [TT.MUL, TT.DIV]);
  };

  /** creates nodes based on the arith-expr rule in the grammar document */
  arithExpr = () => {
    return this.binOp(this.term, [TT.PLUS, TT.MINUS]);
  };

  /** creates nodes based on the comp-expr rule in the grammar document */
  compExpr = () => {
    let res = new ParseResult();
    let node = null;

    if (this.currentTok.type === TT.NOT) {
      let opToken = this.currentTok;
      res.registerAdvancement();
      this.advance();

      node = res.register(this.compExpr());
      if (res.error) return res;
      return res.success(new UnaryOpNode(opToken, node));
    }

    node = res.register(
      this.binOp(this.arithExpr, [TT.EE, TT.NE, TT.LT, TT.GT, TT.LTE, TT.GTE])
    );
    if (res.error)
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected int, float, identifier, '+', '-', '(' or 'si'`
        )
      );

    return res.success(node);
  };

  /** creates nodes based on the expr rule in the grammar document */
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

    let node = res.register(this.binOp(this.compExpr, [TT.AND, TT.OR]));
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

  /** creates binary operation nodes */
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
