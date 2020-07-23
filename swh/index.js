const PARSERS = {
  variableParser: require('./parsers/vars')
};

const KEYWORDS = [
  { word: 'let', parse: PARSERS.variableParser }
];

let VARS = { greeting: 'hello', m: 1, x: 12, b: 5 };

function run(lines) {
  lines.forEach(line => {
    for (let { word, parse } of KEYWORDS) {
      if (line.startsWith(word)) {
        let result = parse(line.substr(word.length + 1, line.length), VARS);
        console.log(result);
        console.log(' ');
        break;
      }
    }
  });
}

module.exports = run;