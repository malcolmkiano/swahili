const util = require('util');
const colors = require('colors');

const Context = require('../context');
const SymbolTable = require('../symbolTable');
const SWNull = require('./null');
const SWList = require('./list');
const SWValue = require('./value');
const RTResult = require('../runtimeResult');

/** Executable data type */
class SWExecutable extends SWValue {
  /**
   * instantiates a built in function
   * @param {String} name the name of the built in function
   */
  constructor(name) {
    super();
    this.name = name || null;
    this.symbolTable = new SymbolTable();
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
    args = args || [];
    for (let argName of argNames) {
      let argValue = i < args.length ? args[i] : nullValue;
      if (!argValue) continue;

      argValue.setContext(executionContext);
      executionContext.symbolTable.set(argName, argValue);
      this.symbolTable.set(argName, argValue);
      if (args[i]) allArgs.push(argValue);
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

  /**
   * Executes the function
   * @param {Token[]} args list of token value nodes to be used as function arguments
   */
  execute(args) {
    let res = new RTResult();
    let executionContext = this.generateNewContext();

    let method = this[this.name] || this.noExecuteMethod;
    let argNames = this.args;

    res.register(this.populateArgs(argNames, args, executionContext));
    if (res.shouldReturn()) return res;

    let returnValue = res.register(method(this, executionContext));
    if (res.shouldReturn()) return res;
    return res.success(returnValue);
  }

  /**
   * Occurs when no execution method is defined for the built in function
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   */
  noExecuteMethod = (node, context) => {
    throw new Error(`No ${node.constructor.name} method defined`);
  };

  /**
   * creates a new instance of the function
   * @returns {SWExecutable}
   */
  copy() {
    let copy = new SWExecutable(this.name);
    copy.args = this.args;
    copy.name = this.name;
    copy.types = this.types;
    copy[this.name] = this[this.name];
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
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
    return format
      ? colors.brightCyan(`<shughuli asili ${this.name}>`)
      : this.name;
  }
}

module.exports = SWExecutable;
