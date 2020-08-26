const stringWithArrows = require('../utils/stringWithArrows');

class Error {
  /**
   * Error representation class
   * @param {Position} posStart the start position of the node where the error occurred
   * @param {Position} posEnd the end positoin of the node where the error occurred
   * @param {String} errorName the type of error
   * @param {String} details More information about the error
   */
  constructor(posStart, posEnd, errorName, details) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    this.errorName = errorName;
    this.details = details;
  }

  /**
   * String representation of the error
   * @returns {String}
   */
  toString() {
    let result = `${this.errorName}: ${this.details}` + '\n';
    result += `File "${this.posStart.fileName}", line ${
      this.posStart.lineNumber + 1
    }`;
    result +=
      '\n\n' +
      stringWithArrows(this.posStart.fileText, this.posStart, this.posEnd);
    return result;
  }
}

class IllegalCharError extends Error {
  /**
   * Occurs when an unrecognized character is encountered by the lexer
   * @param {Position} posStart the start position of the node where the error occurred
   * @param {Position} posEnd the end positoin of the node where the error occurred
   * @param {String} details More information about the error
   */
  constructor(posStart, posEnd, details) {
    super(posStart, posEnd, 'Illegal Character', details);
  }
}

class ExpectedCharError extends Error {
  /**
   * Occurs when an expected character is not found by the lexer
   * @param {Position} posStart the start position of the node where the error occurred
   * @param {Position} posEnd the end positoin of the node where the error occurred
   * @param {String} details More information about the error
   */
  constructor(posStart, posEnd, details = '') {
    super(posStart, posEnd, 'Expected Character', details);
  }
}

class InvalidSyntaxError extends Error {
  /**
   * Occurs when an unrecognized combination of tokens is encountered by the parser
   * @param {Position} posStart the start position of the node where the error occurred
   * @param {Position} posEnd the end positoin of the node where the error occurred
   * @param {String} details More information about the error
   */
  constructor(posStart, posEnd, details = '') {
    super(posStart, posEnd, 'Invalid Syntax', details);
  }
}

/** Runtime error */
class RTError extends Error {
  /**
   * Occurs when something goes wrong while the interpreter visits the different nodes
   * @param {Position} posStart the start position of the node where the error occurred
   * @param {Position} posEnd the end positoin of the node where the error occurred
   * @param {String} details More information about the error
   */
  constructor(posStart, posEnd, details, context) {
    super(posStart, posEnd, 'Runtime Error', details);
    this.context = context;
  }

  /**
   * Generates the call stack leading up to the current RTError
   * @returns {String}
   */
  generateTraceback() {
    let result = '';
    let pos = this.posStart;
    let ctx = this.context;

    while (ctx) {
      result =
        `File "${pos.fileName}", line ${pos.lineNumber + 1}, in ${
          ctx.displayName
        }\n` + result;
      pos = ctx.parentEntryPos;
      ctx = ctx.parent;
    }

    return 'Traceback (most recent call last):\n' + result;
  }

  /**
   * String representation of the error (including traceback)
   * @returns {String}
   */
  toString() {
    let result = this.generateTraceback();
    result += `${this.errorName}: ${this.details}`;
    result +=
      '\n\n' +
      stringWithArrows(this.posStart.fileText, this.posStart, this.posEnd);
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
