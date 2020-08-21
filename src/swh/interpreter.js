const TT = require('./tokenTypes');
const RTResult = require('./runtimeResult');
const { RTError } = require('./error');

const NUMBER = require('./types/number');

class Interpreter {
  visit(node, context) {
    let methodName = `visit${node.constructor.name}`;
    let method = this[methodName] || this.noVisitMethod;
    return method(node, context);
  }

  noVisitMethod = (node, context) => {
    throw new Error(`No visit${node.constructor.name} method defined`);
  };

  visitNumberNode = (node, context) => {
    let res = new RTResult();
    return res.success(
      new NUMBER(node.tok.value)
        .setContext(context)
        .setPos(node.posStart, node.posEnd)
    );
  };

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

  visitVarAssignNode = (node, context) => {
    let res = new RTResult();
    let varName = node.varNameTok.value;
    let value = res.register(this.visit(node.valueNode, context));
    if (res.error) return res;

    context.symbolTable.set(varName, value);
    return res.success(value);
  };

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
}

module.exports = Interpreter;
