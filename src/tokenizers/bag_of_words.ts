import { Tokenizer } from './types'


/**
 * Tokenize a string name by normalizing it and splitting into words.
 * 
 * @param str - The input string to tokenize
 * @returns An array of tokens
 */
export const bag_of_words: Tokenizer = (str) => {
  const normalizedText = normalizeName(str);

  const tokens = normalizedText.split(/\s+/) as string[]; // split into words

  // remove empty tokens
  // prevent adding garbage
  return tokens.filter(Boolean);
}

/**
 * Normalize a sting by converting to lowercase, replacing HTML entities,
 * replacing punctuation with spaces, and removing common suffixes (heuristic approach of identifying same entities)
 * 
 * @param str - The input string to normalize
 * @returns The normalized string
 */
export function normalizeName(str: string): string {
  let normalized = str.toLowerCase();
  normalized = normalized.replace(/&/g, '&'); // Basic HTML entity
  // Add more entity replacements if quick
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g, ' '); // Replace punctuation with space
  normalized = normalized.replace(/\s+/g, ' ').trim(); // Normalize multiple spaces to one
  normalized = normalized.replace(/\s+/g, ' ').trim(); // Clean up spaces again
  return normalized;
}