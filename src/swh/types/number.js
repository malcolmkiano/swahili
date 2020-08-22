const util = require('util');
const colors = require('colors');
const { RTError } = require('../error');

/**  Number data type */
class NUMBER {
  constructor(value) {
    this.value = value;
    this.setPos();
    this.setContext();
  }

  /**
   * Sets the position at which the number node occurs in the file/line
   * @param {Position} posStart the starting position of the number node
   * @param {Position} posEnd the ending position of the number node
   * @returns {NUMBER}
   */
  setPos(posStart = null, posEnd = null) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    return this;
  }

  /**
   * Sets the conext in which the number node occurs
   * @param {Context} context the calling context
   * @returns {NUMBER}
   */
  setContext(context = null) {
    this.context = context;
    return this;
  }

  /**
   * mathematically adds two numbers and returns a new number with their sum
   * @param {NUMBER} other number to be added to the current
   * @returns {NUMBER}
   */
  addedTo(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value + other.value).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically subtracts two numbers and returns a new number with their difference
   * @param {NUMBER} other number to be subtracted from the current
   * @returns {NUMBER}
   */
  subbedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value - other.value).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically multiplies two numbers and returns a new number with their product
   * @param {NUMBER} other number to be multiplied by the current
   * @returns {NUMBER}
   */
  multedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value * other.value).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically divides two numbers and returns a new number with their quotient
   * @param {NUMBER} other number to divide the current by
   * @returns {NUMBER}
   */
  divvedBy(other) {
    if (other instanceof NUMBER) {
      if (other.value === 0) {
        return [
          null,
          new RTError(
            other.posStart,
            other.posEnd,
            'Division by zero',
            this.context
          ),
        ];
      }

      return [
        new NUMBER(this.value / other.value).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically raises one number to the power of the other and returns a new number with the result
   * @param {NUMBER} other number to raise the current to
   * @returns {NUMBER}
   */
  powedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value ** other.value).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the numbers are equal
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  getComparisonEQ(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value === other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the numbers are not equal
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  getComparisonNE(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value !== other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is less than the other
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  getComparisonLT(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value < other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is greater than the other
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  getComparisonGT(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value > other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is less than or equal to the other
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  getComparisonLTE(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value <= other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is greater than or equal to the other
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  getComparisonGTE(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value >= other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * logically compares two numbers and returns 1 if the numbers are truthy
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  andedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value && other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * logically compares two numbers and returns 1 if one of the numbers is truthy
   * @param {NUMBER} other number to be compared to the current
   * @returns {NUMBER}
   */
  oredBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value || other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    }
  }

  /**
   * returns 1 if a value is falsy, and 0 if a value is truthy
   * @returns {NUMBER}
   */
  notted() {
    return [new NUMBER(this.value == 0 ? 1 : 0).setContext(this.context), null];
  }

  /**
   * creates a new instance of the number
   * @returns {NUMBER}
   */
  copy() {
    let copy = new NUMBER(this.value);
    copy.setPos(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  /**
   * returns true if the number value is truthy
   * @returns {Boolean}
   */
  isTrue() {
    return this.value !== 0;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the number class
   * @returns {String}
   */
  toString() {
    return `${colors.yellow(this.value)}`;
  }
}

module.exports = NUMBER;
