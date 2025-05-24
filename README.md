# string-similarity-ts

A Toolkit for String Similarity

`string-similarity-ts` is a Node.js library and command-line tool designed to identify and group similar items from a given list of strings. This repository showcases and exposes multiple types of string similarity algorithms and vectorization techniques, making it a practical reference for deduplication, fuzzy matching, and as a reusable library for your own projects.

**Use cases:**
- Deduplicating lists of company names, product titles, or other textual data
- Handling variations in spelling, legal suffixes, or non-essential terms
- Exploring, comparing, and integrating different similarity algorithms into your own applications

## Prerequisites

* Node.js (see `package.json` for version, e.g., >=18.19)
* pnpm (or npm/yarn; `pnpm-lock.yaml` is provided)

## Installation

1. Clone the repository or download the project files.
2. Navigate to the project directory:
    ```bash
    cd string-similarity-ts
    ```
3. Install dependencies using pnpm:
    ```bash
    pnpm install
    ```
    (Or use `npm install` or `yarn install`)

## Similarity Methods Exposed

This repository demonstrates and will expose several approaches to string similarity for direct use in your own projects:

### 1. Cosine Similarity (with TF-IDF Vectorization)
- **Default method used in the main scripts.**
- Each string is tokenized, normalized, and vectorized using TF-IDF.
- Cosine similarity is computed between vectors to determine group membership.
- Well-suited for longer texts or when word overlap is important.

### 2. Levenshtein Distance
- Measures the minimum number of single-character edits required to change one string into another.
- Useful for catching typos or small spelling variations.
- Provided as a module (`src/similarity/levenshtien.ts`) and can be integrated into grouping logic or used directly in your code.

### 3. Jaccard Similarity
- Measures the overlap between sets of tokens (intersection over union).
- Useful for comparing sets of words or features.
- Provided as a module (`src/similarity/jaccard.ts`).

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests for new similarity methods, optimizations, or documentation improvements.