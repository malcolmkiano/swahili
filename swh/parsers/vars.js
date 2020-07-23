// TODO: Array parsing
// Arrays can only have elements of one data type

const TERMINATOR = ';';
const ASSIGNMENT_OP = '=';

function parse(str, VARS) {
  console.log(str);
  if (str.endsWith(TERMINATOR)) {
    let [variable, value] = str
      .replace(TERMINATOR, '') // removes TERMINATOR
      .split(ASSIGNMENT_OP)
      .map(s => s.trim()); // gets rid of whitespace
    if (variable) {
      // <var> -> <chars>
      // <chars> -> <chars>|a|b|c|...|z
      // starts with lowercaseletter or underscore
      if (/[a-z_]+/.test(variable)) {
        // valid variable name
        console.log(`valid variable name '${variable}'`)
        if (value) {
          // <value> -> <char>|a|b|c|...|z|<num>|<var>
          // <num> -> 0|1|...9|<num>
          if (/^((".*")|([\d]+(\.[\d]+)?))((\s)?[+\-*/](\s)?((".*")|([\d]+(\.[\d]+)?)))*$|^(true|false|null)$/.test(value)) {
            // value is ok
            console.log(`valid expression '${value}'`)
          } else {
            let tokens = value.split(/\s?[+\-*/]\s?/);
            for (let i = 0; i < tokens.length; i++) {
              let token = tokens[i];
              if (VARS[token]) {
                // valid token
                console.log(`valid token '${token}' => ${VARS[token]}`);
              } else {
                if (/((".*")|([\d]+(\.[\d]+)?))/.test(token)) {
                  // valid token (primitive value)
                  console.log(`valid token '${token}'`);
                } else {
                  console.log(`invalid expression '${value}'`);
                  return false;
                }
              }
            }
          }
        } else {
          console.log(`expression not provided`);
          return false;
        }
      } else {
        console.log(`invalid variable name '${variable}'`);
        return false;
      }
    } else {
      console.log(`expression not provided`);
      return false;
    }
  } else {
    console.log(`line does not end with terminator (${TERMINATOR})`);
    return false;
  }

  return true;
}

module.exports = parse;