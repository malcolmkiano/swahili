const util = require('util');
const colors = require('colors');
const { RTError } = require('../error');

/** capitalized to prevent conflicts with JS primitive types */
class NUMBER {
  constructor(value) {
    this.value = value;
    this.setPos();
    this.setContext();
  }

  setPos(posStart = null, posEnd = null) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    return this;
  }

  setContext(context = null) {
    this.context = context;
    return this;
  }

  addedTo(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value + other.value).setContext(this.context),
        null,
      ];
    }
  }

  subbedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value - other.value).setContext(this.context),
        null,
      ];
    }
  }

  multedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value * other.value).setContext(this.context),
        null,
      ];
    }
  }

  divvedBy(other) {
    if (other instanceof NUMBER) {
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
        new NUMBER(this.value / other.value).setContext(this.context),
        null,
      ];
    }
  }

  powedBy(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value ** other.value).setContext(this.context),
        null,
      ];
    }
  }

  copy() {
    let copy = new NUMBER(this.value);
    copy.setPos(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return `${colors.yellow(this.value)}`;
  }
}

module.exports = NUMBER;
