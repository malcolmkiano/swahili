const util = require('util');
const fs = require('fs');
const colors = require('colors');
const prompt = require('prompt-sync')();

const print = require('../utils/print');

const TT = require('../lexer/tokenTypes');

const SWValue = require('./types/value');
const SWNull = require('./types/null');
const SWNumber = require('./types/number');
const SWString = require('./types/string');
const SWBoolean = require('./types/boolean');
const SWList = require('./types/list');
const SWDateTime = require('./types/datetime');

const Lexer = require('../lexer');
const Parser = require('../parser');
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

    let i = startValue.value;

    if (stepValue.value >= 0) {
      condition = () => i < endValue.value;
    } else {
      condition = () => i > endValue.value;
    }

    let calls = 0;

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
    let funcValue = new SWFunction(funcName, bodyNode, argNames)
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

module.exports.Interpreter = Interpreter;

// ================================================================================================
// the code below exists here because of its co-dependent relation with the interpreter class
// ================================================================================================

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
   * @returns {String}
   */
  toString() {
    return colors.cyan(`<shughuli ${this.name}>`);
  }
}

// ============================================

/** Function data type */
class SWFunction extends SWBaseFunction {
  /**
   * instantiates a function
   * @param {String} name name of the function
   * @param {Node} bodyNode node containing the expressions to be run
   * @param {String[]} argNames tokens containing the argument names
   */
  constructor(name, bodyNode, argNames) {
    super(name);
    this.bodyNode = bodyNode;
    this.argNames = argNames;
  }

  /**
   * Executes the function
   * @param {Token[]} args list of token value nodes to be used as function arguments
   */
  execute(args) {
    let res = new RTResult();
    const INT = new Interpreter();
    let executionContext = this.generateNewContext();

    res.register(this.populateArgs(this.argNames, args, executionContext));
    if (res.shouldReturn()) return res;

    res.register(INT.visit(this.bodyNode, executionContext));
    if (res.shouldReturn() && res.funcReturnValue === null) return res;

    let returnValue = res.funcReturnValue;
    return res.success(returnValue || SWNull.NULL);
  }

  /**
   * creates a new instance of the function
   * @returns {SWFunction}
   */
  copy() {
    let copy = new SWFunction(this.name, this.bodyNode, this.argNames);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }
}

// ============================================

