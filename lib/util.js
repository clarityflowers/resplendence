const { SourceNode } = require("source-map");

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
 * @param {number[]} lineLengths - A map of line numbers to line lengths
 * @param {number} index - an index returned by regex matching
 * @returns {{row: number, col: number}} The row and column the regex index corresponds to.
 */
function getRowAndCol(lineLengths, index) {
  var col = index;
  var row = 0;
  while (row < lineLengths.length) {
    if (col >= lineLengths[row]) {
      col -= lineLengths[row];
      row += 1;
    } else {
      return { row: row + 1, col };
    }
  }
  return { row: lineLengths.length, col: lineLengths[lineLengths.length] };
}
exports.getRowAndCol = getRowAndCol;

/**
 * @param {string} source - The source code
 * @returns {number[]} A map of line numbers to the length of that line
 */
function getLineLengths(source) {
  const lineLengths = [];
  var len = 0;
  const regex = /\r?\n/g;
  let match;
  while ((match = regex.exec(source))) {
    const length = match.index + match[0].length - len;
    len += length;
    lineLengths.push(length);
  }
  if (len < source.length) lineLengths.push(source.length - len);
  return lineLengths;
}
exports.getLineLengths = getLineLengths;

const START = 0;
const WHITESPACE_PUNCTUATION = 1;
const WORD = 2;
const END_OF_STRING = 99;

const ALPHA_NUM = /[a-zA-Z0-9]/;

/**
 * So apparently source maps are pretty dumb, and if you copy the source
 * directly without modifying it, you have to say that explicitly by mapping
 * character-by-character.
 *
 * To make this a little less wildly effiecient, I'm only going to map the
 * beginnings of alphanumeric tokens, skipping over whitespace and punctuation.
 *
 * @param {number[]} lineLengths - a map of line numbers to line lengths
 * @param {string} file
 * @param {string} source
 * @param {number} start
 * @param {number=} end
 * @returns {import('source-map').SourceNode[]}
 */
function copiedSourceMapping(lineLengths, file, source, start, end) {
  if (end === undefined) end = source.length;
  let i = start;
  /** @type {import('source-map').SourceNode[]} */
  const maps = [];
  let tokenIndex = start;
  let state = START;
  while (true) {
    const char = source[i];
    const tokenEnd = i;
    if (i >= end) {
      state = END_OF_STRING;
    } else if (char.match(ALPHA_NUM)) {
      if (state === START || state === WORD) {
        i++;
        state = WORD;
        continue;
      } else {
        state = START;
      }
    } else {
      state = WHITESPACE_PUNCTUATION;
      i++;
      continue;
    }
    const { row, col } = getRowAndCol(lineLengths, tokenIndex);
    maps.push(
      new SourceNode(row, col, file, source.slice(tokenIndex, tokenEnd))
    );
    if (state === END_OF_STRING) break;
    tokenIndex = i;
    i++;
  }
  return maps;
}
exports.copiedSourceMapping = copiedSourceMapping;
