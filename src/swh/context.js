/** keeps track of the program call stack (for traceback) */
class Context {
  constructor(displayName, parent = null, parentEntryPos = null) {
    this.displayName = displayName;
    this.parent = parent;
    this.parentEntryPos = parentEntryPos;
    this.symbolTable = null;
  }
}

module.exports = Context;
