export interface Similarity<T> {
  // The higher the result the more similar the two items are
  similarity(a: T, b: T): number
}
