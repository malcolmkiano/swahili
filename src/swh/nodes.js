const util = require('util');

class NumberNode {
  constructor(tok) {
    this.tok = tok;

    this.pos_start = this.tok.pos_start;
    this.pos_end = this.tok.pos_end;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return this.tok.toString();
  }
}

class VarAccessNode {
  constructor(var_name_tok) {
    this.var_name_tok = var_name_tok;

    this.pos_start = this.var_name_tok.pos_start;
    this.pos_end = this.var_name_tok.pos_end;
  }
}

class VarAssignNode {
  constructor(var_name_tok, value_node) {
    this.var_name_tok = var_name_tok;
    this.value_node = value_node;

    this.pos_start = this.var_name_tok.pos_start;
    this.pos_end = this.value_node.pos_end;
  }
}

class BinOpNode {
  constructor(left_node, op_tok, right_node) {
    this.left_node = left_node;
    this.op_tok = op_tok;
    this.right_node = right_node;

    this.pos_start = this.left_node.pos_start;
    this.pos_end = this.right_node.pos_end;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return `(${this.left_node}, ${this.op_tok}, ${this.right_node})`;
  }
}

class UnaryOpNode {
  constructor(op_tok, node) {
    this.op_tok = op_tok;
    this.node = node;

    this.pos_start = this.op_tok.pos_start;
    this.pos_end = this.node.pos_end;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return `(${this.op_tok}, ${this.node})`;
  }
}

module.exports = {
  NumberNode,
  VarAccessNode,
  VarAssignNode,
  BinOpNode,
  UnaryOpNode,
};
