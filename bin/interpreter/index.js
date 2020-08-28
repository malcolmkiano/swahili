const TT = require('../lexer/tokenTypes');

const SWValue = require('./types/value');
const SWNull = require('./types/null');
const SWNumber = require('./types/number');
const SWString = require('./types/string');
const SWList = require('./types/list');
const SWFunction = require('./types/function');

const Context = require('./context');
const SymbolTable = require('./symbolTable');
const RTResult = require('./runtimeResult');
const { RTError } = require('./error');

/** Analyzes abstract syntax trees from the parser and executes programs */
class Interpreter {
  constructor() {
    /**
     * The maximum number of calls to a while loop that will run before
     * being forcefully terminated
     */
    this.maxCallStackSize = 100000;
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
      new SWNumber(node.tok.value)
        .setContext(context)
        .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Evaluates a string node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitStringNode = (node, context) => {
    let res = new RTResult();
    return res.success(
      new SWString(node.tok.value)
        .setContext(context)
        .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Evaluates a list node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitListNode = (node, context) => {
    let res = new RTResult();
    let elements = [];

    for (let elementNode of node.elementNodes) {
      elements.push(res.register(this.visit(elementNode, context)));
      if (res.shouldReturn()) return res;
    }

    return res.success(
      new SWList(elements)
        .setContext(context)
        .setPosition(node.posStart, node.posEnd)
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

    value = value
      .copy()
      .setPosition(node.posStart, node.posEnd)
      .setContext(context);
    return res.success(value);
  };

  /**
   * Updates a variable into the associated context's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitVarAssignNode = (node, context) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = res.register(this.visit(node.valueNode, context));
    if (res.shouldReturn()) return res;

    if (!context.symbolTable.get(varName))
      return res.failure(
        new RTError(
          node.posStart,
          node.posEnd,
          `'${varName}' is not defined`,
          context
        )
      );

    let isSet = context.symbolTable.set(varName, value, true);
    if (!isSet)
      return res.failure(
        new RTError(
          node.posStart,
          node.posEnd,
          `Cannot change value of constant '${varName}'`,
          context
        )
      );

    return res.success(value);
  };

  /**
   * Creates a variable into the associated context's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitVarDefNode = (node, context) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = res.register(this.visit(node.valueNode, context));
    if (res.shouldReturn()) return res;

    if (context.symbolTable.get(varName, true))
      return res.failure(
        new RTError(
          node.posStart,
          node.posEnd,
          `Cannot re-declare '${varName}'`,
          context
        )
      );

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
    if (res.shouldReturn()) return res;

    let right = res.register(this.visit(node.rightNode, context));
    if (res.shouldReturn()) return res;

    let result = new SWValue();
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
    } else if (node.opTok.type === TT.MOD) {
      [result, error] = left.moddedBy(right);
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
      return res.success(result.setPosition(node.posStart, node.posEnd));
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
    if (res.shouldReturn()) return res;

    let error = null;

    if (node.opTok.type === TT.MINUS) {
      [number, error] = number.multedBy(new SWNumber(-1));
    } else if (node.opTok.type === TT.NOT) {
      [number, error] = number.notted();
    }

    if (error) {
      return res.failure(error);
    } else {
      return res.success(number.setPosition(node.posStart, node.posEnd));
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
    let originalScope = context.symbolTable;
    context.symbolTable = new SymbolTable(context.symbolTable);

    for (let [condition, expr, shouldReturnNull] of node.cases) {
      let conditionValue = res.register(this.visit(condition, context));
      if (res.shouldReturn()) return res;

      if (conditionValue.isTrue()) {
        let exprValue = res.register(this.visit(expr, context));
        if (res.shouldReturn()) return res;
        return res.success(
          shouldReturnNull ? SWNull.NULL : exprValue.elements[0]
        );
      }
    }

    if (node.elseCase) {
      let [expr, shouldReturnNull] = node.elseCase;
      let elseValue = res.register(this.visit(expr, context));
      if (res.shouldReturn()) return res;
      return res.success(
        shouldReturnNull ? SWNull.NULL : elseValue.elements[0]
      );
    }

    context.symbolTable = originalScope;

    return res.success(SWNull.NULL);
  };

  /**
   * Evaluates a for node and returns the value of the expression while the iterator meets given conditions
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitForNode = (node, context) => {
    let res = new RTResult();
    let elements = [];
    let stepValue = new SWNumber(1);
    let condition = null;

    let startValue = res.register(this.visit(node.startValueNode, context));
    if (res.shouldReturn()) return res;

    let endValue = res.register(this.visit(node.endValueNode, context));
    if (res.shouldReturn()) return res;

    if (node.stepValueNode) {
      stepValue = res.register(this.visit(node.stepValueNode, context));
    }

    let calls = 0;
    let i = startValue.value;

    condition =
      stepValue.value >= 0
        ? () => i < endValue.value
        : () => i > endValue.value;

    let originalScope = context.symbolTable;
    let blockScope = new SymbolTable(context.symbolTable);
    context.symbolTable = blockScope;
    context.symbolTable.set(node.varNameTok.value, new SWNumber(i));

    while (condition()) {
      context.symbolTable = new SymbolTable(context.symbolTable);
      context.symbolTable.set(node.varNameTok.value, new SWNumber(i), true);
      i += stepValue.value;

      let value = res.register(this.visit(node.bodyNode, context));
      if (res.shouldReturn() && !res.loopShouldContinue && !res.loopShouldBreak)
        return res;

      if (res.loopShouldContinue) continue;
      if (res.loopShouldBreak) break;

      elements.push(value);

      // restore original context
      context.symbolTable = blockScope;

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

    context.symbolTable = originalScope;

    return res.success(
      node.shouldReturnNull
        ? SWNull.NULL
        : new SWList(elements)
            .setContext(context)
            .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Evaluates a for each node and returns the value of the expression for the number of times in the result
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitForEachNode = (node, context) => {
    let res = new RTResult();
    let elements = [];

    let iteratorValue = res.register(this.visit(node.iterationNode, context));
    if (res.shouldReturn()) return res;

    if (!iteratorValue instanceof SWList && !iteratorValue instanceof SWString)
      return res.failure(
        new RTError(
          node.iteratorValue.posStart,
          node.iteratorValue.posEnd,
          `Cannot iterate over non-iterable '${iteratorValue.toString(false)}'`,
          context
        )
      );

    let iterable = iteratorValue.value
      ? iteratorValue.value.split('').map((s) => new SWString(s))
      : iteratorValue.elements;

    if (!iterable)
      return res.failure(
        new RTError(
          node.iteratorValue.posStart,
          node.iteratorValue.posEnd,
          `Cannot iterate over non-iterable '${iteratorValue.toString(false)}'`,
          context
        )
      );

    let originalScope = context.symbolTable;
    let blockScope = new SymbolTable(context.symbolTable);
    context.symbolTable = blockScope;
    context.symbolTable.set(node.varNameTok.value, iterable[0]);

    for (let i = 0; i < iterable.length; i++) {
      context.symbolTable = new SymbolTable(context.symbolTable);
      context.symbolTable.set(node.varNameTok.value, iterable[i], true);

      let value = res.register(this.visit(node.bodyNode, context));
      if (res.shouldReturn() && !res.loopShouldContinue && !res.loopShouldBreak)
        return res;

      if (res.loopShouldContinue) continue;
      if (res.loopShouldBreak) break;

      elements.push(value);

      // restore original context
      context.symbolTable = blockScope;
    }

    context.symbolTable = originalScope;

    return res.success(
      node.shouldReturnNull
        ? SWNull.NULL
        : new SWList(elements)
            .setContext(context)
            .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Evaluates a while node and returns the value of the expression while condition is true
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitWhileNode = (node, context) => {
    let res = new RTResult();
    let elements = [];

    let calls = 0;

    while (true) {
      let condition = res.register(this.visit(node.conditionNode, context));
      if (res.shouldReturn()) return res;

      if (!condition.isTrue()) break;

      let value = res.register(this.visit(node.bodyNode, context));
      if (res.shouldReturn() && !res.loopShouldContinue && !res.loopShouldBreak)
        return res;

      if (res.loopShouldContinue) continue;
      if (res.loopShouldBreak) break;

      elements.push(value);

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

    return res.success(
      node.shouldReturnNull
        ? SWNull.NULL
        : new SWList(elements)
            .setContext(context)
            .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Evaluates a function definition node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitFuncDefNode = (node, context) => {
    let res = new RTResult();
    let funcName = node.varNameTok ? node.varNameTok.value : null;
    let bodyNode = node.bodyNode;
    let argNames = node.argNameToks.map((argName) => argName.value);
    let funcValue = new SWFunction(funcName, bodyNode, argNames, this)
      .setContext(context)
      .setPosition(node.posStart, node.posEnd);

    if (node.varNameTok) {
      if (context.symbolTable.get(funcName, true))
        return res.failure(
          new RTError(
            node.posStart,
            node.posEnd,
            `Cannot re-declare '${funcName}'`,
            context
          )
        );

      let isSet = context.symbolTable.set(funcName, funcValue);
      if (!isSet)
        return res.failure(
          new RTError(
            node.posStart,
            node.posEnd,
            `Cannot change value of constant '${funcName}'`,
            context
          )
        );
    }

    return res.success(funcValue);
  };

  /**
   * Evaluates a function call node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitCallNode = (node, context) => {
    let res = new RTResult();
    let args = [];

    let valueToCall = res.register(this.visit(node.nodeToCall, context));
    if (res.shouldReturn()) return res;
    valueToCall = valueToCall.copy().setPosition(node.posStart, node.posEnd);

    for (let argNode of node.argNodes) {
      args.push(res.register(this.visit(argNode, context)));
      if (res.shouldReturn()) return res;
    }

    let returnValue = res.register(valueToCall.execute(args));
    if (res.shouldReturn()) return res;

    if (returnValue)
      returnValue = returnValue
        .copy()
        .setPosition(node.posStart, node.posEnd)
        .setContext(context);
    return res.success(returnValue);
  };

  /**
   * Evaluates a return node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitReturnNode = (node, context) => {
    let res = new RTResult();
    let value = SWNull.NULL;

    if (node.nodeToReturn) {
      value = res.register(this.visit(node.nodeToReturn, context));
      if (res.shouldReturn()) return res;
    }

    return res.successReturn(value);
  };

  /**
   * Evaluates a continue node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitContinueNode = (node, context) => {
    return new RTResult().successContinue();
  };

  /**
   * Evaluates a break node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @returns {RTResult}
   */
  visitBreakNode = (node, context) => {
    return new RTResult().successBreak();
  };
}

module.exports = Interpreter;
