const util = require('util');
const colors = require('colors');

const { functions } = require('@lib');

const SWBaseFunction = require('@types/base-function');
const RTResult = require('@int/runtimeResult');

/** Built in function data type */
class SWBuiltInFunction extends SWBaseFunction {
  /**
   * instantiates a built in function
   * @param {String} name the name of the built in function
   */
  constructor(name) {
    super(name);

    // library injection
    for (let { method, args, types = null } of functions) {
      let name = method.name;
      this[`execute_${name}`] = method;
      this[name] = args;
      if (types) this[`${name}_types`] = types;
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
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   */
  noExecuteMethod = (node, context) => {
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
