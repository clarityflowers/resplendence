/**
 * Gets the name they imported resplendence under.
 * @param {string} src
 * @returns {string}
 */
const getImportName = src => {
  const requireRe = /import +(.+?) +from +['"]resplendence['"]/;
  const requireMatch = src.match(requireRe);
  if (!requireMatch) return null;
  return requireMatch[1] || null;
};

module.exports = getImportName;
