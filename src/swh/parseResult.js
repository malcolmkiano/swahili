class ParseResult {
  constructor() {
    this.error = null;
    this.node = null;
    this.lastRegisteredAdvanceCount = 0;
    this.advanceCount = 0;
    this.toReverseCount = 0;
  }

  /**
   * log that the parser advanced to the next token
   */
  registerAdvancement() {
    this.advanceCount++;
  }

  /**
   * extracts a node from a successful ParseResult or returns its associated error
   * @param {ParseResult} res parsed {node, error} to process
   * @returns {Node}
   */
  register(res) {
    this.lastRegisteredAdvanceCount = res.advanceCount;
    this.advanceCount += res.advanceCount;
    if (res.error) this.error = res.error;
    return res.node;
  }

  /**
   * attempts to extract a node from a successful ParseResult or returns its associated error
   * @param {ParseResult} res parsed {node, error} to process
   * @returns {Node}
   */
  tryRegister(res) {
    if (res.error) {
      this.toReverseCount = res.advanceCount;
      return null;
    }
    return this.register(res);
  }

  /**
   * adds a successful parsed node to the ParseResult
   * @param {Node} node successfully evaluated parsed node
   * @returns {ParseResult}
   */
  success(node) {
    this.node = node;
    return this;
  }

  /**
   * adds a failed parsed node to the ParseResult
   * @param {Error} error unsuccessfully evaluated parsed node error message
   * @returns {ParseResult}
   */
  failure = (error) => {
    if (!this.error || this.advanceCount === 0) this.error = error;
    return this;
  };
}

module.exports = ParseResult;
