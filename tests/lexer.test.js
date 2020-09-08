const Lexer = require('../bin/lexer');
const Token = require('../bin/lexer/token');
const TT = require('../bin/lexer/tokenTypes');
const { IllegalCharError } = require('../bin/interpreter/error');

const { stripTokenPositions, stripErrorPosition } = require('./helpers');

describe('Lexer', () => {
  const fileName = 'test';

  it('Generates tokens for valid characters', () => {
    const lex = new Lexer(fileName, 'wacha jibu = 1');
    let [tokens, error] = lex.makeTokens();
    let result = stripTokenPositions(tokens);

    let expectedTokens = [
      new Token(TT.KEYWORD, 'wacha'),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.EQ),
      new Token(TT.INT, 1),
      new Token(TT.EOF),
    ];

    expect(result).toStrictEqual(expectedTokens);
    expect(error).toBeNull();
  });

  it('Returns only an EOF when given an empty file', () => {
    const lex = new Lexer(fileName, '');
    let [tokens, error] = lex.makeTokens();
    let result = stripTokenPositions(tokens);

    let expectedTokens = [new Token(TT.EOF)];

    expect(result).toStrictEqual(expectedTokens);
    expect(error).toBeNull();
  });

  it('Handles unusually large files', () => {
    const testToken = 'a'.repeat(1000000);
    const lex = new Lexer(fileName, testToken);
    let [tokens, error] = lex.makeTokens();
    let result = stripTokenPositions(tokens);

    let expectedTokens = [
      new Token(TT.IDENTIFIER, testToken),
      new Token(TT.EOF),
    ];

    expect(result).toStrictEqual(expectedTokens);
    expect(error).toBeNull();
  });

  it.each([
    ['Windows', '\r\n'],
    ['Darwin', '\n'],
  ])('Handles line endings correctly on %s', (platform, endings) => {
    const lex = new Lexer(fileName, `wacha jibu = 1${endings}jibu = jibu + 1`);
    let [tokens, error] = lex.makeTokens();
    let result = stripTokenPositions(tokens);

    let expectedTokens = [
      new Token(TT.KEYWORD, 'wacha'),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.EQ),
      new Token(TT.INT, 1),
      new Token(TT.NEWLINE),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.EQ),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.PLUS),
      new Token(TT.INT, 1),
      new Token(TT.EOF),
    ];

    expect(result).toStrictEqual(expectedTokens);
    expect(error).toBeNull();
  });

  it('Allows semi-colons as newline char in <stdin>', () => {
    const lex = new Lexer('<stdin>', 'wacha jibu = 1; jibu = jibu + 1');
    let [tokens, error] = lex.makeTokens();
    let result = stripTokenPositions(tokens);

    let expectedTokens = [
      new Token(TT.KEYWORD, 'wacha'),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.EQ),
      new Token(TT.INT, 1),
      new Token(TT.NEWLINE),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.EQ),
      new Token(TT.IDENTIFIER, 'jibu'),
      new Token(TT.PLUS),
      new Token(TT.INT, 1),
      new Token(TT.EOF),
    ];

    expect(result).toStrictEqual(expectedTokens);
    expect(error).toBeNull();
  });

  it('Disallows semi-colons in any other input context', () => {
    const lex = new Lexer(fileName, 'wacha jibu = 1; jibu = jibu + 1');
    let startPos = lex.pos.copy();
    let [result, error] = lex.makeTokens();
    let expectedError = new IllegalCharError(startPos, lex.pos, `';'`);

    error = stripErrorPosition(error);
    expectedError = stripErrorPosition(expectedError);

    expect(result).toStrictEqual([]);
    expect(error).toStrictEqual(expectedError);
  });

  it('Returns an illegal character error for invalid characters', () => {
    const lex = new Lexer(fileName, 'wacha $jibu = 1');
    let startPos = lex.pos.copy();
    let [result, error] = lex.makeTokens();
    let expectedError = new IllegalCharError(startPos, lex.pos, `'$'`);

    error = stripErrorPosition(error);
    expectedError = stripErrorPosition(expectedError);

    expect(result).toStrictEqual([]);
    expect(error).toStrictEqual(expectedError);
  });
});
