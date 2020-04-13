/**
 * Gets the regex that looks for resplendent styles.
 * @param {string} importName
 */
const getRegex = importName =>
  new RegExp(
    importName + "(\\((.*?)?\\))?`((.|[\\s\\S])*?)`(;? *(\r?\n)? *(\r?\n)?)",
    "g"
  );

module.exports = getRegex;
