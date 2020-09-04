const util = require('util');
const colors = require('colors');

const SWValue = require('./value');
const SWNumber = require('./number');
const SWBoolean = require('./boolean');
const { RTError } = require('../error');

/**  String data type */
class SWString extends SWValue {
  /**
   * instantiates a string
   * @param {String} value value to set
   */
  constructor(value) {
    super();
    this.value = value;
    this.typeName = 'Jina';
  }

  /**
   * concatenates two strings and returns a new string with their combination
   * @param {SWString} other string to be added to the current
   * @returns {SWString}
   */
  addedTo(other) {
    if (other instanceof SWString) {
      return [
        new SWString(this.value + other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * repeats a string for as many times as the number provided
   * @param {SWNumber} other number of times to repeat the string
   * @returns {String}
   */
  multedBy(other) {
    if (other instanceof SWNumber) {
      if (other.value < 0) {
        return [
          null,
          new RTError(
            other.posStart,
            other.posEnd,
            `Invalid repeat count (${other.value})`,
            this.context
          ),
        ];
      }
      return [
        new SWString(this.value.repeat(other.value)).setContext(this.context),
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
   * logically compares two strings and returns the other string if the current is truthy
   * @param {SWString} other string to show if current is truthy
   * @returns {SWString}
   */
  andedBy(other) {
    if (other instanceof SWString) {
      return [
        new SWString(this.value && other.value).setContext(this.context),
        null,
      ];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * logically compares two strings and returns which one of the strings is truthy
   * @param {SWString} other string to be compared to the current
   * @returns {SWString}
   */
  oredBy(other) {
    if (other instanceof SWString) {
      return [
        new SWString(this.value || other.value).setContext(this.context),
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
    return [
      new SWBoolean(this.value.length === 0).setContext(this.context),
      null,
    ];
  }

  /**
   * creates a new instance of the string
   * @returns {SWString}
   */
  copy() {
    let copy = new SWString(this.value);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  /**
   * returns true if the string value is truthy
   * @returns {Boolean}
   */
  isTrue() {
    return this.value.length > 0;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the string class
   * @param {Boolean} showQuotes whether to show quotes and color or not
   * @returns {String}
   */
  toString(showQuotes = true) {
    const escapes = {
      '\\n': '\n',
      '\\t': '\t',
    };

    // this allows string objects to contain raw escapes in their value,
    // so they can be used to create RegEx patterns
    // they clean themselves (parse any special escape chars) when printed out
    let escapedValue = this.value;
    for (let [esc, val] of Object.entries(escapes)) {
      let reg = new RegExp('\\' + esc, 'g');
      escapedValue = escapedValue.replace(reg, val);
    }
    return showQuotes ? colors.green(`"${escapedValue}"`) : escapedValue;
  }
}

module.exports = SWString;
