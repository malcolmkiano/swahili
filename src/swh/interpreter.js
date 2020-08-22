const TT = require('./tokenTypes');
const RTResult = require('./runtimeResult');
const { RTError } = require('./error');

const NUMBER = require('./types/number');

/** Analyzes abstract syntax trees from the parser and executes programs */
class Interpreter {
  constructor() {
    /**
     * The maximum number of calls to a while loop that will run before
     * being forcefully terminated
     */
    this.maxCallStackSize = 10000;
  }

  /**
   * Evaluates an AST node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   */
  visit(node, context) {
    let methodName = `visit${node.constructor.name}`;
    let method = this[methodName] || this.noVisitMethod;
    return method(node, context);
  }

  /**
   * Occurs when no visit method is defined for the current AST node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   */
  noVisitMethod = (node, context) => {
    throw new Error(`No visit${node.constructor.name} method defined`);
  };

  /**
   * Evaluates a number node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitNumberNode = (node, context) => {
    let res = new RTResult();
    return res.success(
      new NUMBER(node.tok.value)
        .setContext(context)
        .setPos(node.posStart, node.posEnd)
    );
  };

  /**
   * Returns a variable value from the associated context's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitVarAccessNode = (node, context) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = context.symbolTable.get(varName);

    if (!value)
      return res.failure(
        new RTError(
          node.posStart,
          node.posEnd,
          `'${varName}' is not defined`,
          context
        )
      );

    value = value.copy().setPos(node.posStart, node.posEnd);
    return res.success(value);
  };

  /**
   * Sets a variable into the associated context's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitVarAssignNode = (node, context) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = res.register(this.visit(node.valueNode, context));
    if (res.error) return res;

    context.symbolTable.set(varName, value);
    return res.success(value);
  };

  /**
   * Evaluates a binary operation node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitBinOpNode = (node, context) => {
    let res = new RTResult();
    let left = res.register(this.visit(node.leftNode, context));
    if (res.error) return res;

    let right = res.register(this.visit(node.rightNode, context));
    if (res.error) return res;

    let result = new NUMBER(0);
    let error = null;

    if (node.opTok.type === TT.PLUS) {
      [result, error] = left.addedTo(right);
    } else if (node.opTok.type === TT.MINUS) {
      [result, error] = left.subbedBy(right);
    } else if (node.opTok.type === TT.MUL) {
      [result, error] = left.multedBy(right);
    } else if (node.opTok.type === TT.DIV) {
      [result, error] = left.divvedBy(right);
    } else if (node.opTok.type === TT.POW) {
      [result, error] = left.powedBy(right);
    } else if (node.opTok.type === TT.EE) {
      [result, error] = left.getComparisonEQ(right);
    } else if (node.opTok.type == TT.NE) {
      [result, error] = left.getComparisonNE(right);
    } else if (node.opTok.type === TT.LT) {
      [result, error] = left.getComparisonLT(right);
    } else if (node.opTok.type === TT.GT) {
      [result, error] = left.getComparisonGT(right);
    } else if (node.opTok.type === TT.LTE) {
      [result, error] = left.getComparisonLTE(right);
    } else if (node.opTok.type === TT.GTE) {
      [result, error] = left.getComparisonGTE(right);
    } else if (node.opTok.type === TT.AND) {
      [result, error] = left.andedBy(right);
    } else if (node.opTok.type === TT.OR) {
      [result, error] = left.oredBy(right);
    }

    if (error) {
      return res.failure(error);
    } else {
      return res.success(result.setPos(node.posStart, node.posEnd));
    }
  };

  /**
   * Evaluates a unary operation node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitUnaryOpNode = (node, context) => {
    let res = new RTResult();
    let number = res.register(this.visit(node.node, context));
    if (res.error) return res;

    let error = null;

    if (node.opTok.type === TT.MINUS) {
      [number, error] = number.multedBy(new NUMBER(-1));
    } else if (node.opTok.type === TT.NOT) {
      [number, error] = number.notted();
    }

    if (error) {
      return res.failure(error);
    } else {
      return res.success(number.setPos(node.posStart, node.posEnd));
    }
  };

  /**
   * Evaluates an if node and returns the value from the case that evaluated to true
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitIfNode = (node, context) => {
    let res = new RTResult();

    for (let [condition, expr] of node.cases) {
      let conditionValue = res.register(this.visit(condition, context));
      if (res.error) return res;

      if (conditionValue.isTrue()) {
        let exprValue = res.register(this.visit(expr, context));
        if (res.error) return res;
        return res.success(exprValue);
      }
    }

    if (node.elseCase) {
      let elseValue = res.register(this.visit(node.elseCase, context));
      if (res.error) return res;
      return res.success(elseValue);
    }

    return res.success(null);
  };

  /**
   * Evaluates a for node and returns the value of the expression while the iterator meets given conditions
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitForNode = (node, context) => {
    let res = new RTResult();
    let stepValue = new NUMBER(1);
    let condition = null;

    let startValue = res.register(this.visit(node.startValueNode, context));
    if (res.error) return res;

    let endValue = res.register(this.visit(node.endValueNode, context));
    if (res.error) return res;

    if (node.stepValueNode) {
      stepValue = res.register(this.visit(node.stepValueNode, context));
    }

    let i = startValue.value;

    if (stepValue.value >= 0) {
      condition = () => i < endValue.value;
    } else {
      condition = () => i > endValue.value;
    }

    let calls = 0;

    while (condition()) {
      context.symbolTable.set(node.varNameTok.value, new NUMBER(i));
      i += stepValue.value;

      res.register(this.visit(node.bodyNode, context));
      if (res.error) return res;

      // prevent infinite loops
      calls++;
      if (calls === this.maxCallStackSize)
        return res.failure(
          new RTError(
            node.posStart,
            node.posEnd,
            `Max call stack size exceeded`,
            context
          )
        );
    }

    return res.success(null);
  };

  /**
   * Evaluates a while node and returns the value of the expression while condition is true
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitWhileNode = (node, context) => {
    let res = new RTResult();
    let calls = 0;

    while (true) {
      let condition = res.register(this.visit(node.conditionNode, context));
      if (res.error) return res;

      if (!condition.isTrue()) break;

      res.register(this.visit(node.bodyNode, context));
      if (res.error) return res;

      // prevent infinite loops
      calls++;
      if (calls === this.maxCallStackSize)
        return res.failure(
          new RTError(
            node.posStart,
            node.posEnd,
            `Max call stack size exceeded`,
            context
          )
        );
    }

    return res.success(null);
  };
}

module.exports = Interpreter;
