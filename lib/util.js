const path = require("path");

/**
 * Add a source file, and optionally a map
 *
 * @callback loaderCallback
 * @param {?Error} error
 * @param {string} code
 * @param {Object=} sourceMap
 * @param {any=} any
 */

/**
 * The context passed into a loader
 *
 * @typedef {Object} LoaderContext
 * @property {string} resourcePath
 * @property {loaderCallback} callback
 * @property {string|Object|null} query
 * @property {boolean} sourceMap
 * @property {string} resourceQuery
 */

/**
 * Produce a classname from the path relative to the configured source directory.
 * @param {string} filepath the file's path
 * @param {number} index the current count of classnames added for this file
 * @param {string} src the configured source directory
 */
exports.makeClassName = function(filepath, index, src) {
  const name = path
    .relative(src, filepath)
    .replace(/[/\\]/g, "-")
    .replace(/\..*$/, "");
  return `rx-${name}-${index}`;
};

/**
 * Gets the regex that looks for resplendent styles.
 * @param {string} importName
 */
exports.getRegex = importName =>
  new RegExp(importName + "(\\((.*?)?\\))?`((.|[\\s\\S])*?)`", "g");

/**
 * regex to fetch the line where resplendence is imported. If you don't import
 * resplendence, then the file won't be processed at all.
 */
exports.importRegex = /import +(.+?) +from +['"]resplendence['"] *;?/;
