const util = require('util');
const colors = require('colors');

const LibFunctions = require('../lib');

const SWNull = require('./null');
const SWNumber = require('./number');
const SWString = require('./string');
const SWBoolean = require('./boolean');
const SWList = require('./list');

const SWBaseFunction = require('./base-function');
const SWDateTime = require('./datetime');
const RTResult = require('../runtimeResult');

/** Built in function data type */
class SWBuiltInFunction extends SWBaseFunction {
  /**
   * instantiates a built in function
   * @param {String} name the name of the built in function
   */
  constructor(name) {
    super(name);

    // library injection
    for (let { method, args } of LibFunctions) {
      let fn = method.name;
      this[`execute_${fn}`] = method;
      this[fn] = args;
    }
  }

  /**
   * Executes the function
   * @param {Token[]} args list of token value nodes to be used as function arguments
   */
  execute(args) {
    let res = new RTResult();
    let executionContext = this.generateNewContext();

    let methodName = `execute_${this.name}`;
    let method = this[methodName] || this.noExecuteMethod;
    let argNames = this[this.name];

    res.register(this.populateArgs(argNames, args, executionContext));
    if (res.shouldReturn()) return res;

    let returnValue = res.register(method(this, executionContext));
    if (res.shouldReturn()) return res;
    return res.success(returnValue);
  }

  /**
   * Occurs when no execution method is defined for the built in function
   * @param {Context} context the calling context
   */
  noExecuteMethod = (context) => {
    throw new Error(`No execute_${node.constructor.name} method defined`);
  };

  /**
   * creates a new instance of the function
   * @returns {SWBuiltInFunction}
   */
  copy() {
    let copy = new SWBuiltInFunction(this.name);
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

module.exports = SWBuiltInFunction;
