class ParseResult {
  constructr() {
    this.error = null;
    this.node = null;
  }

  register(res) {
    if (res instanceof ParseResult) {
      if (res.error) this.error = res.error;
      return res.node;
    }

    return res;
  }

  success(node) {
    this.node = node;
    return this;
  }

  failure(error) {
    this.error = error;
    return this;
  }
}

module.exports = ParseResult;
