class Position {
  constructor(idx, ln, col, fileName, fileText) {
    this.idx = idx || -1;
    this.ln = ln || 0;
    this.col = col || -1;
    this.fileName = fileName;
    this.fileText = fileText;
  }

  advance(currentChar = null) {
    this.idx++;
    this.col++;

    if (currentChar === '\n') {
      this.ln++;
      this.col = 0;
    }

    return this;
  }

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
