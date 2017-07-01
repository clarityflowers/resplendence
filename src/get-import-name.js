const getImportName = (content) => {
  const requireRe = /import (.+?) from ['"]resplendence['"]/;
  const requireMatch = content.match(requireRe);
  if (requireMatch) return requireMatch[1];
  else return null;
}

export default getImportName;