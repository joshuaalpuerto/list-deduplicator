import { Vectorization } from './types'

type Tokenizer = (str: string) => string[]
export default class TFIDFVectorizer implements Vectorization {
  private documents: string[] = []
  public vocab: string[] = []
  public docFreq: Map<string, number> = new Map()
  private tokenizer: Tokenizer
  // Add company name (document) to the list
  public constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer
  }

  public fit(documents: string[]): void {
    this.vocab = []
    this.documents = []
    this.docFreq = new Map()

    for (const doc of documents) {
      const tokens = this.tokenizer(doc)
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

  // pre-compute the TF-IDF vector for each document
  public fit_transform(documents: string[]): number[][] {
    this.fit(documents)
    // we return the vectorized matrix
    return this.documents.map(doc => this.transform(doc))
  }

  // TF-IDF vector for a string
  public transform(text: string): number[] {
    const tokens = this.tokenizer(text)
    const tokenFreq: Record<string, number> = {}

    for (const token of tokens) {
      tokenFreq[token] = (tokenFreq[token] || 0) + 1
    }

    const maxFreq = Math.max(...Object.values(tokenFreq), 1)
    const totalDocs = this.documents.length || 1

    return this.vocab.map(term => {
      // normalize TF base on maxFreq, which produce between 0 and 1.
      // since locality(per document) we only care if the term is present or not
      const tf = (tokenFreq[term] || 0) / maxFreq
      const df = this.docFreq.get(term) || 0
      // Base on our implementation we want common words exist in both document
      // to still contribute to similarity for this task.
      const idf = Math.log((totalDocs + 1) / (df + 1)) + 1
      // hmm should we remove idf and just use tf? (bow + cosine)
      return tf * idf
    })
  }
}
