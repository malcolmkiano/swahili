const util = require('util');
const colors = require('colors');

/**
 * smallest recognizable component of the programming language
 */
class Token {
  /**
   * instantiates a token
   * @param {String} type type of token to instantiate
   * @param {*} value value for the token
   * @param {Position} posStart location token was encountered in the file/line
   * @param {Postion} posEnd end location of the token
   */
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

  /**
   * checks if token matches given type and value
   * @param {String} type type to be matched
   * @param {*} value value to be matched
   * @returns {Boolean}
   */
  matches(type, value) {
    return this.type === type && this.value === value;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the number class
   * @returns {String}
   */
  toString() {
    if (this.value !== null) {
      return `${this.type}:${colors.cyan(this.value)}`;
    } else {
      return `${colors.yellow(this.type)}`;
    }
  }
}

module.exports = Token;
