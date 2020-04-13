const getImport = require("./get-import");

const { getRowAndCol, getLineLengths, copiedSourceMapping } = require("./util");

const makeClassName = require("./make-classname");
const loaderUtils = require("loader-utils");
const getRegex = require("./get-regex");
const SourceNode = require("source-map").SourceNode;

/**
 * Strip all the CSS out of the js file and add an import for
 * itself with resplendence=true
 *
 * @this {import('./util').LoaderContext}
 *
 * @param {string} source
 */
const scriptLoader = function(source) {
  /** @type {string} */
  const srcDir = (loaderUtils.getOptions(this) || {}).src;

  const node = new SourceNode(1, 0, this.resourcePath);
  node.setSourceContent(this.resourcePath, source);
  const lineLengths = getLineLengths(source);

  const importMatch = getImport(source);
  if (!importMatch) {
    this.callback(null, source);
    return;
  }
  const importIndex = importMatch.index;
  const importName = importMatch[1];

  const sourceIndex = importIndex + importMatch[0].length;
  const regex = getRegex(importName);
  regex.lastIndex = sourceIndex;

  /** @type {?RegExpExecArray} */
  let match = null;
  let count = 0;
  let hasComponents = false;
  let lastIndex = sourceIndex;
  while ((match = regex.exec(source))) {
    const index = match.index;

    // add untransformed source
    if (index > 0) {
      node.add(
        copiedSourceMapping(
          lineLengths,
          this.resourcePath,
          source,
          lastIndex,
          index
        )
      );
    }

    // add transformed source
    const [_all, parens, args, _content, _char, semicolon] = match;
    if (parens) {
      const { row, col } = getRowAndCol(lineLengths, index);
      const className = makeClassName(this.resourcePath, ++count, srcDir);
      var result = "";
      if (args && args.trim()) {
        hasComponents = true;
        result = `${importName}(${args}, "${className}")`;
      } else {
        result = `"${className}"`;
      }
      result += semicolon;
      const newNode = new SourceNode(row, col, this.resourcePath, result);
      node.add(newNode);
    }
    lastIndex = index + match[0].length;
    regex.lastIndex = lastIndex;
  }
  if (count > 0) {
    node.prepend(
      new SourceNode(
        null,
        null,
        this.resourcePath,
        `import "${this.resourcePath}?resplendence=true";\n`
      )
    );
  }
  {
    let headersLength = importIndex;
    if (hasComponents) {
      headersLength += importMatch[0].length;
    }
    node.prepend(
      copiedSourceMapping(
        lineLengths,
        this.resourcePath,
        source,
        0,
        headersLength
      )
    );
  }
  node.add(
    copiedSourceMapping(lineLengths, this.resourcePath, source, lastIndex)
  );

  if (this.sourceMap) {
    const { map, code } = node.toStringWithSourceMap();
    this.callback(null, code, map.toJSON());
  } else {
    this.callback(null, node.toString());
  }
};

module.exports = scriptLoader;
