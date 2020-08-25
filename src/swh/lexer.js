const TT = require('./tokenTypes');
const LEX = require('./lexemes');
const KEYWORDS = require('./keywords');

const Token = require('./token');
const Position = require('./position');
const { IllegalCharError, ExpectedCharError } = require('./error');

/**
 * Performs a lexical analysis to ensure correct syntax of the programming language
 */
class Lexer {
  /**
   * Instantiates a lexer
   * @param {String} fileName The name of the file the lexer is running in
   * @param {String} text The content/text to be tokenized
   */
  constructor(fileName, text) {
    this.fileName = fileName;
    this.text = text.replace(/\r?\n/g, ';');
    this.pos = new Position(-1, 0, -1, fileName, text);
    this.currentChar = null;
    this.advance();
  }

  /**
   * advances to the next character in the text
   */
  advance() {
    this.pos.advance(this.currentChar);
    this.currentChar =
      this.pos.idx < this.text.length ? this.text[this.pos.idx] : null;
  }

  /**
   * generates a number token after encountering a digit in the text
   * @returns {Token}
   */
  makeNumber() {
    let numStr = '';
    let dotCount = 0;
    let posStart = this.pos.copy();

    // keep going while character is a digit or a dot, and we haven't seen a dot yet
    while (
      this.currentChar !== null &&
      (LEX.digits.test(this.currentChar) || LEX.dot.test(this.currentChar))
    ) {
      if (LEX.dot.test(this.currentChar)) {
        if (dotCount === 1) break;
        dotCount++;
      }

      numStr += this.currentChar;
      this.advance();
    }

    // check if INT or FLOAT
    if (dotCount === 0) {
      return new Token(TT.INT, parseInt(numStr), posStart, this.pos);
    } else {
      return new Token(TT.FLOAT, parseFloat(numStr), posStart, this.pos);
    }
  }

  /**
   * generates a string after encountering double quotes in the text
   * @returns {Token}
   */
  makeString() {
    let string = '';
    let posStart = this.pos.copy();
    let escapeCharacter = false;
    this.advance();

    const ESCAPECHARACTERS = {
      n: '\n',
      t: '\t',
    };

    while (
      this.currentChar !== null &&
      (this.currentChar !== '"' || escapeCharacter)
    ) {
      if (escapeCharacter) {
        string += ESCAPECHARACTERS[this.currentChar] || this.currentChar;
        escapeCharacter = false;
      } else {
        if (this.currentChar === '\\') {
          escapeCharacter = true;
        } else {
          string += this.currentChar;
        }
      }

      this.advance();
    }

    this.advance();
    return new Token(TT.STRING, string, posStart, this.pos);
  }

  /**
   * generates an identifier token after encountering an alphabetic character in the text
   * @returns {Token}
   */
  makeIdentifier() {
    let idStr = '';
    let posStart = this.pos.copy();

    // keep going while character is a alphanumeric or an underscore
    while (
      this.currentChar !== null &&
      (LEX.digits.test(this.currentChar) || LEX.alpha.test(this.currentChar))
    ) {
      idStr += this.currentChar;
      this.advance();
    }

    // check if KEYWORD or IDENTIFIER
    let tokType = KEYWORDS.includes(idStr) ? TT.KEYWORD : TT.IDENTIFIER;
    return new Token(tokType, idStr, posStart, this.pos);
  }

  /**
   * generates an AND token after encountering a ampersand in the text
   * @returns {Token}
   */
  makeAnd() {
    let posStart = this.pos.copy();
    this.advance();

    if (LEX.ampersand.test(this.currentChar)) {
      this.advance();
      return [new Token(TT.AND, null, posStart, this.pos), null];
    }

    this.advance();
    return [
      null,
      new ExpectedCharError(posStart, this.pos, `'${LEX.ampersand.source}'`),
    ];
  }

  /**
   * generates an OR token after encountering a pipe in the text
   * @returns {Token}
   */
  makeOr() {
    let posStart = this.pos.copy();
    this.advance();

    if (LEX.pipe.test(this.currentChar)) {
      this.advance();
      return [new Token(TT.OR, null, posStart, this.pos), null];
    }

    this.advance();
    return [
      null,
      new ExpectedCharError(posStart, this.pos, `'${LEX.pipe.source}'`),
    ];
  }

  /**
   * generates a NOT/NE token after encountering an exclamation in the text
   * @returns {Token}
   */
  makeNotEquals() {
    let tokType = TT.NOT;
    let posStart = this.pos.copy();
    this.advance();

    if (LEX.equals.test(this.currentChar)) {
      this.advance();
      tokType = TT.NE;
    }

    return new Token(tokType, null, posStart, this.pos);
  }

  /**
   * generates an EQ/EE token after encountering an equals sign in the text
   * @returns {Token}
   */
  makeEquals() {
    let tokType = TT.EQ;
    let posStart = this.pos.copy();
    this.advance();

    if (LEX.equals.test(this.currentChar)) {
      this.advance();
      tokType = TT.EE;
    }

    return new Token(tokType, null, posStart, this.pos);
  }

  /**
   * generates a LT/LTE token after encountering a leftArrow in the text
   * @returns {Token}
   */
  makeLessThan() {
    let tokType = TT.LT;
    let posStart = this.pos.copy();
    this.advance();

    if (LEX.equals.test(this.currentChar)) {
      this.advance();
      tokType = TT.LTE;
    }

    return new Token(tokType, null, posStart, this.pos);
  }

