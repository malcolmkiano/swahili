const util = require('util');
const colors = require('colors');

const SWValue = require('./value');

/** RegEx data type */
class SWRegEx extends SWValue {
  /**
   * instantiates a RegEx value
   * @param {String} value value to set
   * @param {String} flags flags to set
   */
  constructor(value, flags) {
    super();
    this._value = value;
    this._flags = flags;
    this.value = new RegExp(value, flags);
    this.typeName = 'RegEx';
  }

  /**
   * creates a new instance of the RegEx value
   * @returns {SWRegEx}
   */
  copy() {
    let copy = new SWRegEx(this._value, this._flags);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the RegEx class
   * @param {Boolean} format whether to format the name or not
   * @returns {String}
   */
  toString(format = true) {
    return format
      ? colors.blue(`RegEx: /${this._value}/${this._flags}`)
      : `/${this._value}/${this._flags}`;
  }
}

module.exports = SWRegEx;
