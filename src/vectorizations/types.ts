export interface Vectorization {
  transform(text: string): number[]
  fit(documents: string[]): void
  fit_transform(documents: string[]): number[][]
}
