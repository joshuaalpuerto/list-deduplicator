export { default as Cosine } from './similarity/cosine';
export { default as Jaccard } from './similarity/jaccard';
export { default as Levenshtein } from './similarity/levenshtein';
export { default as Dice } from './similarity/dice';
export { default as TFIDFVectorizer } from './vectorizations/tfidf';
export { bagOfWords } from './tokenizers/bag-of-words';
export { basicNormalizer } from './tokenizers/normalizers';

// types
import { Tokenizer } from './tokenizers/types'
import { Vectorization } from './vectorizations/types'
import { Similarity } from './similarity/types'

// export types
export type { Tokenizer, Vectorization, Similarity }
