const util = require('util');
const colors = require('colors');

const SWValue = require('./value');
const SWBoolean = require('./boolean');
const SymbolTable = require('../symbolTable');

/** Package data type */
class SWPackage extends SWValue {
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
    this.typeName = 'Pkg';
  }

  /**
   * adds symbols to an object's symbol table
   * @param {Node[]} symbols nodes containing the properties of the object
   */
  populateSymbols(symbols) {
    for (let { name, value } of symbols) {
      // add a reference to this object in all child functions
      if (value instanceof SWPackage) {
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
   * @returns {SWPackage}
   */
  copy() {
    let symbolMap = Object.entries(
      this.symbolTable.symbols
    ).map(([name, value]) => ({ name, value }));
    let copy = new SWPackage(symbolMap);
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
   * string representation of the package class
   * @param {Boolean} format whether to format the name or not
   * @returns {String}
   */
  toString(format = true) {
    return format
      ? colors.brightCyan(`<pkg: @swahili/${this.name}>`)
      : this.name;
  }
}

module.exports = SWPackage;
