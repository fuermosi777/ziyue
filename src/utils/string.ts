/**
 * Remove all line breaks (\n).
 * Merge all multiple continues spaces.
 * Trim text.
 * @param text The text to be normalized.
 */
export function normalizeText(text: string) {
  if (!text) return '';
  let result = text.replace(/\\n/g, '');
  result = result.replace(/\n/g, '');
  result = result.replace(/\s\s+/g, ' ');
  result = result.trim();
  return result;
}