  /**
   * generates a GT/GTE token after encountering a '>' in the text
   * @returns {Token}
   */
  makeGreaterThan() {
    let tokType = TT.GT;
    let posStart = this.pos.copy();
    this.advance();

    if (LEX.equals.test(this.currentChar)) {
      this.advance();
      tokType = TT.GTE;
    }

    return new Token(tokType, null, posStart, this.pos);
  }

  /** makes a div token or skips a comment block */
  makeDivide() {
    let posStart = this.pos.copy();
    this.advance();

    if (
      LEX.forwardSlash.test(this.currentChar) ||
      LEX.asterisk.test(this.currentChar)
    ) {
      this.skipComment();
    } else {
      return new Token(TT.DIV, null, posStart);
    }
  }

  /** grabs all characters in a comment and ignores them */
  skipComment() {
    if (LEX.forwardSlash.test(this.currentChar)) {
      // if next char is a forward slash, line comment
      // keep going until new line
      this.advance();
      while (
        this.currentChar !== null &&
        !LEX.lineEndings.test(this.currentChar)
      ) {
        this.advance();
      }
    } else if (LEX.asterisk.test(this.currentChar)) {
      // if next char is an asterisk, block comment
      // keep going until find other asterisk
      this.advance();

      while (
        this.currentChar !== null &&
        !LEX.asterisk.test(this.currentChar)
      ) {
        this.advance();
        if (LEX.asterisk.test(this.currentChar)) {
          this.advance();
          // if char after that is forward slash, done
          if (LEX.forwardSlash.test(this.currentChar)) break;
        }
      }
    }

    this.advance(); // past the final character
  }

  /**
   * generates a list of tokens by going through each char in the text
   * @returns {[Token[], Error]}
   */
  makeTokens() {
    let tokens = [];

    while (this.currentChar !== null) {
      if (LEX.spacesAndTabs.test(this.currentChar)) {
        this.advance(); // ignore spaces and tabs
      } else if (LEX.lineEndings.test(this.currentChar)) {
        tokens.push(new Token(TT.NEWLINE, null, this.pos));
        this.advance();
      } else if (LEX.digits.test(this.currentChar)) {
        tokens.push(this.makeNumber());
      } else if (LEX.alpha.test(this.currentChar)) {
        tokens.push(this.makeIdentifier());
      } else if (LEX.doubleQuotes.test(this.currentChar)) {
        tokens.push(this.makeString());
      } else if (LEX.plus.test(this.currentChar)) {
        tokens.push(new Token(TT.PLUS, null, this.pos));
        this.advance();
      } else if (LEX.hyphen.test(this.currentChar)) {
        tokens.push(new Token(TT.MINUS, null, this.pos));
        this.advance();
      } else if (LEX.asterisk.test(this.currentChar)) {
        tokens.push(new Token(TT.MUL, null, this.pos));
        this.advance();
      } else if (LEX.forwardSlash.test(this.currentChar)) {
        let tok = this.makeDivide();
        if (tok) tokens.push(tok);
      } else if (LEX.caret.test(this.currentChar)) {
        tokens.push(new Token(TT.POW, null, this.pos));
        this.advance();
      } else if (LEX.leftParen.test(this.currentChar)) {
        tokens.push(new Token(TT.LPAREN, null, this.pos));
        this.advance();
      } else if (LEX.rightParen.test(this.currentChar)) {
        tokens.push(new Token(TT.RPAREN, null, this.pos));
        this.advance();
      } else if (LEX.leftSquare.test(this.currentChar)) {
        tokens.push(new Token(TT.LSQUARE, null, this.pos));
        this.advance();
      } else if (LEX.rightSquare.test(this.currentChar)) {
        tokens.push(new Token(TT.RSQUARE, null, this.pos));
        this.advance();
      } else if (LEX.leftCurly.test(this.currentChar)) {
        tokens.push(new Token(TT.LCURL, null, this.pos));
        this.advance();
      } else if (LEX.rightCurly.test(this.currentChar)) {
        tokens.push(new Token(TT.RCURL, null, this.pos));
        this.advance();
      } else if (LEX.comma.test(this.currentChar)) {
        tokens.push(new Token(TT.COMMA, null, this.pos));
        this.advance();
      } else if (LEX.ampersand.test(this.currentChar)) {
        let [tok, error] = this.makeAnd();
        if (error) return [[], error];
        tokens.push(tok);
      } else if (LEX.pipe.test(this.currentChar)) {
        let [tok, error] = this.makeOr();
        if (error) return [[], error];
        tokens.push(tok);
      } else if (LEX.exclamation.test(this.currentChar)) {
        tokens.push(this.makeNotEquals());
      } else if (LEX.equals.test(this.currentChar)) {
        tokens.push(this.makeEquals());
      } else if (LEX.leftArrow.test(this.currentChar)) {
        tokens.push(this.makeLessThan());
      } else if (LEX.rightArrow.test(this.currentChar)) {
        tokens.push(this.makeGreaterThan());
      } else {
        let posStart = this.pos.copy();
        let char = this.currentChar;
        this.advance();
        return [[], new IllegalCharError(posStart, this.pos, `'${char}'`)];
      }
    }

    tokens.push(new Token(TT.EOF, null, this.pos));
    return [tokens, null];
  }
}

module.exports = Lexer;
