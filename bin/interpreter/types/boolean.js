const util = require('util');
const colors = require('colors');

const SWValue = require('./value');

/**  Boolean data type */
class SWBoolean extends SWValue {
  /**
   * instantiates a boolean
   * @param {Boolean} value value to set
   */
  constructor(value) {
    super();
    this.value = value;
    this.typeName = 'Hali';
  }

  /** generator function for true values */
  static TRUE = new SWBoolean(true);

  /** generator function for false values */
  static FALSE = new SWBoolean(false);

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
   * logically compares two booleans and returns true if the booleans are truthy
   * @param {any} other value to be compared to the current
   * @returns {any}
   */
  andedBy(other) {
    return [
      (this.isTrue() && other.isTrue() ? other : SWBoolean.FALSE).setContext(
        this.context
      ),
      null,
    ];
  }

  /**
   * logically compares two values and returns true if one of the booleans is truthy
   * @param {any} other boolean to be compared to the current
   * @returns {any}
   */
  oredBy(other) {
    return [
      (this.isTrue()
        ? this
        : other.isTrue()
        ? other
        : SWBoolean.FALSE
      ).setContext(this.context),
      null,
    ];
  }

  /**
   * returns true if a value is falsy, and false if a value is truthy
   * @returns {SWBoolean}
   */
  notted() {
    return [new SWBoolean(!this.value).setContext(this.context), null];
  }

  /**
   * creates a new instance of the boolean
   * @returns {SWBoolean}
   */
  copy() {
    let copy = new SWBoolean(this.value);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  /**
   * returns true if the boolean value is truthy
   * @returns {Boolean}
   */
  isTrue() {
    return this.value !== false;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the boolean class
   * @param {Boolean} showColor whether to show color or not
   * @returns {String}
   */
  toString(showColor = true) {
    let output = (str) => (showColor ? colors.yellow(str) : str);
    return output(this.value ? 'kweli' : 'uwongo');
  }
}

module.exports = SWBoolean;
