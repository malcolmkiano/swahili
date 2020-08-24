const util = require('util');
const colors = require('colors');
const SWValue = require('./value');
const SWBoolean = require('./boolean');
const { RTError } = require('../error');

/**  Number data type */
class SWNumber extends SWValue {
  /**
   * instantiates a number
   * @param {Number} value value to set
   */
  constructor(value) {
    super();
    this.value = value;
  }

  /**
   * mathematically adds two numbers and returns a new number with their sum
   * @param {SWNumber} other number to be added to the current
   * @returns {SWNumber}
   */
  addedTo(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(Number(this.value) + Number(other.value)).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically subtracts two numbers and returns a new number with their difference
   * @param {SWNumber} other number to be subtracted from the current
   * @returns {SWNumber}
   */
  subbedBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value - other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically multiplies two numbers and returns a new number with their product
   * @param {SWNumber} other number to be multiplied by the current
   * @returns {SWNumber}
   */
  multedBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value * other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically divides two numbers and returns a new number with their quotient
   * @param {SWNumber} other number to divide the current by
   * @returns {SWNumber}
   */
  divvedBy(other) {
    if (other instanceof SWNumber) {
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
        new SWNumber(this.value / other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically raises one number to the power of the other and returns a new number with the result
   * @param {SWNumber} other number to raise the current to
   * @returns {SWNumber}
   */
  powedBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value ** other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * compares two values for equality
   * @param {*} other node to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonEQ(other) {
    return [
      new SWBoolean(this.value === other.value).setContext(this.context),
      null,
    ];
  }

  /**
   * compares two values for inequality
   * @param {*} other node to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonNE(other) {
    return [
      new SWBoolean(this.value !== other.value).setContext(this.context),
      null,
    ];
  }

  /**
   * mathematically compares two numbers and returns true if the current is less than the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonLT(other) {
    if (other instanceof SWNumber) {
      return [
        new SWBoolean(this.value < other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically compares two numbers and returns true if the current is greater than the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonGT(other) {
    if (other instanceof SWNumber) {
      return [
        new SWBoolean(this.value > other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically compares two numbers and returns true if the current is less than or equal to the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonLTE(other) {
    if (other instanceof SWNumber) {
      return [
        new SWBoolean(this.value <= other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * mathematically compares two numbers and returns true if the current is greater than or equal to the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonGTE(other) {
    if (other instanceof SWNumber) {
      return [
        new SWBoolean(this.value >= other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * logically compares two numbers and returns true if the numbers are truthy
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWBoolean}
   */
  andedBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWBoolean(this.value && other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * logically compares two numbers and returns which one of the numbers is truthy
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  oredBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value || other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * returns true if a value is falsy, and false if a value is truthy
   * @returns {SWBoolean}
   */
  notted() {
    return [new SWBoolean(this.value === 0).setContext(this.context), null];
  }

  /**
   * creates a new instance of the number
   * @returns {SWNumber}
   */
  copy() {
    let copy = new SWNumber(this.value);
    copy.setPosition(this.posStart, this.posEnd);
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
   * @param {Boolean} showColor whether to show number color or not
   * @returns {String}
   */
  toString(showColor = true) {
    return showColor
      ? `${colors.yellow(this.value)}`
      : colors.brightWhite(this.value);
  }
}

module.exports = SWNumber;
