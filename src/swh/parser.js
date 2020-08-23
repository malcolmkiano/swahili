const TT = require('./tokenTypes');
const {
  NumberNode,
  StringNode,
  ListNode,
  VarAccessNode,
  VarAssignNode,
  BinOpNode,
  UnaryOpNode,
  IfNode,
  ForNode,
  WhileNode,
  FuncDefNode,
  CallNode,
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
          `Expected 'wacha', 'kama', 'kwa', 'ambapo', 'shughuli', int, float, identifier, '+', '-', '(', '[' or 'si'`
        )
      );

    return res.success(node);
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
          `Expected int, float, identifier, '+', '-', '(', '[' or 'si'`
        )
      );

    return res.success(node);
  };

  /** creates nodes based on the arith-expr rule in the grammar document */
  arithExpr = () => {
    return this.binOp(this.term, [TT.PLUS, TT.MINUS]);
  };

  /** creates nodes based on the term rule in the grammar document */
  term = () => {
    return this.binOp(this.factor, [TT.MUL, TT.DIV]);
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

  /** creates nodes based on the power rule in the grammar document */
  power = () => {
    return this.binOp(this.call, [TT.POW], this.factor);
  };

  /** creates a function call node */
  call = () => {
    let res = new ParseResult();
    let atom = res.register(this.atom());
    if (res.error) return res;

    let argNodes = [];

    if (this.currentTok.type === TT.LPAREN) {
      res.registerAdvancement();
      this.advance();

      if (this.currentTok.type === TT.RPAREN) {
        res.registerAdvancement();
        this.advance();
      } else {
        argNodes.push(res.register(this.expr()));
        if (res.error)
          return res.failure(
            new InvalidSyntaxError(
              this.currentTok.posStart,
              this.currentTok.posEnd,
              `Expected ')', 'wacha', 'kama', 'kwa', 'ambapo', 'shughuli', int, float, identifier, '+', '-', '(', '[' or 'si'`
            )
          );

        while (this.currentTok.type === TT.COMMA) {
          res.registerAdvancement();
          this.advance();

          argNodes.push(res.register(this.expr()));
          if (res.error) return res;
        }

        if (this.currentTok.type !== TT.RPAREN) {
          return res.failure(
            new InvalidSyntaxError(
              this.currentTok.posStart,
              this.currentTok.posEnd,
              `Expected ',' or ')'`
            )
          );
        }

        res.registerAdvancement();
        this.advance();
      }

      return res.success(new CallNode(atom, argNodes));
    }

    return res.success(atom);
  };

  /** creates nodes based on the atom rule in the grammar document */
  atom = () => {
    let res = new ParseResult();
    const tok = this.currentTok;

    if ([TT.INT, TT.FLOAT].includes(tok.type)) {
      res.registerAdvancement();
      this.advance();
      return res.success(new NumberNode(tok));
    } else if (tok.type === TT.STRING) {
      res.registerAdvancement();
      this.advance();
      return res.success(new StringNode(tok));
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
    } else if (tok.type === TT.IDENTIFIER) {
      res.registerAdvancement();
      this.advance();
      return res.success(new VarAccessNode(tok));
    } else if (tok.type === TT.LSQUARE) {
      let listExpr = res.register(this.listExpr());
      if (res.error) return res;
      return res.success(listExpr);
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
    } else if (tok.matches(TT.KEYWORD, 'shughuli')) {
      let funcDef = res.register(this.funcDef());
      if (res.error) return res;
      return res.success(funcDef);
    }

    return res.failure(
      new InvalidSyntaxError(
        tok.posStart,
        tok.posEnd,
        `Expected int, float, identifier, '+', '-', '(', '[', 'kama', 'kwa', 'ambapo' or 'shughuli'`
      )
    );
  };

  /** parse tokens to make a list node */
  listExpr = () => {
    let res = new ParseResult();
    let elementNodes = [];
    let posStart = this.currentTok.posStart.copy();

    if (this.currentTok.type !== TT.LSQUARE)
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '['`
        )
      );

    res.registerAdvancement();
    this.advance();

    if (this.currentTok.type === TT.RSQUARE) {
      res.registerAdvancement();
      this.advance();
    } else {
      elementNodes.push(res.register(this.expr()));
      if (res.error)
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected ']', 'wacha', 'kama', 'kwa', 'ambapo', 'shughuli', int, float, identifier, '+', '-', '(', '[' or 'si'`
          )
        );

      while (this.currentTok.type === TT.COMMA) {
        res.registerAdvancement();
        this.advance();

        elementNodes.push(res.register(this.expr()));
        if (res.error) return res;
      }

      if (this.currentTok.type !== TT.RSQUARE) {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected ',' or ']'`
          )
        );
      }

      res.registerAdvancement();
      this.advance();
    }

    return res.success(
      new ListNode(elementNodes, posStart, this.currentTok.posEnd.copy())
    );
  };

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

  /** creates a function definition node */
  funcDef = () => {
    let res = new ParseResult();
    let varNameTok = null;

    if (!this.currentTok.matches(TT.KEYWORD, 'shughuli')) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected 'shughuli'`
        )
      );
    }

    res.registerAdvancement();
    this.advance();

    if (this.currentTok.type === TT.IDENTIFIER) {
      varNameTok = this.currentTok;
      res.registerAdvancement();
      this.advance();
    }

    if (this.currentTok.type !== TT.LPAREN)
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          varNameTok ? `Expected '('` : `Expected identifier or '('`
        )
      );

    res.registerAdvancement();
    this.advance();
    let argNameToks = [];

    if (this.currentTok.type === TT.IDENTIFIER) {
      argNameToks.push(this.currentTok);
      res.registerAdvancement();
      this.advance();

      while (this.currentTok.type === TT.COMMA) {
        res.registerAdvancement();
        this.advance();

        if (this.currentTok.type !== TT.IDENTIFIER)
          return res.failure(
            new InvalidSyntaxError(
              this.currentTok.posStart,
              this.currentTok.posEnd,
              varNameTok ? `Expected '('` : `Expected identifier or '('`
            )
          );

        argNameToks.push(this.currentTok);
        res.registerAdvancement();
        this.advance();
      }

      if (this.currentTok.type !== TT.RPAREN)
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected ',' or ')'`
          )
        );
    } else {
      if (this.currentTok.type !== TT.RPAREN)
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected identifier or ')'`
          )
        );
    }

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

    let nodeToReturn = res.register(this.expr());
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

    return res.success(new FuncDefNode(varNameTok, argNameToks, nodeToReturn));
  };

  /**
   * creates a binary operation node
   * @param {Function} funcA method used to parse the left side of the binary operation node
   * @param {String[]} ops list of accepted operators for this operation
   * @param {Function} funcB method used to parse the right side of the binary operation node
   */
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
