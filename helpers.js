export function cleanText(text) {
  if (typeof text !== `string`) return ``;
  if (!text) return ``;
  return text.trim().toLowerCase();
}
