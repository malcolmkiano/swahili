const LEX = require('./lexemes');

/**
 * represents the exact line/colNumber/file position for the lexer, parser and interpreter
 */
class Position {
  /**
   * instantiates a position
   * @param {Number} idx index (position) in the text content
   * @param {Number} lineNumber line number
   * @param {Number} colNumber column number
   * @param {String} fileName current file name
   * @param {String} fileText current file text content
   */
  constructor(idx, lineNumber, colNumber, fileName, fileText) {
    this.idx = idx || -1;
    this.lineNumber = lineNumber || 0;
    this.colNumber = colNumber || -1;
    this.fileName = fileName;
    this.fileText = fileText;
  }

  /**
   * moves to the next position in the file
   * @param {Char} currentChar current char in the text content
   * @returns {Position}
   */
  advance(currentChar = null) {
    this.idx++;
    this.colNumber++;

    if (LEX.lineEndings.test(currentChar)) {
      this.lineNumber++;
      this.colNumber = 0;
    }

    return this;
  }

  /**
   * creates a copy of the current position
   * @returns {Position}
   */
  copy() {
    return new Position(
      this.idx,
      this.lineNumber,
      this.colNumber,
      this.fileName,
      this.fileText
    );
  }
}

module.exports = Position;
