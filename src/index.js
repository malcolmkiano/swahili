const colors = require('colors');
const print = require('./utils/print');
const readline = require('readline');

/** set up terminal interface */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * update the terminal title
 * @param {String} text text to show in the terminal title bar
 */
const setTitle = require('node-bash-title');

/** Swahili Interpreter */
const swh = require('./swh/run');

/** Prompt user for input in the terminal */
function getInput() {
  rl.question(`${colors.brightMagenta('swahili')} > `, (text) => {
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
  });
}

// exit event handler
rl.on('SIGINT', () => {
  print('Kwaheri Mwanaprogramu!', true);
  process.exit(0);
});

// begin the process
console.clear();
setTitle('✨ swahili');
getInput();
