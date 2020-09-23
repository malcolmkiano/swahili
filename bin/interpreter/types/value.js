const RTResult = require('../runtimeResult');
const { RTError } = require('../error');

/**  Value base type */
class SWValue {
  constructor() {
    this.setPosition();
    this.setContext();
    this.typeName = 'Kitu';
  }

  /**
   * Sets the position at which the value node occurs in the file/line
   * @param {Position} posStart the starting position of the value node
   * @param {Position} posEnd the ending position of the value node
   * @returns {SWValue}
   */
  setPosition(posStart = null, posEnd = null) {
    this.posStart = posStart;
    this.posEnd = posEnd;
    return this;
  }

  /**
   * Sets the context in which the value node occurs
   * @param {Context} context the calling context
   * @returns {SWValue}
   */
  setContext(context = null) {
    if (!this.context) this.defContext = context;
    this.context = context;
    return this;
  }

  /**
   * not supported on this data type
   */
  addedTo(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  subbedBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  multedBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  divvedBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  powedBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  moddedBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  getComparisonEQ(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  getComparisonNE(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  getComparisonLT(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  getComparisonGT(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  getComparisonLTE(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  getComparisonGTE(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  andedBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  oredBy(other) {
    return [null, this.illegalOperation(other)];
  }

  /**
   * not supported on this data type
   */
  notted() {
    return [null, this.illegalOperation(this)];
  }

  /**
   * not supported on this data type
   */
  toFormat(formatNode) {
    return [null, this.illegalOperation(formatNode)];
  }

  /**
   * not supported on this data type
   */
  execute(args) {
    return new RTResult().failure(this.illegalOperation());
  }

  /**
   * not supported on this data type
   */
  copy() {
    throw new Error('No copy method defined');
  }

  /**
   * not supported on this data type
   */
  isTrue() {
    return false;
  }

  /**
   * Unsupported operation error
   */
  illegalOperation(other = null) {
    if (!other) other = this;
    return new RTError(
      this.posStart,
      other.posEnd,
      `Illegal operation`,
      this.context
    );
  }
}

module.exports = SWValue;
