#!/usr/bin/env node

const yargs = require('yargs').argv;
const fs = require('fs');

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

/**
 * Print the output to the console (or not)
 * @param {*} result program output
 * @param {*} error any errors that occurred
 * @param {Boolean} visualOutput whether to show implicit program output
 */
function handleOutput(result, error, visualOutput = false) {
  if (error) {
    print(colors.red(error.toString()), true);
  } else if (result) {
    let output = result;
    if (result.elements.length === 1) {
      output = result.elements[0];
    }

    if (visualOutput) print(output, true);
  }
}

/** Prompt user for input in the terminal */
function getInput() {
  rl.question(`${colors.brightMagenta('swahili')} > `, (text) => {
    if (text) {
      // handle input
      const [result, error] = run('<stdin>', text);
      handleOutput(result, error, true);
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

if (yargs['_'].length) {
  let fileName = yargs['_'][0];
  let script = null;

  try {
    if (fs.lstatSync(fileName).isDirectory()) {
      fileName = fileName.replace(/\/|\\/g, '/');
      fileName = fileName.split('/').filter(Boolean); // remove all falsy values
      fileName.push('index.swh'); // default to index
      fileName = fileName.join('/');
    }

    if (fs.existsSync(fileName)) {
      script = fs.readFileSync(fileName, 'utf8');
    } else {
      throw new Error('File not found');
    }
  } catch (err) {
    let error = `Failed to load script "${fileName}"\n` + err.toString();
    handleOutput(null, error);
    process.exit(1);
  }

  // process the file
  const [result, error] = run(fileName, script, true);
  handleOutput(result, error);
  process.exit(0);
} else {
  // begin the repl
  setTitle('✨ swahili');
  getInput();
}
