/**
 * represents the exact line/col/file position for the lexer, parser and interpreter
 */
class Position {
  /**
   * instantiates a position
   * @param {Number} idx index (position) in the text content
   * @param {Number} ln line number
   * @param {Number} col column number
   * @param {String} fileName current file name
   * @param {String} fileText current file text content
   */
  constructor(idx, ln, col, fileName, fileText) {
    this.idx = idx || -1;
    this.ln = ln || 0;
    this.col = col || -1;
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
    this.col++;

    if (currentChar === '\n') {
      this.ln++;
      this.col = 0;
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
      this.ln,
      this.col,
      this.fileName,
      this.fileText
    );
  }
}

module.exports = Position;