/** Built in function data type */
class SWBuiltInFunction extends SWBaseFunction {
  /**
   * instantiates a built in function
   * @param {String} name the name of the built in function
   */
  constructor(name) {
    super(name);
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

    let returnValue = res.register(method(executionContext));
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
   * @returns {String}
   */
  toString() {
    return colors.brightCyan(`<shughuli asili ${this.name}>`);
  }

  // =========================================================
  // BUILT IN FUNCTION EXECUTION
  // =========================================================

  /**
   * Print a value to the screen
   * @param {Context} executionContext the calling context
   */
  execute_andika = (executionContext) => {
    let res = new RTResult();
    let ujumbe = executionContext.symbolTable.get('ujumbe'); // 2 -> the arguments are then accessed from the execution context's symbol table
    if (!ujumbe)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'ujumbe' is required`,
          executionContext
        )
      );

    ujumbe = ujumbe.toString(false);
    print(ujumbe);
    return res.success(SWNull.NULL);
  };
  andika = ['ujumbe']; // 1 -> this contains all the args the built in function requires

  /**
   * Gets input from STDIN
   * @param {Context} executionContext the calling context
   */
  execute_soma = (executionContext) => {
    let res = new RTResult();
    let swali = executionContext.symbolTable.get('swali');
    swali = swali ? swali.toString(false) : '> ';
    let textInput = prompt(swali);
    return res.success(new SWString(textInput || ''));
  };
  soma = ['swali'];

  /**
   * Gets numeric input from STDIN
   * @param {Context} executionContext the calling context
   */
  execute_somaNambari = (executionContext) => {
    let res = new RTResult();
    let swali = executionContext.symbolTable.get('swali');
    swali = swali ? swali.toString(false) : '> ';
    let numInput = 0;
    while (true) {
      numInput = prompt(swali);
      if (isNaN(numInput)) {
        print('Jibu lako si nambari. Jaribu tena.');
      } else {
        break;
      }
    }

    return res.success(new SWNumber(numInput || 0));
  };
  somaNambari = ['swali'];

  /** Clears the terminal */
  execute_futa() {
    let res = new RTResult();
    console.clear();
    return res.success(SWNull.NULL);
  }
  futa = []; // built in functions that don't need args still need this empty array

  // =========================================================
  // TYPE CHECKING
  // =========================================================

  /**
   * Checks if a value is a number
   * @param {Context} executionContext the calling context
   */
  execute_niNambari = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    let isNumber = kitu instanceof SWNumber;
    return res.success(isNumber ? SWBoolean.TRUE : SWBoolean.FALSE);
  };
  niNambari = ['kitu'];

  /**
   * Checks if a value is a string
   * @param {Context} executionContext the calling context
   */
  execute_niJina = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    let isString = kitu instanceof SWString;
    return res.success(isString ? SWBoolean.TRUE : SWBoolean.FALSE);
  };
  niJina = ['kitu'];

  /**
   * Checks if a value is a list
   * @param {Context} executionContext the calling context
   */
  execute_niOrodha = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    let isList = kitu instanceof SWList;
    return res.success(isList ? SWBoolean.TRUE : SWBoolean.FALSE);
  };
  niOrodha = ['kitu'];

  /**
   * Checks if a value is a function
   * @param {Context} executionContext the calling context
   */
  execute_niShughuli = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    let isFunction = kitu instanceof SWBaseFunction;
    return res.success(isFunction ? SWBoolean.TRUE : SWBoolean.FALSE);
  };
  niShughuli = ['kitu'];

  /**
   * Checks if a value is null/empty
   * @param {Context} executionContext the calling context
   */
  execute_niTupu = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    let isNull = !kitu.isTrue();
    return res.success(isNull ? SWBoolean.TRUE : SWBoolean.FALSE);
  };
  niTupu = ['kitu'];

  // =========================================================
  // TYPE CONVERSION
  // =========================================================

  /**
   * Converts a value to a SWNumber
   * @param {Context} executionContext the calling context
   */
  execute_Nambari = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    try {
      if (
        kitu instanceof SWString ||
        kitu instanceof SWNumber ||
        kitu instanceof SWBoolean
      ) {
        return res.success(new SWNumber(Number(kitu.value)));
      } else {
        throw new Error('Illegal conversion');
      }
    } catch (err) {
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Illegal conversion`,
          executionContext
        )
      );
    }
  };
  Nambari = ['kitu'];

  /**
   * Converts a value to a SWString
   * @param {Context} executionContext the calling context
   */
  execute_Jina = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    let value = kitu.toString(false);
    if (kitu instanceof SWBaseFunction) value = kitu.name;

    return res.success(new SWString(value));
  };
  Jina = ['kitu'];

  // =========================================================
  // LIST FUNCTIONS
  // =========================================================

  /**
   * Returns the length of a list/string
   * @param {Context} executionContext the calling context
   */
  execute_idadi = (executionContext) => {
    let res = new RTResult();
    let kitu = executionContext.symbolTable.get('kitu');
    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    if (kitu instanceof SWString || kitu instanceof SWList) {
      return res.success(
        new SWNumber(kitu.elements ? kitu.elements.length : kitu.value.length)
      );
    } else {
      return res.failure(
        new RTError(
          kitu.posStart,
          kitu.posEnd,
          `Cannot find length of non-iterable value`,
          executionContext
        )
      );
    }
  };
  idadi = ['kitu'];

  /**
   * Alters the element at the given index of a list
   * @param {Context} executionContext the calling context
   */
  execute_badili = (executionContext) => {
    let res = new RTResult();
    let orodha = executionContext.symbolTable.get('orodha');
    let pahala = executionContext.symbolTable.get('pahala');
    let kitu = executionContext.symbolTable.get('kitu');

    if (!orodha)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'orodha' is required`,
          executionContext
        )
      );

    if (!pahala)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'pahala' is required`,
          executionContext
        )
      );

    if (!kitu)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'kitu' is required`,
          executionContext
        )
      );

    // check types
    if (!orodha instanceof SWList)
      return res.failure(
        new RTError(
          orodha.posStart,
          orodha.posEnd,
          `First parameter must be a list`,
          executionContext
        )
      );

    if (!pahala instanceof SWNumber || !Number.isInteger(pahala.value))
      return res.failure(
        new RTError(
          pahala.posStart,
          pahala.posEnd,
          `Second param must be an int`,
          executionContext
        )
      );

    // check index in bounds
    if (pahala.value < 0 || pahala.value > orodha.elements.length)
      return res.failure(
        new RTError(
          pahala.posStart,
          pahala.posEnd,
          `Index is out of bounds`,
          executionContext
        )
      );

    // replace value in list
    orodha.elements[pahala.value] = kitu;

    return res.success(kitu);
  };
  badili = ['orodha', 'pahala', 'kitu'];

  // =========================================================
  // DATETIME FUNCTIONS
  // =========================================================

  execute_Tarehe = (executionContext) => {
    let res = new RTResult();
    let tarehe = executionContext.symbolTable.get('tarehe');
    let muundo = executionContext.symbolTable.get('muundo');
    let val = null;
    try {
      if (tarehe instanceof SWString || tarehe instanceof SWDateTime) {
        let dateString = tarehe.value;
        val = new Date(dateString);
        if (val.toString() === 'Invalid Date') throw new Error('Invalid date');
      } else if (tarehe instanceof SWNull) {
        val = new Date();
      } else {
        throw new Error('Invalid date');
      }
    } catch (err) {
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Could not create date`,
          executionContext
        )
      );
    }

    let date = new SWDateTime(val);
    if (muundo instanceof SWString)
      return res.success(new SWString(date.toFormat(muundo)));

    return res.success(date);
  };
  Tarehe = ['tarehe', 'muundo'];

  // =========================================================
  // EASTER EGGS
  // =========================================================

  /**
   * Fun sheng easter egg from a popular song
   * https://www.youtube.com/watch?v=ilnOAwKuZLQ
   */
  execute_wamlambez() {
    let res = new RTResult();
    return res.success(new SWString('Wamnyonyez! '));
  }
  wamlambez = [];

  // =========================================================
  // RUN FILES
  // =========================================================

  /**
   * Runs code from a file
   * @param {Context} executionContext the calling context
   */
  execute_anza = (executionContext) => {
    let res = new RTResult();
    let faili = executionContext.symbolTable.get('faili');
    if (!faili)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Parameter 'faili' is required`,
          executionContext
        )
      );

    let script = '';

    if (faili instanceof SWString !== true) {
      return res.failure(
        new RTError(
          faili.posStart,
          faili.posEnd,
          `Argument must be a string`,
          executionContext
        )
      );
    }

    faili = faili.value;
    try {
      script = fs.readFileSync(faili, 'utf8');
    } catch (err) {
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Failed to load script "${faili}"\n` + err.toString(),
          executionContext
        )
      );
    }

    let [_, error] = run(faili, script, true);
    if (error)
      return res.failure(
        new RTError(
          this.posStart,
          this.posEnd,
          `Failed to finish executing script "${faili}"\n` + error.toString(),
          executionContext
        )
      );

    return new RTResult().success(SWNull.NULL);
  };
  anza = ['faili'];

  // I/O
  static print = new SWBuiltInFunction('andika');
  static input = new SWBuiltInFunction('soma');
  static inputNumber = new SWBuiltInFunction('somaNambari');
  static clear = new SWBuiltInFunction('futa');

  // Type checks
  static isNumber = new SWBuiltInFunction('niNambari');
  static isString = new SWBuiltInFunction('niJina');
  static isList = new SWBuiltInFunction('niOrodha');
  static isFunction = new SWBuiltInFunction('niShughuli');
  static isNull = new SWBuiltInFunction('niTupu');

  // Type conversions
  static parseNum = new SWBuiltInFunction('Nambari');
  static parseStr = new SWBuiltInFunction('Jina');

  // Lists
  static sizeof = new SWBuiltInFunction('idadi');
  static insert = new SWBuiltInFunction('badili');

  // DateTime generation
  static newDate = new SWBuiltInFunction('Tarehe');

  // Run
  static run = new SWBuiltInFunction('anza');

  //easter egg
  static easter = new SWBuiltInFunction('wamlambez');
}

