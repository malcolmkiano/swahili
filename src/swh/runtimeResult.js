class RTResult {
  constructr() {
    this.value = null;
    this.error = null;
  }

  register(res) {
    if (res.error) this.error = res.error;
    return res.value;
  }

  success(value) {
    this.value = value;
    return this;
  }

  failure(error) {
    this.error = error;
    return this;
  }
}

module.exports = RTResult;