const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Gets the smallest element in a list
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */

function kubwa(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
  let kubwa = null;
  let type_list = orodha.elements[0].constructor.name;
  let same_type = [true, type_list];

  //check if the passed args holds a single type
  if (orodha.elements.length > 1) {
    for (var i = 0; i < orodha.elements.length - 1; i++) {
      if (orodha.elements[i].constructor.name === type_list) {
        same_type[0] = true;
      } else {
        same_type[0] = false;
      }
    }
  } else {
    kubwa = orodha.elements[orodha.elements.length - 1];
    return res.success(kubwa);
  }

  if (same_type[0] == true) {
    switch (type_list) {
      case 'SWNumber':
        kubwa = orodha.elements[0];
        for (var num = 0; num < orodha.elements.length; num++) {
          if (orodha.elements[num] > kubwa) {
            kubwa = orodha.elements[num];
          }
        }
        break;

      case 'SWString':
        let currentStringVar = orodha.elements[0].value.length;
        for (var i = 0; i < orodha.elements.length; i++) {
          if (orodha.elements[i].value.length > currentStringVar) {
            currentStringVar = orodha.elements[i].value.length;
            kubwa = orodha.elements[i];
          }
        }
        break;

      case 'SWList':
        currentListVar = orodha.elements[0].elements.length;
        for (var i = 0; i < orodha.elements.length; i++) {
          if (orodha.elements[i].elements.length > currentListVar) {
            currentListVar = orodha.elements[i].elements.length;
            kubwa = orodha.elements[i];
          }
        }
        break;

      case 'SWBoolean':
        kubwa = orodha.elements[0];
        for (var i = 0; i < orodha.elements.length; i++) {
          if (orodha.elements[i].value === true) {
            kubwa = orodha.elements[i];
          }
        }
        break;

      default:
        console.log('switch default block');
        kubwa = orodha.elements[orodha.elements.length - 1];
        break;
    }
  } else {
    console.log('outer else block');
    kubwa = orodha.elements[orodha.elements.length - 1];
  }

  return res.success(kubwa);
}

module.exports = { method: kubwa, args: ['orodha'] };
