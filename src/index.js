const colors = require('colors');
const readline = require('readline');
const setTitle = require('node-bash-title');

const print = require('./utils/print');
const { run } = require('./interpreter');

/** set up terminal interface */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
