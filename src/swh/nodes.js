const util = require('util');

class NumberNode {
  constructor(tok) {
    this.tok = tok;
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