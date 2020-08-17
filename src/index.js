// STDIN & STDOUT setup
const readline = require('readline');
const colors = require('colors');

// SWH
const swh = require('./swh/run');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const print = text => {
  return console.log(text, "\n");
};

// READ LOOP
const getInput = () => {
  rl.question(`${colors.brightGreen('swahili')} > `, text => {

    // handle input
    const [result, error] = swh('<stdin>', text)
    if (error) {
      print(colors.red(error.toString()));
    } else {
      print(result);
    }

    // get more input
    getInput();

  });
}

console.clear();
getInput();