

/**
 *
 * @param {Array} arr - array to check for item
 * @param {String} propName - the targeted property name
 * @param {*} value - value to check for
 */
export function hasItem(arr, propName, value) {
  if(!Array.isArray(arr)) throw new Error('Array was not provided.');
  /* stringifying the property name */
  propName = propName.toString();
  for(const item of arr) {
    if(typeof item === 'object' && item.hasOwnProperty(propName) && item[propName] === value) {
      return true;
    }
  }
  return false;
}