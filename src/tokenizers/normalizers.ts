
/**
 * Normalize a sting by converting to lowercase, replacing HTML entities,
 * replacing punctuation with spaces, and removing common suffixes (heuristic approach of identifying same entities)
 * 
 * @param str - The input string to normalize
 * @returns The normalized string
 */
export function basicNormalizer(str: string): string {
  let normalized = str.toLowerCase();
  normalized = normalized.replace(/&/g, '&'); // Basic HTML entity
  // Add more entity replacements if quick
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g, ' '); // Replace punctuation with space
  normalized = normalized.replace(/\s+/g, ' ').trim(); // Normalize multiple spaces to one
  normalized = normalized.replace(/\s+/g, ' ').trim(); // Clean up spaces again
  return normalized;
}