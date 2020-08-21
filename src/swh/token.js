const util = require('util');
const colors = require('colors');

class Token {
  constructor(type, value = null, posStart = null, posEnd = null) {
    this.type = type;
    this.value = value;

    if (posStart) {
      this.posStart = posStart;
      this.posEnd = posStart.copy();
      this.posEnd.advance();
    }

    if (posEnd) this.posEnd = posEnd;
  }

  matches(type, value) {
    return this.type === type && this.value === value;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    if (this.value !== null) {
      return `${this.type}:${colors.cyan(this.value)}`;
    } else {
      return `${colors.yellow(this.type)}`;
    }
  }
}

module.exports = Token;
