const util = require('util');
const colors = require('colors');
const SWValue = require('@types/value');
const SWString = require('@types/string');

/**  DateTime data type */
class SWDateTime extends SWValue {
  /**
   * instantiates a Date
   * @param {Date} value value to set
   */
  constructor(value) {
    super();
    this.value = value;
    this.typeName = 'Tarehe';
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
    const addZero = (value, pow = 1) =>
      value < 10 ** pow ? '0'.repeat(pow) + value.toString() : value.toString();
    const to12 = (num) => (num === 12 || num === 0 ? 12 : num % 12);
    const findSuffix = (hour) =>
      Object.entries(SWDateTime.SUFFIXES).find(([suff, hours]) =>
        hours.includes(hour)
      )[0];

    if (element instanceof SWDateTime) {
      let val = element.value;
      return {
        /** Saa (Hours: 00-23) */
        SA: addZero(val.getHours()),

        /** Saa (Hours: 1-12) */
        sa: addZero(to12(val.getHours())),

        /** Dakika (Minutes: 00-59) */
        d: addZero(val.getMinutes()),

        /** Sekunde (Seconds: 00-59) */
        se: addZero(val.getSeconds()),

        /** Milisekunde (Milliseconds: 000-999) */
        ms: addZero(val.getMilliseconds(), 3),

        /** Wakati (Suffix: asubuhi/mchana/jioni/usiku/alfajiri) */
        w: findSuffix(val.getHours()),

        /** Siku (Day: Jumapili - Jumamosi) */
        s: SWDateTime.DAYS[val.getDay()],

        /** Tarehe (Date: 00-31) */
        t: addZero(val.getDate()),

        /** Mwezi fupi (Month short: 1-12) */
        m: addZero(val.getMonth() + 1),

        /** Mwezi - jina (Month names: Januari - Desemba) */
        M: SWDateTime.MONTHS[val.getMonth()],

        /** Mwaka fupi (Year short: 30-29) */
        mk: val.getFullYear().toString().substring(2),

        /** Mwaka (Year: 1930-2029) */
        MK: val.getFullYear(),
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

    let formatted = formatNode.value;
    let output = [];
    let parts = SWDateTime.getParts(this);

    for (let i = 0; i < formatted.length; i++) {
      let charSet =
        i < formatted.length - 1 ? formatted.substr(i, 2) : formatted[i];
      let char = formatted[i];
      if (parts[charSet]) {
        i++;
        output.push(parts[charSet]);
      } else if (parts[char]) {
        output.push(parts[char]);
      } else {
        output.push(char);
      }
    }

    return output.join('');
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
    let dateParts = SWDateTime.getParts(this);
    let hour = dateParts.sa;
    let min = dateParts.d;
    let date = dateParts.t;
    let month = dateParts.m;
    let year = dateParts.MK;
    let fullDate = `${date}/${month}/${year} ${hour}:${min}`;
    let output = (str) => (showColor ? colors.magenta(str) : str);
    return output(fullDate);
  }
}

module.exports = SWDateTime;
