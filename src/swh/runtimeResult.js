/**
 * format for program output and errors (if any)
 */
class RTResult {
  constructor() {
    this.value = null;
    this.error = null;
  }

  /**
   * Override values with new RTResult
   * @param {RTRest} res result to be checked for errors
   * @returns {String}
   */
  register(res) {
    if (res.error) this.error = res.error;
    return res.value;
  }

  /**
   * Overrides value with result from interpreter
   * @param {String} value string result from interpreter
   */
  success(value) {
    this.value = value;
    return this;
  }

  /**
   * Overrides error with one from interpreter
   * @param {Error} error error result from interpreter
   */
  failure(error) {
    this.error = error;
    return this;
  }
}

module.exports = RTResult;
