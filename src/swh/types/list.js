const util = require('util');
const SWValue = require('./value');
const SWNull = require('./null');
const SWNumber = require('./number');

const { RTError } = require('../error');

/**  List data type */
class SWList extends SWValue {
  /**
   * instantiates a list
   * @param {[]} elements elements to add to the list
   */
  constructor(elements) {
    super();
    this.elements = elements;
  }

  /**
   * inserts an item at the end of the list
   * @param {*} other element to be added to the current
   * @returns {SWList}
   */
  addedTo(other) {
    let newList = this.copy();
    newList.elements.push(other);

    return [newList, null];
  }

  /**
   * removes the item from the given index from the list
   * @param {SWNumber} other index of item to be removed from the current
   * @returns {SWList}
   */
  subbedBy(other) {
    if (other instanceof SWNumber) {
      let newList = this.copy();
      try {
        newList.elements.splice(other.value, 1);
        return [newList, null];
      } catch (err) {
        return [
          null,
          new RTError(
            other.posStart,
            other.posEnd,
            'Element at this index could not be removed from list because index is out of bounds',
            this.context
          ),
        ];
      }
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * concatenates two lists
   * @param {SWList} other list to be concatenated with the current
   * @returns {SWList}
   */
  multedBy(other) {
    if (other instanceof SWList) {
      let newList = this.copy();
      newList.elements = this.elements.concat(other.elements);
      return [newList, null];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * gets an element at a given index
   * @param {SWNumber} other index of item in list
   */
  divvedBy(other) {
    let result = [];
    if (other instanceof SWNumber) {
      if (!this.elements[other.value])
        return [
          null,
          new RTError(
            other.posStart,
            other.posEnd,
            'Element at this index could not be retrieved from list because index is out of bounds',
            this.context
          ),
        ];

      return [this.elements[other.value], null];
    } else {
      return [null, super.illegalOperation(other)];
    }
  }

  /**
   * creates a new instance of the list
   * @returns {SWList}
   */
  copy() {
    let copy = new SWList(this.elements);
    copy.setPosition(this.posStart, this.posEnd);
    copy.setContext(this.context);
    return copy;
  }

  [util.inspect.custom](depth, options) {
    return this.toString();
  }

  /**
   * string representation of the number class
   * @returns {String}
   */
  toString() {
    let elements = this.elements.filter(Boolean);
    return elements.length
      ? `[${elements.map((node) => node.toString()).join(', ')}]`
      : SWNull.NULL;
  }
}

module.exports = SWList;
