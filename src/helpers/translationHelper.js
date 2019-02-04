/**
 * takes props object and 
 * @param {Object} props
 * @param {Array} remove - list of keys to strip from props
 * @return {Object} new properties without
 */
export const stripTranslateProperty = (props, remove) => {
  const result = {};
  for (let key in props) {
    if (props.hasOwnProperty(key) && (remove.indexOf(key) < 0)) {
      result[key] = props[key];
    }
  }
  return result;
};
