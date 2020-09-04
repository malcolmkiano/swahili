const SWValue = require('./value');
const RTResult = require('../runtimeResult');

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
}

module.exports = SWRegEx;
