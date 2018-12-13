const makeClassName = require("./make-classname");
const loaderUtils = require("loader-utils");
const getRegex = require("./get-regex");
const getImportName = require("./get-import-name");

/**
 * Transform a js file with resplendence=true into a CSS file.
 */
const styleLoader = function(source) {
  const { src } = loaderUtils.getOptions(this) || {};

  if (!this.resourceQuery.includes("resplendence=true")) {
    return this.callback(null, source);
  }

  const importName = getImportName(source);
  if (!importName) return this.callback(null, source);
  const regex = getRegex(importName);

  let result = "";
  let match;
  let count = 0;
  while ((match = regex.exec(source))) {
    if (match[1]) {
      const className = makeClassName(this.resourcePath, ++count, src);
      result += `.${className} {\n${match[3]}\n}\n`;
    } else {
      result += match[3] + "\n";
    }
  }

  return this.callback(null, result);
};

module.exports = styleLoader;
