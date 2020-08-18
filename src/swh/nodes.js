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
  BinOpNode,
  UnaryOpNode
};