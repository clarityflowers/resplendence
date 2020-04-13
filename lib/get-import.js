/**
 * Gets the name they imported resplendence under.
 * @param {string} src
 * @returns {?RegExpExecArray}
 */
const getImport = src => {
  return /import +(.+?) +from +['"]resplendence['"] *;? *\r?\n?/.exec(src);
};

module.exports = getImport;
