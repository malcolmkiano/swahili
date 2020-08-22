const util = require('util');
const colors = require('colors');
const SWValue = require('./value');
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
    this.setPosition();
    this.setContext();
  }

  /**
   * mathematically adds two numbers and returns a new number with their sum
   * @param {SWNumber} other number to be added to the current
   * @returns {SWNumber}
   */
  addedTo(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value + other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
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
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
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
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
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
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
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
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the numbers are equal
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  getComparisonEQ(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value === other.value ? 1 : 0).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the numbers are not equal
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  getComparisonNE(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value !== other.value ? 1 : 0).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is less than the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  getComparisonLT(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value < other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is greater than the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  getComparisonGT(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value > other.value ? 1 : 0).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is less than or equal to the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  getComparisonLTE(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value <= other.value ? 1 : 0).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * mathematically compares two numbers and returns 1 if the current is greater than or equal to the other
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  getComparisonGTE(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value >= other.value ? 1 : 0).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * logically compares two numbers and returns 1 if the numbers are truthy
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  andedBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value && other.value ? 1 : 0).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * logically compares two numbers and returns 1 if one of the numbers is truthy
   * @param {SWNumber} other number to be compared to the current
   * @returns {SWNumber}
   */
  oredBy(other) {
    if (other instanceof SWNumber) {
      return [
        new SWNumber(this.value || other.value ? 1 : 0).setContext(
          this.context
        ),
        null,
      ];
    } else {
      return [null, super.illegalOperation(this.posStart, other.posEnd)];
    }
  }

  /**
   * returns 1 if a value is falsy, and 0 if a value is truthy
   * @returns {SWNumber}
   */
  notted() {
    return [
      new SWNumber(this.value == 0 ? 1 : 0).setContext(this.context),
      null,
    ];
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
   * @returns {String}
   */
  toString() {
    return `${colors.yellow(this.value)}`;
  }
}

module.exports = SWNumber;
