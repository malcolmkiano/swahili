const util = require('util');
const colors = require('colors');
const SWValue = require('./value');
const SWString = require('./string');

/**  DateTime data type */
class SWDateTime extends SWValue {
  /**
   * instantiates a Date
   * @param {Date} value value to set
   */
  constructor(value) {
    super();
    this.value = value;
  }

  /** dictionary for Swahili day names */
  static DAYS = [
    'Jumapili',
    'Jumatatu',
    'Jumanne',
    'Jumatano',
    'Alhamisi',
    'Ijumaa',
    'Jumamosi',
  ];

  /** dictionary for Swahili month names */
  static MONTHS = [
    'Januari',
    'Februari',
    'Machi',
    'Aprili',
    'Mei',
    'Juni',
    'Julai',
    'Agosti',
    'Septemba',
    'Oktoba',
    'Novemba',
    'Desemba',
  ];

  /** dictionary for Swahili time suffixes */
  static SUFFIXES = {
    asubuhi: [7, 8, 9, 10, 11],
    mchana: [12, 13, 14, 15],
    jioni: [16, 17, 18],
    usiku: [19, 20, 21, 22, 23, 0, 1, 2, 3],
    alfajiri: [4, 5, 6],
  };

  /**
   * Obtains the different parts from a date value
   * @param {SWDateTime} element DateTime object to be broken into its parts
   */
  static getParts = (element) => {
    const to12 = (num) => (num === 12 || num === 0 ? 12 : num % 12);
    const findSuffix = (hour) =>
      Object.entries(SWDateTime.SUFFIXES).find(([suff, hours]) =>
        hours.includes(hour)
      )[0];

    if (element instanceof SWDateTime) {
      let val = element.value;
      return {
        ms: val.getMilliseconds(),
        sec: val.getSeconds(),
        min: val.getMinutes(),
        hour: to12(val.getHours()),
        hour24: val.getHours(),
        suffix: findSuffix(val.getHours()),
        dayName: SWDateTime.DAYS[val.getDay()],
        date: val.getDate(),
        month: val.getMonth() + 1,
        monthName: SWDateTime.MONTHS[val.getMonth()],
        year: val.getFullYear().toString().substring(2),
        yearLong: val.getFullYear(),
      };
    } else {
      return {};
    }
  };

  /**
   * Prints a date in a specific format
   */
  toFormat(formatNode) {
    if (!formatNode instanceof SWString)
      return [null, super.illegalOperation(formatNode)];

    // targets
    // SA => 00 - 23 (hour/24)
    // sa => 01 - 12 (hour/12)
    // se => 00 - 59 (second)
    // s => Jumapili - Jumamosi (day/name)
    // MK => 1930 - 2029 (year/long)
    // mk => 30 - 29 (year/short)
    // ms => 000 - 999 (milliseconds)
    // M => Januari - Desemba (month/name)
    // m => 01 - 12 (month/num)
    // d => 00 - 59 (minute)
    // t => 01 - 31 (date)
    // w => asubuhi/mchana/jioni/usiku/alfajiri (suffix)

    let format = formatNode.value;
  }

  /**
   * creates a new instance of the Date
   * @returns {SWDate}
   */
  copy() {
    let copy = new SWDateTime(this.value);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  /**
   * returns true if the Date value is truthy
   * @returns {Boolean}
   */
  isTrue() {
    return this.value != false;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the Date class
   * @param {Boolean} showColor whether to show color or not
   * @returns {String}
   */
  toString(showColor = true) {
    const addZero = (value) =>
      value < 10 ? '0' + value.toString() : value.toString();

    let dateParts = SWDateTime.getParts(this);
    let hour = addZero(dateParts.hour);
    let minute = addZero(dateParts.min);
    let date = addZero(dateParts.date);
    let month = addZero(dateParts.month);
    let year = dateParts.year;
    let fullDate = `${date}/${month}/${year} ${hour}:${min}`;
    let output = (str) => (showColor ? colors.magenta(str) : str);
    return output(fullDate);
  }
}

module.exports = SWDateTime;
