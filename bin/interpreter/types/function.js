const SWBaseFunction = require('./base-function');
const SWNull = require('./null');
const RTResult = require('../runtimeResult');
const SymbolTable = require('../symbolTable');

/** Function data type */
class SWFunction extends SWBaseFunction {
  /**
   * instantiates a function
   * @param {String} name name of the function
   * @param {Node} bodyNode node containing the expressions to be run
   * @param {String[]} argNames tokens containing the argument names
   * @param {Interpreter} interpreter instance of interpreter to use to execute functions
   */
  constructor(name, bodyNode, argNames, interpreter) {
    super(name);
    this.bodyNode = bodyNode;
    this.argNames = argNames;
    this.interpreter = interpreter;
  }

  /**
   * Executes the function
   * @param {Token[]} args list of token value nodes to be used as function arguments
   */
  execute(args) {
    let res = new RTResult();
    let executionContext = this.generateNewContext();

    res.register(
      this.populateArgs(this.argNames, args, executionContext, true)
    );
    if (res.shouldReturn()) return res;

    res.register(this.interpreter.visit(this.bodyNode, executionContext, this));
    if (res.shouldReturn() && res.funcReturnValue === null) return res;

    let returnValue = res.funcReturnValue;
    return res.success(returnValue || SWNull.NULL);
  }

  /**
   * creates a new instance of the function
   * @returns {SWFunction}
   */
  copy() {
    let copy = new SWFunction(
      this.name,
      this.bodyNode,
      this.argNames,
      this.interpreter
    );
    copy.symbolTable = new SymbolTable();
    copy.symbolTable.symbols = { ...this.symbolTable.symbols };
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }
}

module.exports = SWFunction;
