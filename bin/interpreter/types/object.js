const util = require('util');

const SWValue = include('bin/interpreter/types/value');
const SWBoolean = include('bin/interpreter/types/boolean');
const SymbolTable = include('bin/interpreter/symbolTable');

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
    this.name = null;
    this.parent = null;
    this.typeName = 'Kamusi';
  }

  /**
   * adds symbols to an object's symbol table
   * @param {Node[]} symbols nodes containing the properties of the object
   */
  populateSymbols(symbols) {
    for (let { name, value } of symbols) {
      // add a reference to this object in all child functions
      if (value instanceof SWObject) {
        value.name = name;
        value.parent = this.symbolTable.symbols;
        value.symbolTable.setConstant('hii', this);
      }

      this.symbolTable.set(name, value);
    }
  }

  /**
   * returns true
   * @returns {Boolean}
   */
  isTrue() {
    return true;
  }

  /**
   * returns false if instance value is falsy (this is an object, so it will always return false)
   * @returns {SWBoolean}
   */
  notted() {
    return [new SWBoolean(!this.isTrue()).setContext(this.context), null];
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
    copy.name = this.name;
    copy.parent = this.parent;
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
    let elements = { ...this.symbolTable.symbols };
    delete elements['hii']; // prevent endless cycle

    let entries = Object.entries(elements);
    let s = entries.length ? ' ' : ''; // spaces to be shown if object has values
    let output = [];
    for (let [name, value] of entries) {
      output.push(`${name}: ${value.toString()}`);
    }
    return expose ? `{${s}${output.join(', ')}${s}}` : `[SWObject]`;
  }
}

module.exports = SWObject;
