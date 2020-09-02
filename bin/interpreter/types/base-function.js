const util = require('util');
const colors = require('colors');

const SWList = require('@types/list');
const SWObject = require('@types/object');
const SWNull = require('@types/null');
const RTResult = require('@int/runtimeResult');
const Context = require('@int/context');
const SymbolTable = require('@int/symbolTable');

/** Base function type */
class SWBaseFunction extends SWObject {
  /**
   * instantiates a function
   * @param {String} name name of the function
   * @param {Node} bodyNode node containing the expressions to be run
   * @param {String[]} argNames tokens containing the argument names
   */
  constructor(name) {
    super();
    this.name = name || '<isiyotambuliwa>';
    this.typeName = 'Shughuli';
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
   * @param {Boolean} nullType whether to replace null args with a SWNull value
   */
  populateArgs(argNames, args, executionContext, nullType = false) {
    let res = new RTResult();
    let nullValue = nullType ? SWNull.NULL : null;
    let allArgs = [];
    for (let i = 0; i < argNames.length; i++) {
      let argName = argNames[i];
      let argValue = i < args.length ? args[i] : nullValue;
      if (argValue) {
        argValue.setContext(executionContext);
        executionContext.symbolTable.set(argName, argValue);
        this.symbolTable.set(argName, argValue);
        if (args[i]) allArgs.push(argValue);
      }
    }

    // add all given args to the allArgs list
    for (let i = allArgs.length; i < args.length; i++) {
      let argValue = i < args.length ? args[i] : null;
      if (argValue) {
        allArgs.push(argValue);
      }
    }

    // pass the list in a hidden param
    let __hoja = new SWList(allArgs);
    executionContext.symbolTable.set('__hoja', __hoja);
    this.symbolTable.set('__hoja', __hoja);

    return res.success(SWNull.NULL);
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
