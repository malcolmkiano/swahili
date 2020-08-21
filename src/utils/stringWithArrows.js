/** Prints out lines of code and indicates the position of errors
 * using arrows
 */
function stringWithArrows(text, posStart, posEnd) {
  let result = '';

  /** Calculate indices */
  let idxStart = Math.max(text.lastIndexOf('\n', posStart.idx), 0);
  let idxEnd = text.indexOf('\n', idxStart + 1);
  if (idxEnd < 0) idxEnd = text.length;

  /** Generate each line */
  const lineCount = posEnd.ln - posStart.ln + 1;
  for (let i = 0; i < lineCount; i++) {
    /** Calculate line columns */
    const line = text.substr(idxStart, idxEnd);
    let colStart = i === 0 ? Math.max(posStart.col, 0) : 0;
    let colEnd = i === lineCount - 1 ? line.length : posEnd.col;
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
