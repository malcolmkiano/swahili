const colors = require('colors');
const print = require('./utils/print');
const readline = require('readline');

const SWNull = require('./swh/types/null');

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
const { run } = require('./swh/interpreter');

/** Prompt user for input in the terminal */
function getInput() {
  rl.question(`${colors.brightMagenta('swahili')} > `, (text) => {
    if (text) {
      // handle input
      const [result, error] = run('<stdin>', text);
      if (error) {
        print(colors.red(error.toString()), true);
      } else if (result) {
        let output = result;
        if (result.elements.length === 1) {
          output = result.elements[0];
        }

        print(output, true);
      }
    }

    // keep prompting until they manually terminate the process
    getInput();
  });
}

// exit event handler
rl.on('SIGINT', () => {
  print(''); // empty line before output
  print('Kwaheri Mwanaprogramu!', true);
  process.exit(0);
});

// begin the process
console.clear();
setTitle('✨ swahili');
getInput();
