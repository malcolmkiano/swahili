const TT = require('./tokenTypes');
const {
  NumberNode,
  StringNode,
  ListNode,
  VarAccessNode,
  VarAssignNode,
  VarDefNode,
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
    this.updateCurrentTok();
    return this.currentTok;
  }

  /**
   * moves backwards through the tokens for a given number of steps
   * @param {Number} amount number of advancements to reverse
   * @returns {Token}
   */
  reverse(amount = 1) {
    this.tokIdx -= amount;
    this.updateCurrentTok();
    return this.currentTok;
  }

  /**
   * sets the current token to match the parser's token index
   * @returns {Token}
   */
  updateCurrentTok() {
    if (this.tokIdx >= 0 && this.tokIdx < this.tokens.length) {
      this.currentTok = this.tokens[this.tokIdx];
    }
  }

  /**
   * combines a set of tokens into node(s)
   * @returns {ParseResult}
   */
  parse() {
    let res = this.statements();
    if (!res.error && this.currentTok.type !== TT.EOF) {
      console.log(this.currentTok);
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

  /** creates nodes based on the statements rule in the grammar document */
  statements = () => {
    let res = new ParseResult();
    let statements = [];
    let posStart = this.currentTok.posStart.copy();

    while (this.currentTok.type === TT.NEWLINE) {
      res.registerAdvancement();
      this.advance();
    }

    let statement = res.register(this.setExpr());
    if (res.error) return res;
    statements.push(statement);

    let moreStatements = true;

    while (true) {
      let newLineCount = 0;
      while (this.currentTok.type === TT.NEWLINE) {
        res.registerAdvancement();
        this.advance();
        newLineCount += 1;
      }

      if (newLineCount === 0) moreStatements = false;
      if (!moreStatements) break;

      // look for any statements
      let statement = res.tryRegister(this.setExpr());
      if (!statement) {
        this.reverse(res.toReverseCount);
        moreStatements = false;
        continue;
      }

      // add it to our list if found
      statements.push(statement);
    }

    return res.success(
      new ListNode(statements, posStart, this.currentTok.posEnd.copy())
    );
  };

  /** creates nodes based on the set-expr rule in the grammar document */
  setExpr = () => {
    let res = new ParseResult();
    let advanced = false;
    if (this.currentTok.type === TT.IDENTIFIER) {
      let varName = this.currentTok;

      // skip registering an advancement here just in case we need to back-track
      // since this is checking for specific tokens,
      // we don't have a method we can run `tryRegister` on
      this.advance();
      advanced = true;

      if (this.currentTok.type === TT.EQ) {
        res.registerAdvancement();
        this.advance();

        let expr = res.register(this.expr());
        if (res.error) return res;

        res.registerAdvancement();
        return res.success(new VarAssignNode(varName, expr));
      }
    }

    if (advanced) this.reverse();
    let node = res.register(this.expr());
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
      return res.success(new VarDefNode(varName, expr));
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
    let allCases = res.register(this.ifExprCases('kama'));
    if (res.error) return res;
    let [cases, elseCase] = allCases;
    return res.success(new IfNode(cases, elseCase));
  };

  /** parse tokens to make an ElseIf portion of an If Node */
  ifExprB = () => {
    return this.ifExprCases('au');
  };

  /** parse tokens to make an Else portion of an If Node */
  ifExprC = () => {
    let res = new ParseResult();
    let elseCase = null;

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

      let statements = res.register(this.statements());
      if (res.error) return res;
      elseCase = [statements, true];

      if (this.currentTok.type === TT.RCURL) {
        res.registerAdvancement();
        this.advance();
      } else {
        return res.failure(
          new InvalidSyntaxError(
            this.currentTok.posStart,
            this.currentTok.posEnd,
            `Expected '}'`
          )
        );
      }
    }

    return res.success(elseCase);
  };

  /** creates nodes based on the if-expr-b or if-expr-c rules in the grammar document */
  ifExprBOrC = () => {
    let res = new ParseResult();
    let cases = [];
    let elseCase = null;

    if (this.currentTok.matches(TT.KEYWORD, 'au')) {
      let allCases = res.register(this.ifExprB());
      if (res.error) return res;
      [cases, elseCase] = allCases;
    } else {
      elseCase = res.register(this.ifExprC());
      if (res.error) return res;
    }

    return res.success([cases, elseCase]);
  };

  /** obtains all the cases and else case for an if node */
  ifExprCases = (caseKeyword) => {
    let res = new ParseResult();
    let cases = [];
    let elseCase = null;
    let newCases = [];

    if (!this.currentTok.matches(TT.KEYWORD, caseKeyword)) {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '${caseKeyword}'`
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

    let statements = res.register(this.statements());
    if (res.error) return res;
    cases.push([condition, statements, true]);

    if (this.currentTok.type === TT.RCURL) {
      res.registerAdvancement();
      this.advance();

      let allCases = res.register(this.ifExprBOrC());
      if (res.error) return res;
      [newCases, elseCase] = allCases;
      cases = cases.concat(newCases);
    } else {
      return res.failure(
        new InvalidSyntaxError(
          this.currentTok.posStart,
          this.currentTok.posEnd,
          `Expected '}'`
        )
      );
    }

    return res.success([cases, elseCase]);
  };

  /** creates a For Node */
  forExpr = () => {
    let res = new ParseResult();
    let body = null;

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

    body = res.register(this.statements());
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
      new ForNode(varName, startValue, endValue, stepValue, body, true)
    );
  };

  /** creates a while node */
  whileExpr = () => {
    let res = new ParseResult();
    let body = null;

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

    body = res.register(this.statements());
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

    return res.success(new WhileNode(condition, body, true));
  };

  /** creates a function definition node */
  funcDef = () => {
    let res = new ParseResult();
    let varNameTok = null;
    let body = null;

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

    body = res.register(this.statements());
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

    return res.success(new FuncDefNode(varNameTok, argNameToks, body, true));
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
