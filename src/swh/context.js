/** keeps track of the program call stack (for traceback) */
class Context {
  /**
   * instantiates a context
   * @param {String} displayName name of the context
   * @param {Context} parent calling context
   * @param {Position} parentEntryPos position of the calling context in the file/line
   */
  constructor(displayName, parent = null, parentEntryPos = null) {
    this.displayName = displayName;
    this.parent = parent;
    this.parentEntryPos = parentEntryPos;
    this.symbolTable = null;
  }
}

module.exports = Context;
