const string_with_arrows = require('./utils/string_with_arrows');

class Error {
  constructor(pos_start, pos_end, error_name, details) {
    this.pos_start = pos_start;
    this.pos_end = pos_end;
    this.error_name = error_name;
    this.details = details;
  }

  toString() {
    let result = `${this.error_name}: ${this.details}` + "\n";
    result += `File ${this.pos_start.fn}, line ${this.pos_start.ln + 1}`;
    result += '\n\n' + string_with_arrows(this.pos_start.ftxt, this.pos_start, this.pos_end);
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
  constructor(pos_start, pos_end, details) {
    super(pos_start, pos_end, 'Invalid Syntax', details);
  }
}

module.exports = {
  Error,
  IllegalCharError,
  InvalidSyntaxError
}