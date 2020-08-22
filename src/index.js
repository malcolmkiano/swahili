const readline = require('readline');
const colors = require('colors');
const print = require('./utils/print');

/**
 * update the terminal title
 * @param {String} text text to show in the terminal title bar
 */
const setTitle = require('node-bash-title');

/** Swahili Interpreter */
const swh = require('./swh/run');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Prompt user for input in the terminal */
const getInput = () => {
  rl.question(`${colors.brightGreen('swahili')} > `, (text) => {
    // handle input
    const [result, error] = swh('<stdin>', text);
    if (error) {
      print(colors.red(error.toString()), true);
    } else {
      print(result || colors.gray('bure kabisa'), true);
    }

    // keep prompting until they manually terminate the process
    getInput();
  });
};

// begin the process
console.clear();
setTitle('✨ swahili');
getInput();
