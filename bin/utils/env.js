const dotenv = require('dotenv');
const SWObject = require('../interpreter/types/object');
const SWString = require('../interpreter/types/string');

/**
 * Injects values from the node environment into the swahili runtime
 * @param {SymbolTable} gst the global symbol table to inject with the env values
 */
function injectEnv(gst) {
  dotenv.config();

  const env = new SWObject();
  Object.entries(process.env).forEach(([key, value]) => {
    env.symbolTable.setConstant(key, new SWString(value));
  });

  gst.setConstant('env', env);
}

module.exports = injectEnv;
