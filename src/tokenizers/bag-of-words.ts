import { Tokenizer } from './types'
import { basicNormalizer } from './normalizers'


/**
 * Tokenize a string name by normalizing it and splitting into words.
 * 
 * @param str - The input string to tokenize
 * @returns An array of tokens
 */
export const bagOfWords: Tokenizer = (str) => {
  const normalizedText = basicNormalizer(str);

  const tokens = normalizedText.split(/\s+/) as string[]; // split into words

  // remove empty tokens
  // prevent adding garbage
  return tokens.filter(Boolean);
}
