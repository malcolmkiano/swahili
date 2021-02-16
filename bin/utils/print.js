/**
 * prints text to the terminal
 * @param {String} text text to be printed to the terminal
 * @param {Boolean} newLine whether to print an additional line after text
 */
function print(text, newLine = false) {
  console.log(text + (newLine ? '\n' : ''));
}

module.exports = print;
