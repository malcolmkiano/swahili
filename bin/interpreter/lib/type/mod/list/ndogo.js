const RTResult = require('../../../../runtimeResult');
const { RTError } = require('../../../../error');

/**
 * Gets the smallest element in a list
 * @param {SWBuiltInFunction} inst the instance of the built in function
 * @param {Context} executionContext the calling context
 */

function ndogo(inst, executionContext) {
  let res = new RTResult();
  let orodha = executionContext.symbolTable.get('orodha');
  let ndogo = null;
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
    ndogo = orodha.elements[0];
    return res.success(ndogo);
  }

  if (same_type[0] == true) {
    switch (type_list) {
      case 'SWNumber':
        ndogo = orodha.elements[0];
        for (var num = 0; num < orodha.elements.length; num++) {
          if (orodha.elements[num] < ndogo) {
            ndogo = orodha.elements[num];
          }
        }
        break;

      case 'SWString':
        let currentStringVar = orodha.elements[0].value.length;
        for (var i = 0; i < orodha.elements.length; i++) {
          if (orodha.elements[i].value.length < currentStringVar) {
            currentStringVar = orodha.elements[i].value.length;
            ndogo = orodha.elements[i];
          }
        }
        break;

      case 'SWList':
        currentListVar = orodha.elements[0].elements.length;
        for (var i = 0; i < orodha.elements.length; i++) {
          if (orodha.elements[i].elements.length < currentListVar) {
            currentListVar = orodha.elements[i].elements.length;
            ndogo = orodha.elements[i];
          }
        }
        break;

      case 'SWBoolean':
        ndogo = orodha.elements[0];
        for (var i = 0; i < orodha.elements.length; i++) {
          if (orodha.elements[i].value === false) {
            ndogo = orodha.elements[i];
          }
        }
        break;

      default:
        console.log('switch default block');
        ndogo = orodha.elements[0];
        break;
    }
  } else {
    console.log('outer else block');
    ndogo = orodha.elements[0];
  }

  return res.success(ndogo);
}

module.exports = { method: ndogo, args: ['orodha'] };
