import { Similarity } from './types'

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
