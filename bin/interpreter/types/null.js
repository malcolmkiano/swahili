const util = require('util');
const colors = require('colors');
const SWValue = require('./value');
const SWBoolean = require('./boolean');

/**  Null data type */
class SWNull extends SWValue {
  /**
   * instantiates a null value
   */
  constructor() {
    super();
    this.value = null;
  }

  /** generator function for null values */
  static NULL = new SWNull();

  /**
   * logically compares two values and returns true if the values are equal
   * @param {*} other boolean to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonEQ(other) {
    return [
      new SWBoolean(this.value == other.value).setContext(this.context),
      null,
    ];
  }

  /**
   * logically compares two values and returns true if the values are not equal
   * @param {*} other boolean to be compared to the current
   * @returns {SWBoolean}
   */
  getComparisonNE(other) {
    return [
      new SWBoolean(this.value != other.value).setContext(this.context),
      null,
    ];
  }

  /**
   * logically compares two values and returns true if one is truthy
   * @param {any} other value to be compared to the current
   * @returns {SWBoolean}
   */
  oredBy(other) {
    return [other.setContext(this.context), null];
  }

  /**
   * creates a new instance of the null
   * @returns {SWNull}
   */
  copy() {
    let copy = new SWNull();
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the null class
   * @param {Boolean} showValue whether to show value and color or not
   * @returns {String}
   */
  toString(showValue = true) {
    return showValue ? colors.grey(`tupu`) : '';
  }
}

module.exports = SWNull;
