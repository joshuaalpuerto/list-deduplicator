export { default as Cosine } from './similarity/cosine';
export { default as Jaccard } from './similarity/jaccard';
export { default as Levenshtein } from './similarity/levenshtein';
export { default as TFIDFVectorizer } from './vectorizations/tfidf';
export { bag_of_words } from './tokenizers/bag_of_words';

// types
import { Tokenizer } from './tokenizers/types'
import { Vectorization } from './vectorizations/types'
import { Similarity } from './similarity/types'

// export types
export type { Tokenizer, Vectorization, Similarity }
