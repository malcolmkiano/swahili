const stringWithArrows = require('../utils/stringWithArrows');

class Error {
  constructor(posStart, posEnd, errorName, details) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.errorName = errorName;
    this.details = details;
  }

  toString() {
    let result = `${this.errorName}: ${this.details}` + '\n';
    result += `File ${this.posStart.fn}, line ${this.posStart.ln + 1}`;
    result +=
      '\n\n' + stringWithArrows(this.posStart.ftxt, this.posStart, this.posEnd);
    return result;
  }
}

// Error Types
class IllegalCharError extends Error {
  constructor(posStart, posEnd, details) {
    super(posStart, posEnd, 'Illegal Character', details);
  }
}

class ExpectedCharError extends Error {
  constructor(posStart, posEnd, details = '') {
    super(posStart, posEnd, 'Expected Character', details);
  }
}

class InvalidSyntaxError extends Error {
  constructor(posStart, posEnd, details = '') {
    super(posStart, posEnd, 'Invalid Syntax', details);
  }
}

/** Runtime error */
class RTError extends Error {
  constructor(posStart, posEnd, details, context) {
    super(posStart, posEnd, 'Runtime Error', details);
    this.context = context;
  }

  generateTraceback() {
    let result = '';
    let pos = this.posStart;
    let ctx = this.context;

    while (ctx) {
      result =
        `File ${pos.fn}, line ${pos.ln + 1}, in ${ctx.displayName}` +
        '\n' +
        result;
      pos = ctx.parentEntryPos;
      ctx = ctx.parent;
    }

    return 'Traceback (most recent call last):\n' + result;
  }

  toString() {
    let result = this.generateTraceback();
    result += `${this.errorName}: ${this.details}`;
    result +=
      '\n\n' + stringWithArrows(this.posStart.ftxt, this.posStart, this.posEnd);
    return result;
  }
}

module.exports = {
  Error,
  IllegalCharError,
  ExpectedCharError,
  InvalidSyntaxError,
  RTError,
};