module.exports.SWBuiltInFunction = SWBuiltInFunction;

// =========================================================
// RUN.
// =========================================================

/** holds all variables and their values in the global scope */
const globalSymbolTable = new SymbolTable();

/** instantiate predefined global vars */
globalSymbolTable.setConstant('tupu', SWNull.NULL); // NULL
globalSymbolTable.setConstant('kweli', SWBoolean.TRUE); // TRUE
globalSymbolTable.setConstant('uwongo', SWBoolean.FALSE); // FALSE

/** built in functions */
globalSymbolTable.setConstant('andika', SWBuiltInFunction.print);
globalSymbolTable.setConstant('soma', SWBuiltInFunction.input);
globalSymbolTable.setConstant('somaNambari', SWBuiltInFunction.inputNumber);
globalSymbolTable.setConstant('futa', SWBuiltInFunction.clear);
globalSymbolTable.setConstant('niNambari', SWBuiltInFunction.isNumber);
globalSymbolTable.setConstant('niJina', SWBuiltInFunction.isString);
globalSymbolTable.setConstant('niOrodha', SWBuiltInFunction.isList);
globalSymbolTable.setConstant('niShughuli', SWBuiltInFunction.isFunction);
globalSymbolTable.setConstant('niTupu', SWBuiltInFunction.isNull);
globalSymbolTable.setConstant('Nambari', SWBuiltInFunction.parseNum);
globalSymbolTable.setConstant('Jina', SWBuiltInFunction.parseStr);
globalSymbolTable.setConstant('idadi', SWBuiltInFunction.sizeof);
globalSymbolTable.setConstant('badili', SWBuiltInFunction.insert);
globalSymbolTable.setConstant('Tarehe', SWBuiltInFunction.newDate);
globalSymbolTable.setConstant('anza', SWBuiltInFunction.run);
globalSymbolTable.setConstant('wamlambez', SWBuiltInFunction.easter);

/**
 * Processes a file through the lexer, parser and interpreter
 * @param {String} fileName name of file to be processed
 * @param {String} text content of the file
 * @param {Boolean} temp run the program in a temporary isolated scope if true
 * @returns {[String, Error]}
 */
function run(fileName, text, temp = false) {
  // Generate tokens
  const lexer = new Lexer(fileName, text);
  const [tokens, error] = lexer.makeTokens();
  if (error) return [null, error];
  if (tokens.length === 1) return [null, null];

  // Generate abstract syntax tree
  const parser = new Parser(tokens);
  const ast = parser.parse();
  if (ast.error) return [null, ast.error];

  // Run program
  const intr = new Interpreter();
  const context = new Context('<program>');
  context.symbolTable = temp
    ? new SymbolTable(globalSymbolTable)
    : globalSymbolTable;
  const result = intr.visit(ast.node, context);

  return [result.value, result.error];
}

module.exports.run = run;
