const checkFile = require('../../../utils/checkFile');

const Lexer = require('../../../lexer');
const Parser = require('../../../parser');

const SWString = require('../../types/string');
const RTResult = require('../../runtimeResult');
const { RTError } = require('../../error');

/**
 * Imports a module/value from a file
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function impoti(inst, executionContext) {
  let res = new RTResult();
  let faili = executionContext.symbolTable.get('faili');
  if (!faili)
    return res.failure(
      new RTError(
        inst.posStart,
        inst.posEnd,
        `Parameter 'faili' is required`,
        executionContext
      )
    );

  if (!(faili instanceof SWString))
    return res.failure(
      new RTError(
        faili.posStart,
        faili.posEnd,
        `'faili' must be a string`,
        executionContext
      )
    );

  let fileName = faili.value;
  let text;
  try {
    text = checkFile(fileName);

    // Generate tokens
    const lexer = new Lexer(fileName, text);
    const [tokens, error] = lexer.makeTokens();
    if (error) return res.failure(error);

    // Generate abstract syntax tree
    const parser = new Parser(tokens);
    const ast = parser.parse();
    if (ast.error) return res.failure(ast.error);

    // Run program
    const exportValue = inst.interpreter.copyHeadless(
      ast.node,
      executionContext,
      inst
    );

    if (!exportValue.value)
      return res.failure(
        new RTError(
          faili.posStart,
          faili.posEnd,
          `No exports found in "${fileName}"`,
          executionContext
        )
      );

    return exportValue;
  } catch (err) {
    return res.failure(
      new RTError(
        faili.posStart,
        faili.posEnd,
        `Could not import "${fileName}"`,
        executionContext
      )
    );
  }
}

module.exports = { method: impoti, args: ['faili'] };
