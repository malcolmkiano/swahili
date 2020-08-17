const C = require('./constants');
const TT = require('./token_types');

const Token = require('./token');
const Position = require('./position');
const { IllegalCharError } = require('./error');

class Lexer {
  constructor(fn, text) {
    this.fn = fn;
    this.text = text;
    this.pos = new Position(-1, 0, -1, fn, text)
    this.current_char = null;
    this.advance();
  }

  advance() {
    this.pos.advance(this.current_char);
    this.current_char = this.pos.idx < this.text.length ? this.text[this.pos.idx] : null;
  }

  makeNumber() {
    let num_str = '';
    let dot_count = 0;
    let pos_start = this.pos.copy();

    // keep going while character is a digit or a dot, and we haven't seen a dot yet
    while (this.current_char !== null && (C.DIGITS + '.').includes(this.current_char)) {
      if (this.current_char === '.') {
        if (dot_count === 1) break;
        dot_count++;
        num_str += '.';
      } else {
        num_str += this.current_char;
      }
      this.advance();
    }

    // check if INT or FLOAT
    if (dot_count === 0) {
      return new Token(TT.INT, parseInt(num_str), pos_start, this.pos);
    } else {
      return new Token(TT.FLOAT, parseFloat(num_str), pos_start, this.pos);
    }
  }

  makeTokens() {
    let tokens = [];

    while (this.current_char !== null) {
      if (' \t'.includes(this.current_char)) {
        // ignore spaces and tabs
        this.advance();
      } else if (C.DIGITS.includes(this.current_char)) {
        tokens.push(this.makeNumber());
      } else if (this.current_char === '+') {
        tokens.push(new Token(TT.PLUS, null, this.pos));
        this.advance();
      } else if (this.current_char === '-') {
        tokens.push(new Token(TT.MINUS, null, this.pos));
        this.advance();
      } else if (this.current_char === '*') {
        tokens.push(new Token(TT.MUL, null, this.pos));
        this.advance();
      } else if (this.current_char === '/') {
        tokens.push(new Token(TT.DIV, null, this.pos));
        this.advance();
      } else if (this.current_char === '(') {
        tokens.push(new Token(TT.LPAREN, null, this.pos));
        this.advance();
      } else if (this.current_char === ')') {
        tokens.push(new Token(TT.RPAREN, null, this.pos));
        this.advance();
      } else {
        let pos_start = this.pos.copy();
        let char = this.current_char;
        this.advance();
        return [[], new IllegalCharError(pos_start, this.pos, `'${char}'`)];
      }
    }

    tokens.push(new Token(TT.EOF, null, this.pos));
    return [tokens, null];
  }
}

module.exports = Lexer;