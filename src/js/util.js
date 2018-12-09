/**
 *
 * @param {Array} arr - array to check for item
 * @param {String} propName - the targeted property name
 * @param {*} value - value to check for
 */
export const hasItem = (arr, propName, value) => {
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

/**
 *
 * @param {String} hexColorString - Hex string to check (e.g. #FF00AA - not case sentsitive)
 */
export const isHexColor = hexColorString => {
  return /^#[0-9A-F]{6}$/i.test(hexColorString);
}

/**
 * Invokes callback function on `DOMContentLoaded` event or immediately if
 * `DOMContentLoaded` event has already fired (i.e `document.readyState` is `loading`)
 * @param {Function} callback - callback to call when `DOMContentLoaded` fires or
 * after it fires
 */
export const onDOMContentLoadedOrAfter = callback => {
  // catch if 'DOMContentLoaded' already fired
  if (document.readyState === "loading") {
    window.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}