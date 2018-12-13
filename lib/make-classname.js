const path = require("path");

/**
 * Produce a classname from the path relative to the configured source directory.
 * @param {string} filepath the file's path
 * @param {number} index the current count of classnames added for this file
 * @param {string} src the configured source directory
 */
const makeStyledClassName = function(filepath, index, src) {
  const name = path
    .relative(src, filepath)
    .replace(/[/\\]/g, "-")
    .replace(/\..*$/, "");
  return `rx-${name}-${index}`;
};

module.exports = makeStyledClassName;
