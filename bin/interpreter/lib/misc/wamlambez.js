const SWString = require('../../types/string');
const RTResult = require('../../runtimeResult');

/**
 * Fun sheng easter egg from a popular song
 * https://www.youtube.com/watch?v=ilnOAwKuZLQ
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */
function wamlambez(inst, executionContext) {
  let res = new RTResult();
  return res.success(new SWString('Wamnyonyez! '));
}

module.exports = { method: wamlambez, args: [] };
