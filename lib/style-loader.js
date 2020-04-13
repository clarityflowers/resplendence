const makeClassName = require("./make-classname");
const loaderUtils = require("loader-utils");
const getRegex = require("./get-regex");
const getImport = require("./get-import");
const { SourceNode } = require("source-map");
const { getLineLengths, getRowAndCol } = require("./util");

/**
 * Transform a js file with resplendence=true into a CSS file.
 *
 * @this {import('./util').LoaderContext}
 *
 * @param {string} source
 */
const styleLoader = function(source) {
  const { src } = loaderUtils.getOptions(this) || {};

  if (!this.resourceQuery.match("resplendence=true")) {
    return this.callback(null, source);
  }

  const importMatch = getImport(source);
  if (!importMatch) return this.callback(null, source);
  const regex = getRegex(importMatch[1]);

  const node = new SourceNode(1, 0, this.resourcePath);
  const lineLengths = getLineLengths(source);

  let match;
  let count = 0;
  while ((match = regex.exec(source))) {
    const [all, _parens, _args, content] = match;
    const { row, col } = getRowAndCol(
      lineLengths,
      match.index + all.indexOf(content)
    );
    if (match[1]) {
      const openPos = getRowAndCol(lineLengths, match.index);
      const className = makeClassName(this.resourcePath, ++count, src);
      node.add(
        new SourceNode(
          openPos.row,
          openPos.col,
          this.resourcePath,
          `.${className} {`
        )
      );
      node.add(new SourceNode(row, col, this.resourcePath, content));
      const closePos = getRowAndCol(
        lineLengths,
        match.index + all.indexOf(content) + content.length
      );
      node.add(
        new SourceNode(closePos.row, closePos.col, this.resourcePath, "}\n")
      );
    } else {
      node.add(new SourceNode(row, col, this.resourcePath, content + "\n"));
    }
  }

  if (this.sourceMap) {
    const { map, code } = node.toStringWithSourceMap();
    return this.callback(null, code, map.toJSON());
  } else {
    return this.callback(null, node.toString());
  }
};

module.exports = styleLoader;
