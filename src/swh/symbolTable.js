class SymbolTable {
  constructor() {
    this.symbols = {};
    this.parent = null;
  }

  get(name) {
    const value = this.symbols[name] || null;
    if (value === null && this.parent) return this.parent.get(name);

    return value;
  }

  set(name, value) {
    this.symbols[name] = value;
  }

  remove(name) {
    delete this.symbols[name];
  }
}

module.exports = SymbolTable;
