/** STDIN & STDOUT setup */
const readline = require('readline');
const colors = require('colors');
const setTitle = require('node-bash-title');
const print = require('./utils/print');

/** Swahili Interpreter */
const swh = require('./swh/run');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Prompts user for input in the terminal */
const getInput = () => {
  rl.question(`${colors.brightGreen('swahili')} > `, (text) => {
    /** handle input */
    const [result, error] = swh('<stdin>', text);
    if (error) {
      print(colors.red(error.toString()), true);
    } else if (result) {
      print(result, true);
    }

    /** keep prompting until they manually terminate the process */
    getInput();
  });
};

console.clear();
setTitle('✨ swahili');
getInput();
