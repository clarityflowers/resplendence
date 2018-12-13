const makeClassName = require("./make-classname");
const loaderUtils = require("loader-utils");
const getImportName = require("./get-import-name");
const getRegex = require("./get-regex");

/**
 * Strip all the CSS out of the js file and add an import for
 * itself with resplendence=true
 */
const scriptLoader = function(source) {
  const { src } = loaderUtils.getOptions(this) || {};

  const importName = getImportName(source);
  if (!importName) return this.callback(null, source);
  const regex = getRegex(importName);

  let count = 0;
  let output = source.replace(regex, (_m, parens, args) => {
    if (parens) {
      const className = makeClassName(this.resourcePath, ++count, src);
      if (args && args.trim()) {
        return `${importName}(${args}, "${className}")`;
      }
      return `"${className}"`;
    }
    return "";
  });

  if (count) {
    output = `import "${this.resourcePath}?resplendence=true";\n${output}`;
  }

  return this.callback(null, output);
};

module.exports = scriptLoader;
