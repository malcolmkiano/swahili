const util = require('util');
const colors = require('colors');

class Token {
  constructor(type, value = null, pos_start = null, pos_end = null) {
    this.type = type;
    this.value = value;

    if (pos_start) {
      this.pos_start = pos_start;
      this.pos_end = pos_start.copy();
      this.pos_end.advance();
    }

    if (pos_end) this.pos_end = pos_end;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    if (this.value) {
      return `${this.type}:${colors.cyan(this.value)}`;
    } else {
      return `${colors.yellow(this.type)}`;
    }
  }
}

module.exports = Token;