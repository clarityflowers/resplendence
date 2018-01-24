import path from 'path';

const toHash = (string, src) => {
  // var hash = 0, i, chr;
  // eslint-disable-next-line no-console
  // console.log();
  // if (string.length === 0) return hash;
  return path.relative(src, string)
    .replace(/[/\\]/g, "_")
    .replace(/\..*$/, "");
  // for (i = 0; i < string.length; i++) {
  //   chr   = string.charCodeAt(i);
  //   hash  = ((hash << 5) - hash) + chr;
  //   hash |= 0; // Convert to 32bit integer
  // }
  // return hash;
}

export default toHash;