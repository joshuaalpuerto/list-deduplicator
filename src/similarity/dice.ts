import { Similarity } from './types'

/**
 * Dice coefficient is a measure of the similarity between two strings. 
 * It is defined as twice the number of common bigrams divided by the total number of bigrams in both strings.
 * 
 * @example
 * const dice = new Dice();
 * const similarity = dice.similarity('hello', 'hello');
 * console.log(similarity); // 1
 */
export default class Dice implements Similarity<string> {
  public similarity(str1: string, str2: string): number {
    // Handle edge cases
    if (str1 === str2) return 1;
    if (str1.length === 0 && str2.length === 0) return 1;
    if (str1.length < 2 || str2.length < 2) return 0;

    // Convert to lowercase for case-insensitive comparison
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // Generate bigrams
    const bigrams1 = this.getBigrams(s1);
    const bigrams2 = this.getBigrams(s2);

    // Calculate intersection
    const intersection = this.getIntersectionSize(bigrams1, bigrams2);

    // Apply Dice coefficient formula: 2 * |intersection| / (|set1| + |set2|)
    const diceCoefficient = (2 * intersection) / (bigrams1.size + bigrams2.size);

    // Return as decimal between 0-1
    return diceCoefficient;
  }

  private getBigrams(str: string): Map<string, number> {
    const bigrams = new Map<string, number>();
    
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    
    return bigrams;
  }

  private getIntersectionSize(map1: Map<string, number>, map2: Map<string, number>): number {
    let intersection = 0;
    
    for (const [bigram, count1] of map1) {
      const count2 = map2.get(bigram) || 0;
      intersection += Math.min(count1, count2);
    }
    
    return intersection;
  }
}
