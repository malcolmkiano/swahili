const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt) {
  return new Promise((resolve, reject) => {
    rl.question(prompt || '> ', resolve);
  });
}

module.exports = input;
