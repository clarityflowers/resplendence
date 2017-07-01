import makeClassName from './make-classname';
import makeFileName from './make-filename';
import loaderUtils from "loader-utils";
import getImportName from './get-import-name';
import regex from './regex';



function resplendenceLoader(source, sourceMap) {
  let count = 0;
  let matched = false;
  let result = source;
  const importName = getImportName(source);
  if (importName) {
    const re = regex(importName);
    const replacer = (match, p1, p2, p3) => {
      matched = true;
      if (p1) {
        return `${importName}(${p2}, "${makeClassName(this.resourcePath, count++)}")`;
      }
      return '';
    }
    result = source.replace(re, replacer);
    if (matched) {
      const pathName = makeFileName(this.query.src, this.resourcePath, this.query.ext);
      const request = loaderUtils.stringifyRequest(this, pathName);
      result = `import ${request};\n` + result;
    }
  }
  return result;
}

export default resplendenceLoader;