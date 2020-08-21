const util = require('util');

class NumberNode {
  constructor(tok) {
    this.tok = tok;

    this.posStart = this.tok.posStart;
    this.posEnd = this.tok.posEnd;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return this.tok.toString();
  }
}

class VarAccessNode {
  constructor(varNameTok) {
    this.varNameTok = varNameTok;

    this.posStart = this.varNameTok.posStart;
    this.posEnd = this.varNameTok.posEnd;
  }
}

class VarAssignNode {
  constructor(varNameTok, valueNode) {
    this.varNameTok = varNameTok;
    this.valueNode = valueNode;

    this.posStart = this.varNameTok.posStart;
    this.posEnd = this.valueNode.posEnd;
  }
}

class BinOpNode {
  constructor(leftNode, opTok, rightNode) {
    this.leftNode = leftNode;
    this.opTok = opTok;
    this.rightNode = rightNode;

    this.posStart = this.leftNode.posStart;
    this.posEnd = this.rightNode.posEnd;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return `(${this.leftNode}, ${this.opTok}, ${this.rightNode})`;
  }
}

class UnaryOpNode {
  constructor(opTok, node) {
    this.opTok = opTok;
    this.node = node;

    this.posStart = this.opTok.posStart;
    this.posEnd = this.node.posEnd;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  toString() {
    return `(${this.opTok}, ${this.node})`;
  }
}

class IfNode {
  constructor(cases, elseCase) {
    this.cases = cases;
    this.elseCase = elseCase;

    this.posStart = this.cases[0][0].posStart;
    this.posEnd = (
      this.elseCase || this.cases[this.cases.length - 1][0]
    ).posEnd;
  }
}

module.exports = {
  NumberNode,
  VarAccessNode,
  VarAssignNode,
  BinOpNode,
  UnaryOpNode,
  IfNode,
};
