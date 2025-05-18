import { Similarity } from './types'

/**
 * Cosine similarity is a measure of the similarity between two vectors of data.
 * It is defined as the cosine of the angle between the two vectors.
 * 
 * @example
 * const cosine = new Cosine();
 * const similarity = cosine.similarity([1, 2, 3], [4, 5, 6]);
 * console.log(similarity); // 0.9746318461970762
 */
export default class Cosine implements Similarity<number[]> {
  similarity(vectorA: number[], vectorB: number[]): number {
    // Calculate dot product and magnitudes
    let dot = 0, magnitudeA = 0, magnitudeB = 0;
    for (let i = 0; i < vectorA.length; i++) {
      dot += vectorA[i] * vectorB[i]
      magnitudeA += vectorA[i] * vectorA[i]
      magnitudeB += vectorB[i] * vectorB[i]
    }
    
    const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
    const score =  denominator === 0 ? 0 : dot / denominator
    
    return score
  }
}
