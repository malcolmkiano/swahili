const TERMINATOR = ';';
const ASSIGNMENT_OP = '=';

function arrayParse(str){
    console.log(str);
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

        if (/^\[.*\]$/.test(value)){
            console.log(`detected array '${value}'`);

            //check if all avalues in the array are of the same type
            if(/^\[['"]\w+["'](,?\s+['"]\w+["'])*\]$/.test(value)){
              console.log(`${value} is an array of Strings`);
            } else if (/^\[\d+(,\s*\d+)*\]$/.test(value)){
              console.log(`${value} is an array of integers`)
            } else if(/^\[\d+\.\d+(,\s*\d+\.\d+)*\]$/){
                console.log(`${value} is an array of floats`)
            }
        } else {
          console.log(`'${value}' is not an array`)
        }
      }
    }else {
        console.log(`expression not provided`);
        return false;
    }
    console.log(' ');
}

let arrs= [ 
    'let x = [1,2,3,4];',
    'let names = ["John", "Lisa", "kevin"];',
    'let floats = [12.5,3.14,22.7];',
    'let name = ["gaiko"]',
    'let name = "Wendo"'
  ];

arrs.forEach(arrayParse)

//module.exports = arrayParse;