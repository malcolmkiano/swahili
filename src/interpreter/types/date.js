const util = require('util');
const colors = require('colors');
const SWValue = require('./value');

/**  Date data type */
class SWDate extends SWValue {
  /**
   * instantiates a Date
   * @param {Date} value value to set
   */
  constructor(value) {
    super();
    this.value = value;
  }
  static DAYS = [
    "Jumapili",
    "Jumatatu",
    "Jumanne",
    "Jumatano",
    "Alhamisi",
    "Ijumaa",
    "Jumamosi"
  ];

  static MONTHS = [
      "Januari",
      "Februari",
      "Machi",
      "Aprili",
      "Mei",
      "Juni",
      "Julai",
      "Agosti",
      "Septemba",
      "Oktoba",
      "Novemba",
      "Desemba"
  ];


  /**
   * creates a new instance of the Date
   * @returns {SWDate}
   */
  copy() {
    let copy = new SWDate(this.value);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  /**
   * returns true if the Date value is truthy
   * @returns {Date}
   */
  isTrue() {
    return this.value !== false;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the Date class
   * @param {Date} showColor whether to show color or not
   * @returns {String}
   */
  toString(showColor = true) {
    let output = (str) => (showColor ? colors.yellow(str) : str);
    return output(this.value ? 'kweli' : 'uwongo');
  }
}

module.exports = SWDate;
