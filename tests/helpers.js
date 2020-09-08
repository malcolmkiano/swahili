function stripTokenPositions(tokens) {
  let stripped = tokens.map((tok) => {
    delete tok.posStart;
    delete tok.posEnd;
    return tok;
  });
  return stripped;
}

function stripErrorPosition(error) {
  delete error.posStart;
  delete error.posEnd;
  return error;
}

module.exports = {
  stripTokenPositions,
  stripErrorPosition,
};
