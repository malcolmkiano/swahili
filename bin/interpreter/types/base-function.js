const util = require('util');
const colors = require('colors');

const SWList = require('./list');
const SWObject = require('./object');
const SWNull = require('./null');
const RTResult = require('../runtimeResult');
const Context = require('../context');
const SymbolTable = require('../symbolTable');

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
    this.name = name || null;
    this.interpreter = null; // here to hold the instance of the interpreter when available
    this.typeName = 'Shughuli';
  }

  /**
   * creates a new running context for the function
   */
  generateNewContext() {
    let newContext = new Context(this.name, this.context, this.posStart);
    newContext.symbolTable = new SymbolTable(
      newContext.parent ? newContext.parent.symbolTable : null
    );
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
    argNames = argNames || [];
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
    let name = this.name || '<isiyotambuliwa>';
    return format ? colors.cyan(`<shughuli ${name}>`) : name;
  }
}

module.exports = SWBaseFunction;
