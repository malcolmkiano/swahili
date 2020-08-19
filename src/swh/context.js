/** keeps track of the program call stack (for traceback) */
class Context {
  constructor(display_name, parent = null, parent_entry_pos = null) {
    this.display_name = display_name;
    this.parent = parent;
    this.parent_entry_pos = parent_entry_pos;
  }
}

module.exports = Context;
