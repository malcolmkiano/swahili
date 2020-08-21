const TT = require('./tokenTypes');
const KEYWORDS = require('./keywords');

const Token = require('./token');
const Position = require('./position');
const { IllegalCharError } = require('./error');

class Lexer {
  constructor(fn, text) {
    this.fn = fn;
    this.text = text;
    this.pos = new Position(-1, 0, -1, fn, text);
    this.currentChar = null;
    this.advance();
  }

  advance() {
    this.pos.advance(this.currentChar);
    this.currentChar =
      this.pos.idx < this.text.length ? this.text[this.pos.idx] : null;
  }

  makeNumber() {
    let numStr = '';
    let dotCount = 0;
    let posStart = this.pos.copy();

    // keep going while character is a digit or a dot, and we haven't seen a dot yet
    while (
      this.currentChar !== null &&
      (TT.DIGITS + '.').includes(this.currentChar)
    ) {
      if (this.currentChar === '.') {
        if (dotCount === 1) break;
        dotCount++;
        numStr += '.';
      } else {
        numStr += this.currentChar;
      }
      this.advance();
    }

    // check if INT or FLOAT
    if (dotCount === 0) {
      return new Token(TT.INT, parseInt(numStr), posStart, this.pos);
    } else {
      return new Token(TT.FLOAT, parseFloat(numStr), posStart, this.pos);
    }
  }

  makeIdentifier() {
    let idStr = '';
    let posStart = this.pos.copy();

    // keep going while character is a alphanumeric or an underscore
    while (
      this.currentChar !== null &&
      (TT.LETTERS + TT.DIGITS + '_').includes(this.currentChar)
    ) {
      idStr += this.currentChar;
      this.advance();
    }

    // check if KEYWORD or IDENTIFIER
    let tokType = KEYWORDS.includes(idStr) ? TT.KEYWORD : TT.IDENTIFIER;
    return new Token(tokType, idStr, posStart, this.pos);
  }

  makeTokens() {
    let tokens = [];

    while (this.currentChar !== null) {
      if (' \t'.includes(this.currentChar)) {
        // ignore spaces and tabs
        this.advance();
      } else if (TT.DIGITS.includes(this.currentChar)) {
        tokens.push(this.makeNumber());
      } else if (TT.LETTERS.includes(this.currentChar)) {
        tokens.push(this.makeIdentifier());
      } else if (this.currentChar === '+') {
        tokens.push(new Token(TT.PLUS, null, this.pos));
        this.advance();
      } else if (this.currentChar === '-') {
        tokens.push(new Token(TT.MINUS, null, this.pos));
        this.advance();
      } else if (this.currentChar === '*') {
        tokens.push(new Token(TT.MUL, null, this.pos));
        this.advance();
      } else if (this.currentChar === '/') {
        tokens.push(new Token(TT.DIV, null, this.pos));
        this.advance();
      } else if (this.currentChar === '^') {
        tokens.push(new Token(TT.POW, null, this.pos));
        this.advance();
      } else if (this.currentChar === '=') {
        tokens.push(new Token(TT.EQ, null, this.pos));
        this.advance();
      } else if (this.currentChar === '(') {
        tokens.push(new Token(TT.LPAREN, null, this.pos));
        this.advance();
      } else if (this.currentChar === ')') {
        tokens.push(new Token(TT.RPAREN, null, this.pos));
        this.advance();
      } else {
        let posStart = this.pos.copy();
        let char = this.currentChar;
        this.advance();
        return [[], new IllegalCharError(posStart, this.pos, `'${char}'`)];
      }
    }

    tokens.push(new Token(TT.EOF, null, this.pos));
    return [tokens, null];
  }
}

module.exports = Lexer;
