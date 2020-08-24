/**
 * map to hold all variable names and values in the current scope
 * and a pointer to its parent (if any)
 */
class SymbolTable {
  constructor(parent) {
    this.symbols = {};
    this.parent = parent;
  }

  /**
   * accesses and returns the value of a variable
   * @param {String} name variable name to be accessed
   * @param {Boolean} shallow checks parent scope for variable if false
   */
  get(name, shallow = false) {
    const value = this.symbols[name] || null;
    if (!shallow && value === null && this.parent) return this.parent.get(name);

    return value;
  }

  /**
   * assigns a value to a variable (or overrides existing value)
   * @param {String} name variable name to be assigned
   * @param {*} value value to be assigned to the variable
   */
  set(name, value) {
    this.symbols[name] = value;
  }

  /**
   * deletes reference to variable name and value
   * @param {String} name variable name to be deleted
   */
  remove(name) {
    delete this.symbols[name];
  }
}

module.exports = SymbolTable;
