const loaderUtils = require("loader-utils");
const { importRegex, getRegex, makeClassName } = require("./util");

const DELETE_START = "!RESPLENDENCE CODE TO DELETE START!";
const DELETE_END = "!RESPLENDENCE CODE TO DELETE END!";

/**
 * Transform a js file with resplendence=true into a CSS file.
 *
 * @this {import('./util').LoaderContext}
 *
 * @param {string} source
 */
const styleLoader = function(source) {
  const { src } = loaderUtils.getOptions(this) || {};

  if (!this.resourceQuery.includes("resplendence=true")) {
    return this.callback(null, source);
  }

  const importMatch = source.match(importRegex);
  if (!importMatch) return this.callback(null, source);
  const importName = importMatch[1];
  const regex = getRegex(importName);

  let count = 0;
  // Wrap everything in a flag that this code should be deleted...
  let result = DELETE_START + source + DELETE_END;

  result = result.replace(regex, (_all, parens, _args, content) => {
    let code = content;
    if (parens) {
      const className = makeClassName(this.resourcePath, ++count, src);
      code = `.${className} {${content}}`;
    }
    // ... then carve out exceptions for the css ...
    return DELETE_END + code + DELETE_START;
  });

  // ... then strip all of the code marked for deletion,
  // leaving only the newlines, to preserve line numbers ...
  result = result.replace(
    new RegExp(`${DELETE_START}([\\s\\S]*?)${DELETE_END}`, "g"),
    (_all, code) => {
      return code.replace(/[\S \t]+/g, "");
    }
  );

  // ... and finally, trim trailing whitespace
  result = result.replace(/\s+$/, "");

  return this.callback(null, result);
};

module.exports = styleLoader;
