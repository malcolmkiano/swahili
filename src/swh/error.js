const string_with_arrows = require('../utils/string_with_arrows');

class Error {
  constructor(pos_start, pos_end, error_name, details) {
    this.pos_start = pos_start;
    this.pos_end = pos_end;
    this.error_name = error_name;
    this.details = details;
  }

  toString() {
    let result = `${this.error_name}: ${this.details}` + '\n';
    result += `File ${this.pos_start.fn}, line ${this.pos_start.ln + 1}`;
    result +=
      '\n\n' +
      string_with_arrows(this.pos_start.ftxt, this.pos_start, this.pos_end);
    return result;
  }
}

// Error Types
class IllegalCharError extends Error {
  constructor(pos_start, pos_end, details) {
    super(pos_start, pos_end, 'Illegal Character', details);
  }
}

class InvalidSyntaxError extends Error {
  constructor(pos_start, pos_end, details = '') {
    super(pos_start, pos_end, 'Invalid Syntax', details);
  }
}

/** Runtime error */
class RTError extends Error {
  constructor(pos_start, pos_end, details, context) {
    super(pos_start, pos_end, 'Runtime Error', details);
    this.context = context;
  }

  generate_traceback() {
    let result = '';
    let pos = this.pos_start;
    let ctx = this.context;

    while (ctx) {
      result =
        `File ${pos.fn}, line ${pos.ln + 1}, in ${ctx.display_name}` +
        '\n' +
        result;
      pos = ctx.parent_entry_pos;
      ctx = ctx.parent;
    }

    return 'Traceback (most recent call last):\n' + result;
  }

  toString() {
    let result = this.generate_traceback();
    result += `${this.error_name}: ${this.details}`;
    result +=
      '\n\n' +
      string_with_arrows(this.pos_start.ftxt, this.pos_start, this.pos_end);
    return result;
  }
}

module.exports = {
  Error,
  IllegalCharError,
  InvalidSyntaxError,
  RTError,
};
