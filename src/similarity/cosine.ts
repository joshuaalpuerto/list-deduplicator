import { Vectorization } from '../vectorizations/types'
import { Similarity } from './types'

export default class Cosine implements Similarity {
  private vectorization: Vectorization

  constructor(vectorization: Vectorization) {
    this.vectorization = vectorization
  }
  
  public similarity(a: string, b: string): number {
    const vectorA = this.vectorization.fit(a)
    const vectorB = this.vectorization.fit(b)

    // Calculate dot product and magnitudes
    let dot = 0, magnitudeA = 0, magnitudeB = 0
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
