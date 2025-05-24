import { Similarity } from './types'

/**
 * Levenshtien distance is a measure of the similarity between two strings. 
 * It is defined as the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.
 * 
 * @example
 * const levenshtien = new Levenshtien();
 * const similarity = levenshtien.similarity('hello', 'hello');
 * console.log(similarity); // 100
 */
export default class Levenshtein implements Similarity<string> {
  public similarity(str1: string, str2: string): number {
    // Create a 2D array to store the distances between substrings of str1 and str2
    const distanceMatrix: number[][] = [];


    // Initialize the first row and column of the matrix
    const stringOneLength: number = str1.length;
    const stringTwoLength: number = str2.length;

    for (let i: number = 0; i <= stringOneLength; i++) {
      distanceMatrix[i] = [i]; // Distance from empty string to str1 substrings
    }
    for (let j: number = 0; j <= stringTwoLength; j++) {
      distanceMatrix[0][j] = j; // Distance from empty string to str2 substrings
    }

    // Iterate through the characters of str1 and str2
    for (let i: number = 1; i <= stringOneLength; i++) {
      for (let j: number = 1; j <= stringTwoLength; j++) {
        // Calculate the cost of substitution (0 if characters match, 1 if they don't)
        const substitutionCost: number = (str1[i - 1] === str2[j - 1]) ? 0 : 1;

        // Calculate the minimum distance between the current substrings
        const insertionDistance: number = distanceMatrix[i - 1][j] + 1; // Insert a character into str1
        const deletionDistance: number = distanceMatrix[i][j - 1] + 1; // Delete a character from str1
        const substitutionDistance: number = distanceMatrix[i - 1][j - 1] + substitutionCost; // Substitute a character in str1

        // Choose the minimum distance
        distanceMatrix[i][j] = Math.min(insertionDistance, deletionDistance, substitutionDistance);
      }
    }


    const distance = distanceMatrix[stringOneLength][stringTwoLength];
    const maxLength = Math.max(stringOneLength, stringTwoLength);
    // return similarity (means that the lower the distance the more similar the strings are)
    // E.g. Max length of string is 10 and number of edits is just 2
    // 10 - 2 / 10 = 0.8 // higher score
    // E.g. Max length of string is 10 and number of edits is 7
    // 10 - 7 / 10 = 0.3 // lower score
    return (maxLength - distance) / maxLength
  }
}
