import { Similarity } from './types'

/**
 * Jaccard similarity is a measure of the similarity between two sets of data.
 * It is defined as the size of the intersection of the two sets divided by the size of the union of the two sets.
 * 
 * @example
 * const jaccard = new Jaccard();
 * const similarity = jaccard.similarity(['a', 'b', 'c'], ['b', 'c', 'd']);
 * console.log(similarity); // 0.5
 */
export default class Jaccard implements Similarity<string[]> {
  public similarity(listA: string[], listB: string[]): number {
    // find intersection
    const intersection = listA.filter(value => listB.includes(value));

    // find union
    const union = [...new Set([...listA, ...listB])];

    // return similarity
    return intersection.length / union.length;
  }
}
