const TT = require('./token_types');
const RTResult = require('./runtimeResult');

const NUMBER = require('./types/number');

class Interpreter {
  visit(node, context) {
    let method_name = `visit_${node.constructor.name}`;
    let method = this[method_name] || this.no_visit_method;
    return method(node, context);
  }

  no_visit_method = (node, context) => {
    throw new Error(`No visit_${node.constructor.name} method defined`);
  }

  visit_NumberNode = (node, context) => {
    let res = new RTResult();
    return res.success(
      new NUMBER(node.tok.value)
        .set_context(context)
        .set_pos(node.pos_start, node.pos_end)
    );
  }

  visit_BinOpNode = (node, context) => {
    let res = new RTResult();
    let left = res.register(this.visit(node.left_node, context));
    if (res.error) return res;

    let right = res.register(this.visit(node.right_node, context));
    if (res.error) return res;

    let result = new NUMBER(0);
    let error = null;

    if (node.op_tok.type === TT.PLUS) {
      [result, error] = left.added_to(right);
    } else if (node.op_tok.type === TT.MINUS) {
      [result, error] = left.subbed_by(right);
    } else if (node.op_tok.type === TT.MUL) {
      [result, error] = left.multed_by(right);
    } else if (node.op_tok.type === TT.DIV) {
      [result, error] = left.divved_by(right);
    } else if (node.op_tok.type === TT.POW) {
      [result, error] = left.powed_by(right);
    }

    if (error) {
      return res.failure(error)
    } else {
      return res.success(result.set_pos(node.pos_start, node.pos_end));
    }
  }

  visit_UnaryOpNode = (node, context) => {
    let res = new RTResult();
    let number = res.register(this.visit(node.node, context));
    if (res.error) return res;

    let error = null;

    if (node.op_tok.type === TT.MINUS) {
      [number, error] = number.multed_by(new NUMBER(-1));
    }

    if (error) {
      return res.failure(error);
    } else {
      return res.success(number.set_pos(node.pos_start, node.pos_end));
    }
  }
}

module.exports = Interpreter;