const util = require('util');
const colors = require('colors');

const SWValue = require('./value');
const SWNull = require('./null');
const RTResult = require('../runtimeResult');
const Context = require('../context');
const SymbolTable = require('../symbolTable');

/** Base function type */
class SWBaseFunction extends SWValue {
  /**
   * instantiates a function
   * @param {String} name name of the function
   * @param {Node} bodyNode node containing the expressions to be run
   * @param {String[]} argNames tokens containing the argument names
   */
  constructor(name) {
    super();
    this.name = name || '<isiyotambuliwa>';
  }

  /**
   * creates a new running context for the function
   */
  generateNewContext() {
    let newContext = new Context(this.name, this.context, this.posStart);
    newContext.symbolTable = new SymbolTable(newContext.parent.symbolTable);
    return newContext;
  }

  /**
   * adds all the arguments into the symbol table
   * @param {String[]} argNames list of argument names from function definition
   * @param {Node[]} args list of argument nodes
   * @param {Context} executionContext executing context
   */
  populateArgs(argNames, args, executionContext) {
    let res = new RTResult();
    for (let i = 0; i < argNames.length; i++) {
      let argName = argNames[i];
      let argValue = i < args.length ? args[i] : SWNull.NULL;
      argValue.setContext(executionContext);
      executionContext.symbolTable.set(argName, argValue);
    }

    return res.success(SWNull.NULL);
  }

  /**
   * returns true
   * @returns {Boolean}
   */
  isTrue() {
    return true;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the function class
   * @param {Boolean} format whether to format the name or not
   * @returns {String}
   */
  toString(format = true) {
    return format ? colors.cyan(`<shughuli ${this.name}>`) : this.name;
  }
}

module.exports = SWBaseFunction;