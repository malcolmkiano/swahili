const util = require('util');
const colors = require('colors');

const SWValue = require('./value');

/**  Timeout data type */
class SWTimeout extends SWValue {
  /**
   * instantiates a timeout
   * @param {string} type the type of timeout (interval/timeout)
   * @param {SWBaseFunction} fn the function to be executed every interval/on timeout
   * @param {number} time the amount of time in ms to wait before executing the fn
   * @param {Timeout} value value to set
   */
  constructor(type, fn, time, value) {
    super();
    this.type = type;
    this.fn = fn;
    this.time = time;
    this.value = value;
    this.typeName = 'Muda';
  }

  /**
   * creates a new instance of the timeout
   * @returns {SWTimeout}
   */
  copy() {
    let copy = new SWTimeout(this.type, this.fn, this.time, this.value);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    copy.parent = this.parent;
    copy.name = this.name;
    return copy;
  }

  /**
   * returns true
   * @returns {Boolean}
   */
  isTrue() {
    return true;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the timeout class
   * @param {Boolean} showColor whether to show color or not
   * @returns {String}
   */
  toString(showColor = true) {
    const recurring = this.type === 'interval' ? '*' : '';
    let output = `Muda<${this.time}>${recurring}`;

    if (showColor) {
      output = colors.brightBlue(output);
    }

    return output;
  }
}

module.exports = SWTimeout;
