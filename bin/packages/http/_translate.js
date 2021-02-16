/**
 * Replaces swahili data types with JSON-safe values
 * @param {*} data Swahili data value to be "translated"
 */
function translate(data) {
  let output;

  if (data.elements) {
    // data is an array
    output = [];
    data.elements.forEach((el) => {
      output.push(translate(el));
    });
  } else if (data.symbolTable) {
    if (data.typeName === 'Kamusi') {
      // data is an object
      output = {};

      Object.keys(data.symbolTable.symbols).forEach((key) => {
        if (key === 'hii') return; // ignore self reference
        output[key] = translate(data.symbolTable.symbols[key]);
      });
    } else {
      // data is a function or other complex shape
      output = data.name;
    }
  } else {
    // data is a primitive value
    output = data.value;
  }

  return output;
}

module.exports = translate;
