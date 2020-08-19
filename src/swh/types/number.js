const util = require('util');
const colors = require('colors');
const { RTError } = require('../error');

/** capitalized to prevent conflicts with JS primitive types */
class NUMBER {
  constructor(value) {
    this.value = value;
    this.set_pos();
    this.set_context();
  }

  set_pos(pos_start = null, pos_end = null) {
    this.pos_start = pos_start;
    this.pos_end = pos_end;
    return this;
  }

  set_context(context = null) {
    this.context = context;
    return this;
  }

  added_to(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value + other.value).set_context(this.context),
        null,
      ];
    }
  }

  subbed_by(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value - other.value).set_context(this.context),
        null,
      ];
    }
  }

  multed_by(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value * other.value).set_context(this.context),
        null,
      ];
    }
  }

  divved_by(other) {
    if (other instanceof NUMBER) {
      if (other.value === 0) {
        return [
          null,
          new RTError(
            other.pos_start,
            other.pos_end,
            'Division by zero',
            this.context
          ),
        ];
      }

      return [
        new NUMBER(this.value / other.value).set_context(this.context),
        null,
      ];
    }
  }

  powed_by(other) {
    if (other instanceof NUMBER) {
      return [
        new NUMBER(this.value ** other.value).set_context(this.context),
        null,
      ];
    }
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return `${colors.yellow(this.value)}`;
  }
}

module.exports = NUMBER;
