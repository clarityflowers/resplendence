/**
 * Gets the regex that looks for resplendent styles.
 * @param {string} importName
 */
const getRegex = importName =>
  new RegExp(importName + "(\\((.*?)?\\))?`((.|[\\s\\S])*?)`", "g");

module.exports = getRegex;
