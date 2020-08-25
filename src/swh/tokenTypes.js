/** map of all recognized token types */
module.exports = {
  /** Integer */
  INT: 'INT',

  /** Float */
  FLOAT: 'FLOAT',

  /** String */
  STRING: 'STRING',

  /** Identifier */
  IDENTIFIER: 'IDENTIFIER',

  /** Keyword */
  KEYWORD: 'KEYWORD',

  /** Addition operator */
  PLUS: 'PLUS',

  /** Subtraction operator */
  MINUS: 'MINUS',

  /** Multiplication operator */
  MUL: 'MUL',

  /** Division operator */
  DIV: 'DIV',

  /** Power operator */
  POW: 'POW',

  /** Assignment operator */
  EQ: 'EQ',

  /** Left parentheses */
  LPAREN: 'LPAREN',

  /** Right parentheses */
  RPAREN: 'RPAREN',

  /** Left square bracket */
  LSQUARE: 'LSQUARE',

  /** Right square bracket */
  RSQUARE: 'RSQUARE',

  /** Left curly bracket */
  LCURL: 'LCURL',

  /** Right curly bracket */
  RCURL: 'RCURL',

  /** Double equal comparison */
  EE: 'EE',

  /** Not equal comparison */
  NE: 'NE',

  /** Less than comparison */
  LT: 'LT',

  /** Greater than comparison */
  GT: 'GT',

  /** Less than or equal comparison */
  LTE: 'LTE',

  /** Greater than or equal comparison */
  GTE: 'GTE',

  /** Comma */
  COMMA: 'COMMA',

  /** AND symbol */
  AND: 'AND',

  /** OR symbol */
  OR: 'OR',

  /** NOT symbol */
  NOT: 'NOT',

  /** End of file */
  EOF: 'EOF',

  /** New line */
  NEWLINE: 'NEWLINE',

  /** Not really token types, but capture groups */
  /** Digits 0-9 */
  DIGITS: '0123456789',

  /** Letters A-Z (both cases) */
  LETTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_',

  /** Line endings */
  ENDINGS: '\r\n;',
};
