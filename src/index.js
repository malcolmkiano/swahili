const readline = require('readline');
const colors = require('colors');
const print = require('./utils/print');
const input = require('./utils/input');

/**
 * update the terminal title
 * @param {String} text text to show in the terminal title bar
 */
const setTitle = require('node-bash-title');

/** Swahili Interpreter */
const swh = require('./swh/run');

/** Prompt user for input in the terminal */
const getInput = async () => {
  const text = await input(`${colors.brightMagenta('swahili')} > `);
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
