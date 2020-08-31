const util = require('util');

const SWValue = require('./value');
const SymbolTable = require('../symbolTable');

/** Object data type */
class SWObject extends SWValue {
  /**
   * instantiates an object
   * @param {Node[]} symbols nodes containing the properties of the object
   */
  constructor(symbols = []) {
    super();
    this.symbolTable = new SymbolTable();
    this.populateSymbols(symbols);
  }

  /**
   * adds symbols to an object's symbol table
   * @param {Node[]} symbols nodes containing the properties of the object
   */
  populateSymbols(symbols) {
    for (let { name, value } of symbols) {
      this.symbolTable.set(name, value);
    }
  }

  /**
   * creates a new instance of the object
   * @returns {SWObject}
   */
  copy() {
    let symbolMap = Object.entries(
      this.symbolTable.symbols
    ).map(([name, value]) => ({ name, value }));
    let copy = new SWObject(symbolMap);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the object class
   * @param {Boolean} expose whether to show a breakdown of the object or not
   * @returns {String}
   */
  toString(expose = true) {
    let elements = this.symbolTable.symbols;
    let output = [];
    for (let [name, value] of Object.entries(elements)) {
      output.push(`${name}: ${value.toString()}`);
    }
    return expose ? `{ ${output.join(', ')} }` : `[SWObject]`;
  }
}

module.exports = SWObject;
