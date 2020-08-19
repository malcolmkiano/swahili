// STDIN & STDOUT setup
const readline = require('readline');
const colors = require('colors');
const print = require('./utils/print');

// SWH
const swh = require('./swh/run');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// READ LOOP
const getInput = () => {
  rl.question(`${colors.brightGreen('swahili')} > `, (text) => {
    // handle input
    const [result, error] = swh('<stdin>', text);
    if (error) {
      print(colors.red(error.toString()), true);
    } else {
      print(result, true);
    }

    // get more input
    getInput();
  });
};

console.clear();
getInput();
