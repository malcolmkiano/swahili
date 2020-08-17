function string_with_arrows(text, pos_start, pos_end) {
  let result = '';

  // Calculate indices
  let idx_start = Math.max(text.lastIndexOf('\n', pos_start.idx), 0);
  let idx_end = text.includes('\n') ? text.indexOf('\n', idx_start + 1) : text.length;

  // Generate each line
  const line_count = pos_end.ln - pos_start.ln + 1;
  for (let i = 0; i < line_count; i++) {
    // Calculate line columns
    const line = text.substr(idx_start, idx_end);
    const col_start = i === 0 ? pos_start.col : 0;
    const col_end = i === line_count - 1 ? pos_end.col : line.length - 1;

    // Append to result
    result += line + '\n';
    result += ' '.repeat(col_start) + '^'.repeat(Math.abs(col_end - col_start));

    // Re-calculate indices
    idx_start = idx_end;
    idx_end = text.indexOf('\n', idx_start + 1);
    if (idx_end < 0) idx_end = text.length;
  }

  return result.replace(/\t/g, '');
}

module.exports = string_with_arrows;