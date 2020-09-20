const TT = require('../lexer/tokenTypes');

const SWValue = require('./types/value');
const SWNull = require('./types/null');
const SWNumber = require('./types/number');
const SWString = require('./types/string');
const SWList = require('./types/list');
const SWBaseFunction = require('./types/base-function');
const SWBuiltInFunction = require('./types/built-in-function');
const SWFunction = require('./types/function');
const SWObject = require('./types/object');

const Context = require('./context');
const SymbolTable = require('./symbolTable');
const RTResult = require('./runtimeResult');
const { RTError, UncaughtException } = require('./error');

/** Analyzes abstract syntax trees from the parser and executes programs */
class Interpreter {
  /** instantiates the interpreter */
  constructor() {
    this.callbackQueue = [];
  }

  /**
   * Evaluates an AST node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   */
  visit(node, context, caller = null) {
    let methodName = `visit${node.constructor.name}`;
    let method = this[methodName] || this.noVisitMethod;
    return method(node, context, caller);
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
   * Evaluates an object node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitObjectNode = (node, context, caller = null) => {
    let res = new RTResult();
    let properties = [];

    for (let propNode of node.propertyNodes) {
      propNode.varNameTok = propNode.nodeChain[0];
      properties.push(res.register(this.visit(propNode, context, caller)));
      if (res.shouldReturn()) return res;
    }

    return res.success(
      new SWObject(properties)
        .setContext(context)
        .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Evaluates a list node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitListNode = (node, context, caller = null) => {
    let res = new RTResult();
    let elements = [];

    for (let elementNode of node.elementNodes) {
      let el = res.register(this.visit(elementNode, context, caller));
      if (Array.isArray(el)) {
        el = el[0];
      }
      if (el) elements.push(el);
      if (res.shouldReturn()) return res;
    }

    return res.success(
      new SWList(elements)
        .setContext(context)
        .setPosition(node.posStart, node.posEnd)
    );
  };

  /**
   * Returns a property value from the associated context's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitPropAccessNode = (node, context, caller = null) => {
    let res = new RTResult();
    let value = null;
    let propChain = [];

    let currentNode = node;
    if (node.parent === null)
      return res.success(this.visitVarAccessNode(node, context, caller));

    while (currentNode.parent !== null) {
      propChain.push(currentNode.varNameTok.value);
      currentNode = currentNode.parent;
    }

    let obj = res.register(
      this.visitVarAccessNode(currentNode, context, caller)
    );
    if (res.shouldReturn()) return res;

    // if not an object, see if any typed methods support this value
    if (!(obj instanceof SWObject)) {
      try {
        if (propChain.length > 1) throw 0;

        let methodName = propChain[0];
        let typeMethod = context.symbolTable.get('$' + methodName); // type methods are hidden with a $ in the global context
        if (!typeMethod) throw 0;

        let supportedTypes = typeMethod[`${methodName}_types`];
        for (let i = 0; i < supportedTypes.length; i++) {
          let type = supportedTypes[i];
          if (obj instanceof type) {
            return res.success([typeMethod, obj]);
          }
        }

        return res.failure(
          new RTError(
            currentNode.posStart,
            currentNode.posEnd,
            `'${methodName}' not supported on type '${obj.typeName}'`,
            context
          )
        );
      } catch (err) {
        return res.failure(
          new RTError(
            currentNode.posStart,
            currentNode.posEnd,
            `'${currentNode.varNameTok.value}' is not an object`,
            context
          )
        );
      }
    }

    let chainLength = propChain.length;
    let props = propChain.reverse();
    for (let propName of props) {
      value = obj.symbolTable.get(propName) || value;
      if (obj.symbolTable.get(propName)) chainLength--;
      if (value instanceof SWObject && !(value instanceof SWFunction))
        obj = value;
    }

    if (chainLength) {
      try {
        let methodName = propChain[chainLength] || propChain[chainLength - 1];
        let typeMethod = context.symbolTable.get('$' + methodName); // type methods are hidden with a $ in the global context
        if (!typeMethod) throw 0;
        if (!value) value = obj;

        let supportedTypes = typeMethod[`${methodName}_types`];
        for (let i = 0; i < supportedTypes.length; i++) {
          let type = supportedTypes[i];
          if (value instanceof type) {
            return res.success([typeMethod, value]);
          }
        }

        return res.failure(
          new RTError(
            currentNode.posStart,
            currentNode.posEnd,
            `'${methodName}' not supported on type '${value.typeName}'`,
            context
          )
        );
      } catch (err) {
        return res.failure(
          new RTError(
            node.posStart,
            node.posEnd,
            `Cannot get property '${propChain[chainLength - 1]}' of undefined`,
            context
          )
        );
      }
    }

    return res.success(value || SWNull.NULL);
  };

  /**
   * Creates a property node for an object's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitPropAssignNode = (node, context, caller = null) => {
    let res = new RTResult();
    let value = res.register(this.visit(node.valueNode, context, caller));

    if (node.varNameTok) {
      let name = node.varNameTok.value;
      if (res.shouldReturn()) return res;
      return res.success({ name, value });
    }

    let currentNode = node.nodeChain[0].value;
    let obj = context.symbolTable.get(currentNode);
    if (!obj) {
      let self = caller.symbolTable.get(currentNode);
      if (self.name) obj = context.symbolTable.get(self.name);
      if (!obj) obj = self;
    }

    let valueNode;

    for (let i = 1; i < node.nodeChain.length; i++) {
      if (valueNode instanceof SWObject) {
        obj = valueNode;
      }

      currentNode = node.nodeChain[i].value;
      valueNode = obj.symbolTable.get(currentNode);
    }

    if (value instanceof SWObject && !(value instanceof SWBuiltInFunction)) {
      if (!value.name) value.name = currentNode;
      if (!(value instanceof SWFunction)) {
        value.parent = obj.symbolTable.symbols;
      }
    }

    obj.symbolTable.set(currentNode, value);
    if (caller) caller.symbolTable.set('hii', obj);
    if (obj.parent) obj.parent[obj.name] = obj;
    return res.success(value);
  };

  /**
   * Returns a variable value from the associated context's symbol table
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitVarAccessNode = (node, context, caller = null) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;

    let value =
      context.symbolTable.get(varName) ||
      (caller ? caller.symbolTable.get(varName) : null);

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
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitVarAssignNode = (node, context, caller = null) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = res.register(this.visit(node.valueNode, context, caller));
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

    if (value instanceof SWObject && !(value instanceof SWBuiltInFunction)) {
      if (!value.name) value.name = varName;
      if (!(value instanceof SWFunction)) {
        value.parent = context.symbolTable.symbols;
      }
    }

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
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitVarDefNode = (node, context, caller = null) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = res.register(this.visit(node.valueNode, context, caller));
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

    if (value instanceof SWObject && !(value instanceof SWBuiltInFunction)) {
      if (!value.name) value.name = varName;
      if (!(value instanceof SWFunction)) {
        value.parent = context.symbolTable.symbols;
      }
    }

    context.symbolTable.set(varName, value);
    return res.success(value);
  };

  /**
   * Evaluates a binary operation node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitBinOpNode = (node, context, caller = null) => {
    let res = new RTResult();
    let left = res.register(this.visit(node.leftNode, context, caller));
    if (res.shouldReturn()) return res;

    let right = res.register(this.visit(node.rightNode, context, caller));
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
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitUnaryOpNode = (node, context, caller = null) => {
    let res = new RTResult();
    let number = res.register(this.visit(node.node, context, caller));
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
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitIfNode = (node, context, caller = null) => {
    let res = new RTResult();
    let originalScope = context.symbolTable;
    context.symbolTable = new SymbolTable(context.symbolTable);

    for (let [condition, expr, shouldReturnNull] of node.cases) {
      let conditionValue = res.register(this.visit(condition, context, caller));
      if (res.shouldReturn()) return res;

      if (conditionValue.isTrue()) {
        let exprValue = res.register(this.visit(expr, context, caller));
        if (res.shouldReturn()) return res;
        return res.success(
          shouldReturnNull ? SWNull.NULL : exprValue.elements[0]
        );
      }
    }

    if (node.elseCase) {
      let [expr, shouldReturnNull] = node.elseCase;
      let elseValue = res.register(this.visit(expr, context, caller));
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
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitForNode = (node, context, caller = null) => {
    let res = new RTResult();
    let elements = [];
    let stepValue = new SWNumber(1);
    let condition = null;

    let startValue = res.register(
      this.visit(node.startValueNode, context, caller)
    );
    if (res.shouldReturn()) return res;

    let endValue = res.register(this.visit(node.endValueNode, context, caller));
    if (res.shouldReturn()) return res;

    if (node.stepValueNode) {
      stepValue = res.register(this.visit(node.stepValueNode, context, caller));
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

      let value = res.register(this.visit(node.bodyNode, context, caller));
      if (res.shouldReturn() && !res.loopShouldContinue && !res.loopShouldBreak)
        return res;

      if (res.loopShouldContinue) continue;
      if (res.loopShouldBreak) break;

      elements.push(value);

      // restore original context
      context.symbolTable = blockScope;
    }

    context.symbolTable = originalScope;

    return res.success(null);
  };

  /**
   * Evaluates a for each node and returns the value of the expression for the number of times in the result
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitForEachNode = (node, context, caller = null) => {
    let res = new RTResult();
    let elements = [];

    let iteratorValue = res.register(
      this.visit(node.iterationNode, context, caller)
    );
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

      let value = res.register(this.visit(node.bodyNode, context, caller));
      if (res.shouldReturn() && !res.loopShouldContinue && !res.loopShouldBreak)
        return res;

      if (res.loopShouldContinue) continue;
      if (res.loopShouldBreak) break;

      elements.push(value);

      // restore original context
      context.symbolTable = blockScope;
    }

    context.symbolTable = originalScope;

    return res.success(null);
  };

  /**
   * Evaluates a while node and returns the value of the expression while condition is true
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitWhileNode = (node, context, caller = null) => {
    let res = new RTResult();
    let elements = [];

    let calls = 0;

    while (true) {
      let condition = res.register(
        this.visit(node.conditionNode, context, caller)
      );
      if (res.shouldReturn()) return res;

      if (!condition.isTrue()) break;

      let value = res.register(this.visit(node.bodyNode, context, caller));
      if (res.shouldReturn() && !res.loopShouldContinue && !res.loopShouldBreak)
        return res;

      if (res.loopShouldContinue) continue;
      if (res.loopShouldBreak) break;

      elements.push(value);
    }

    return res.success(null);
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
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitCallNode = (node, context, caller = null) => {
    let res = new RTResult();
    let args = [];

    let valueToCall = res.register(
      this.visit(node.nodeToCall, context, caller)
    );
    if (res.shouldReturn()) return res;
    if (Array.isArray(valueToCall)) {
      args.push(valueToCall[1]);
      valueToCall = valueToCall[0];
    }

    if (!(valueToCall instanceof SWBaseFunction))
      return res.failure(
        new RTError(
          node.posStart,
          node.posEnd,
          `'${valueToCall}' is not a method`,
          context
        )
      );

    valueToCall = valueToCall
      .copy()
      .setContext(context)
      .setPosition(node.posStart, node.posEnd);

    // add the interpreter to it just in case we need it
    if (!valueToCall.interpreter) valueToCall.interpreter = this;

    for (let argNode of node.argNodes) {
      let val = res.register(this.visit(argNode, context, caller));
      if (Array.isArray(val)) val = val[0];
      args.push(val);
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
   * Evaluates a try catch node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitTryCatchNode = (node, context, caller = null) => {
    let res = new RTResult();
    let err = null;

    const tryContext = new Context('<try>', context, node.posStart);
    tryContext.symbolTable = new SymbolTable(context.symbolTable);

    for (let line of node.tryBodyNode.elementNodes) {
      res.register(this.visit(line, tryContext, caller));
      if (res.shouldReturn()) {
        err = res.error;
        res.reset();
        break;
      }
    }

    if (err) {
      let errVarName = node.errVarNameTok.value;
      tryContext.symbolTable.set(errVarName, new SWString(err.details));

      for (let line of node.catchBodyNode.elementNodes) {
        res.register(this.visit(line, tryContext, caller));
        if (res.shouldReturn()) return res;
      }
    }

    if (node.finallyBodyNode) {
      for (let line of node.finallyBodyNode.elementNodes) {
        res.register(this.visit(line, tryContext, caller));
        if (res.shouldReturn()) return res;
      }
    }

    return res.success(SWNull.NULL);
  };

  /**
   * Evaluates a return node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitReturnNode = (node, context, caller = null) => {
    let res = new RTResult();
    let value = SWNull.NULL;

    if (node.nodeToReturn) {
      value = res.register(this.visit(node.nodeToReturn, context, caller));
      if (res.shouldReturn()) return res;
    }

    if (value instanceof SWFunction && caller)
      value.symbolTable = caller.symbolTable;

    return res.successReturn(value);
  };

  /**
   * Evaluates a throw node
   * @param {Node} node the AST node to visit
   * @param {Context} context the calling context
   * @param {*} caller the calling type
   * @returns {RTResult}
   */
  visitThrowNode = (node, context, caller = null) => {
    let res = new RTResult();
    let value = SWNull.NULL;

    if (node.nodeToThrow) {
      value = res.register(this.visit(node.nodeToThrow, context, caller));
      if (res.shouldReturn()) return res;
    }

    if (value instanceof SWFunction && caller)
      value.symbolTable = caller.symbolTable;

    let err = new UncaughtException(
      node.posStart,
      node.posEnd,
      value.toString(false)
    );

    return res.successThrow(err);
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
