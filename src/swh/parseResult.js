class ParseResult {
  constructor() {
    this.error = null;
    this.node = null;
    this.advanceCount = 0;
  }

  registerAdvancement() {
    this.advanceCount++;
  }

  register(res) {
    this.advanceCount += res.advanceCount;
    if (res.error) this.error = res.error;
    return res.node;
  }

  success(node) {
    this.node = node;
    return this;
  }

  failure = (error) => {
    if (!this.error || this.advanceCount === 0) this.error = error;
    return this;
  };
}

module.exports = ParseResult;
