export interface Vectorization {
  transform(text: string): number[]
  fit_transform(documents: string[]): number[][]
}
