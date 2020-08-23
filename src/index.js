const colors = require('colors');
const print = require('./utils/print');
const prompt = require('prompt-sync')();

/**
 * update the terminal title
 * @param {String} text text to show in the terminal title bar
 */
const setTitle = require('node-bash-title');

/** Swahili Interpreter */
const swh = require('./swh/run');

/** Prompt user for input in the terminal */
const getInput = async () => {
  const text = prompt(`${colors.brightMagenta('swahili')} > `);
  if (text) {
    // handle input
    const [result, error] = swh('<stdin>', text);
    if (error) {
      print(colors.red(error.toString()), true);
    } else if (result) {
      print(result, true);
    }
  }

  // keep prompting until they manually terminate the process
  getInput();
};

// begin the process
console.clear();
setTitle('✨ swahili');
getInput();
