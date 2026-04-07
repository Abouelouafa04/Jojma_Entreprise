const PLATFORM_RULES = {
  android: {
    extension: ".glb",
  },
  iphone: {
    extension: ".usdz",
  },
};

function getExtension(filename) {
  const index = filename.lastIndexOf(".");
  return index !== -1 ? filename.slice(index).toLowerCase() : "";
}

function isAllowedFile(filename, platform) {
  const rule = PLATFORM_RULES[platform];
  if (!rule) return false;
  return getExtension(filename) === rule.extension;
}

export { PLATFORM_RULES, isAllowedFile };