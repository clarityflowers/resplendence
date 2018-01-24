import makeClassName from './make-classname';
import makeFileName from './make-filename';
import loaderUtils from "loader-utils";
import getImportName from './get-import-name';
import regex from './regex';



function resplendenceLoader(source, _sourceMap) {
  let count = 0;
  let matched = false;
  let result = source;
  const importName = getImportName(source);
  if (importName) {
    const re = regex(importName);
    const replacer = (match, p1, p2, p3, p4, p5, p6) => {
      matched = true;
      const newLines = p6.replace(/[^\n]/g, "");
      if (p1) {
        let name = makeClassName(this.resourcePath, count++, this.query.src);
        if (parseInt(p5)) {
          name += ' _rx1';
        }
        return `${importName}(${p2}, "${name}");${newLines}`;
      }
      return newLines;
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