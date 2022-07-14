const path = require("path");

/**
 * Produce a classname from the path relative to the configured source directory.
 * @param {string} filepath the file's path
 * @param {number} index the current count of classnames added for this file
 * @param {string} src the configured source directory
 */
exports.makeClassName = function (filepath, index, src) {
  const name = path
    .relative(src, filepath)
    .replace(/[/\\]/g, "-")
    .replace(/\..*$/, "")
    .replace(/[^a-zA-Z0-9\-]/g, "");
  return `rx-${name}-${index}`;
};

/**
 * Gets the regex that looks for resplendent styles.
 * @param {string} importName
 */
exports.getRegex = (importName) =>
  new RegExp(importName + "(\\((.*?)?\\))?`((.|[\\s\\S])*?)`", "g");

/**
 * regex to fetch the line where resplendence is imported. If you don't import
 * resplendence, then the file won't be processed at all.
 */
exports.importRegex = /import +(\S+?) +from +['"]resplendence['"] *;?/;
