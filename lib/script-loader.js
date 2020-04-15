const loaderUtils = require("loader-utils");
const { importRegex, getRegex, makeClassName } = require("./util");

/**
 * Strip all the CSS out of the js file and add an import for
 * itself with resplendence=true
 *
 * @this {import('./util').LoaderContext}
 *
 * @param {string} source - The source code of the file that will be transformed
 */
const scriptLoader = function(source) {
  /** @type string */
  const srcDir = (loaderUtils.getOptions(this) || {}).src;

  const importMatch = source.match(importRegex);
  if (!importMatch) {
    // If they didn't import resplendence, don't do any processing at all.
    this.callback(null, source);
    return;
  }
  const importName = importMatch[1];
  const regex = getRegex(importName);

  let count = 0;

  let hasComponents = false;
  let hasStyles = false;
  let output = source.replace(regex, (_all, parens, args, content) => {
    hasStyles = true;
    // Wrap the style code in comments, making sure to filter out any multiline
    // comments that might already be in there to avoid issues with nesting.
    const comment = `/*${content.replace("/*", "~*").replace("*/", "*~")}*/`;
    if (parens) {
      const className = makeClassName(this.resourcePath, ++count, srcDir);
      if (args && args.trim()) {
        // This is a styled component --- rx("div")``
        hasComponents = true;
        return `${importName}(${args}, "${className}")${comment}`;
      } else {
        // This is a styled classname --- rx()``
        return `"${className}"${comment}`;
      }
    } else {
      // This is a bare style --- rx``
      return comment;
    }
  });

  if (!hasStyles) {
    // Whoops, even though they imported rx, they didn't actually use it!
    this.callback(null, source);
    return;
  }

  output = output.replace(importRegex, all => {
    // The file imports itself, but with the query param resplendence=true so
    // that webpack can know to interpret it as a style instead of a script.
    let result = `import "${this.resourcePath}?resplendence=true";`;
    if (hasComponents) {
      result += all;
    }
    return result;
  });

  this.callback(null, output);
};

module.exports = scriptLoader;
