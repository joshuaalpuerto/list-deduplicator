import { tokenize } from './tokenizer'
import { Vectorization } from './types'

export default class TFIDFVectorizer implements Vectorization {
  private documents: string[] = []
  public vocab: string[] = []
  public docFreq: Map<string, number> = new Map()

  // Add company name (document) to the list
  public constructor(documents: string[]) {
    this.vocab = []
    for (const doc of documents) {
      const tokens = tokenize(doc)
      this.documents.push(doc)

      const uniqueTokens = new Set([...tokens])
      for (const token of uniqueTokens) {
        const docFreq = this.docFreq.get(token) || 0
        this.docFreq.set(token, docFreq + 1)
      }
      this.vocab.push(...tokens)
    }
    this.vocab = Array.from(new Set(this.vocab))
  }

  // TF-IDF vector for a string
  public fit(text: string): number[] {
    const tokens = tokenize(text)
    const tokenFreq: Record<string, number> = {}

    for (const token of tokens) {
      tokenFreq[token] = (tokenFreq[token] || 0) + 1
    }

    const maxFreq = Math.max(...Object.values(tokenFreq), 1)
    const totalDocs = this.documents.length || 1

    return this.vocab.map(term => {
      const tf = (tokenFreq[term] || 0) / maxFreq
      const df = this.docFreq.get(term) || 0
      const idf = Math.log((totalDocs + 1) / (df + 1)) + 1
      return tf * idf
    })
  }
}
