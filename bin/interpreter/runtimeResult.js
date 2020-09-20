/**
 * format for program output and errors (if any)
 */
class RTResult {
  /** instantiate a runtime result */
  constructor() {
    this.context = null;
    this.reset();
  }

  /** resets the RTResult values */
  reset() {
    this.value = null;
    this.error = null;
    this.funcReturnValue = null;
    this.loopShouldContinue = false;
    this.loopShouldBreak = false;
  }

  /**
   * Override values with new RTResult
   * @param {RTRest} res result to be checked for errors
   * @returns {String}
   */
  register(res) {
    this.error = res.error;
    this.funcReturnValue = res.funcReturnValue;
    this.loopShouldContinue = res.loopShouldBreak;
    this.loopShouldBreak = res.loopShouldBreak;
    return res.value;
  }

  /**
   * Overrides value with result from interpreter
   * @param {String} value string result from interpreter
   */
  success(value) {
    this.reset();
    this.value = value;
    return this;
  }

  /**
   * Registers a return value
   * @param {*} value value to be returned
   */
  successReturn(value) {
    this.reset();
    this.funcReturnValue = value;
    return this;
  }

  /**
   * Registers a throw value
   * @param {*} value value to be thrown
   */
  successThrow(value) {
    this.reset();
    this.error = value;
    return this;
  }

  /** Registers a continue result */
  successContinue() {
    this.reset();
    this.loopShouldContinue = true;
    return this;
  }

  /** Registers a break result */
  successBreak() {
    this.reset();
    this.loopShouldBreak = true;
    return this;
  }

  /**
   * Overrides error with one from interpreter
   * @param {Error} error error result from interpreter
   */
  failure(error) {
    this.reset();
    this.error = error;
    return this;
  }

  /** Determines whether to propagate values or not */
  shouldReturn() {
    return (
      this.error ||
      this.funcReturnValue ||
      this.loopShouldContinue ||
      this.loopShouldBreak
    );
  }
}

module.exports = RTResult;
