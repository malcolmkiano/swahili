/**
 * Prints out lines of code and indicates the position of errors
 * using arrows
 * @param {String} text text to be printed to the terminal
 * @param {Postion} posStart position at which the error occurred
 * @param {Position} posEnd position where the token ends
 * @returns {String}
 */
function stringWithArrows(text, posStart, posEnd) {
  let result = '';

  /** Calculate indices */
  let lastNewLine = text.indexOf('\n', posStart.idx);
  lastNewLine = lastNewLine !== -1 ? lastNewLine + 1 : 0;
  let idxStart = lastNewLine;
  let idxEnd = text.indexOf('\n', idxStart + 1);
  if (idxEnd < 0) idxEnd = text.length;

  /** Generate each line */
  const lineCount = posEnd.lineNumber - posStart.lineNumber + 1;
  for (let i = 0; i < lineCount; i++) {
    /** Calculate line columns */
    const line = text.substr(idxStart, idxEnd);
    let colStart = i === 0 ? Math.max(posStart.colNumber, 0) : 0;
    let colEnd = i === lineCount - 1 ? posEnd.colNumber : line.length;
    if (colStart > colEnd) {
      [colStart, colEnd] = [colEnd, colStart];
    }

    /** Append to result */
    result += line + '\n';
    result += ' '.repeat(colStart) + '^'.repeat(Math.max(colEnd - colStart, 1));

    /** Re-calculate indices */
    idxStart = idxEnd;
    idxEnd = text.indexOf('\n', idxStart + 1);
    if (idxEnd < 0) idxEnd = text.length;
  }

  return result.replace(/\t/g, '');
}

module.exports = stringWithArrows;
