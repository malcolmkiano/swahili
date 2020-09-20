#!/usr/bin/env node
const args = process.argv.slice(2);
const fs = require('fs');
const colors = require('colors');
const readline = require('readline');

const info = require('../package.json');
const print = require('./utils/print');
const run = require('./interpreter/run');

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
      const [result, error, callbackQueue] = run('<stdin>', text);
      handleOutput(result, error, true);

      startEventLoop(callbackQueue);
    } else {
      // keep prompting until they manually terminate the process
      getInput();
    }
  });
}

// exit event handler
rl.on('SIGINT', () => {
  print(''); // empty line before output
  print('Kwaheri Mwanaprogramu!', true);
  process.exit(0);
});

// help info
const printHelp = () => {
  print('Usage: swahili <option> <filename>', true);
  print('where <option> is one of:');
  print('-h, --help');
  print('  Print this help', true);
  print('-l, --load');
  print('  Load a script at <filename> and run Swahili REPL', true);
  print('-v, --version');
  print('  Print the installed version of swahili-lang', true);

  print(
    'swahili [-l|--load] <filename>\tScript at <filename> will be executed and loaded into the current context'
  );
  print(
    'swahili <filename>\tScript at <filename> will be executed and the program will exit'
  );
  print('swahili\t\t\tRun Swahili REPL');
};

/**
 * monitors the callback queue and terminates the program or prompts for input when the queue is empty
 * @param {[]} queue the callback queue
 * @param {boolean} preRepl whether the watch is being called before the repl starts or not
 * @param {boolean} loadIn whether the script being watched is a load-in or not
 */
function startEventLoop(queue, preRepl = false, loadIn = false) {
  let interval = setInterval(() => {
    let q = queue ? queue.filter((tm) => !tm._destroyed) : [];
    if (!q.length) {
      clearInterval(interval);
      if (preRepl && !loadIn) {
        process.exit(0);
      } else {
        if (loadIn)
          print(
            `Script ${colors.green(
              '"' + fileName + '"'
            )} was successfully loaded.`,
            true
          );
        getInput();
      }
    }
  }, 1);
}

let fileName;
let load = false;

if (args.length) {
  fileName = args[0];
  let script = null;

  if (['-v', '--version'].includes(args[0])) {
    print(colors.brightMagenta(`Swahili v${info.version}`));
    process.exit(0);
  } else if (['-h', '--help'].includes(args[0])) {
    printHelp();
    process.exit(0);
  } else if (['-l', '--load'].includes(args[0])) {
    load = true;
  } else if (args[0].startsWith('-')) {
    print(colors.red(`${args[0]} is not a valid option`), true);
    printHelp();
    process.exit(1);
  }

  try {
    if (load) fileName = args[1];
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
  const [result, error, callbackQueue] = run(fileName, script, !load);
  handleOutput(result, error);

  startEventLoop(callbackQueue, true, load);
} else {
  console.clear();
  getInput();
}
