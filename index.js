const run = require('./swh');

let lines = [
  'let x = 12.5 + 5.0 + 6;',
  'let y = m * x + b;',
  'let y = greeting + "world";',
  'let y = "x";',
  'let f = 6.9;',
  'x = "13";',
  'abc = "hi"',
  'fn helloWorld(name):',
  'let f5 = null + true;'
];

run(lines);