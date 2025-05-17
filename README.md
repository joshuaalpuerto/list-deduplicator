# list-deduplicator

`list-deduplicator` is a Node.js command-line tool designed to identify and group similar items from a given list of strings. This is particularly useful for tasks like deduplicating lists of company names, product titles, or any other textual data where variations in spelling, legal suffixes, or non-essential terms can lead to apparent duplicates.

The script processes an input text file, where each line is considered an item. It then outputs a JSON file containing arrays (groups) of items deemed to be similar to each other.

## How it Works

The deduplication process involves several steps:

1.  **Input Reading**: Reads a list of strings from a specified input file. Each line in the file is treated as a separate document.
2.  **Text Preprocessing**: Each document undergoes a series of normalization steps:
    *   **Non-ASCII Character Removal**: Strips characters that are not standard ASCII.
    *   **Accent Removal**: Converts accented characters to their non-accented counterparts (e.g., "é" becomes "e").
    *   **Normalization**:
        *   Converts text to lowercase.
        *   Replaces common punctuation with spaces.
        *   Removes a predefined list of common legal and business suffixes (e.g., "Inc.", "Ltd.", "Corp", "Technologies", "Group"). This helps in identifying similarities even when such terms differ or are absent.
3.  **Vectorization (TF-IDF)**:
    *   For each pair of documents being compared, a TF-IDF (Term Frequency-Inverse Document Frequency) model is created.
    *   TF-IDF assigns weights to words based on their frequency in a document and their rarity across the set of documents being compared. This helps in highlighting important distinguishing words.
    *   **Note:** In this implementation, the TF-IDF vectorizer is instantiated for each pair of documents, using only those two documents to build the vocabulary. This is different from the typical approach of building a global vocabulary for the entire dataset. This method avoids creating large, sparse vectors and is more memory efficient for pairwise comparison, but may yield slightly different results than a global TF-IDF. See the code comment in `src/index.ts` for more details.
4.  **Similarity Calculation (Cosine Similarity)**:
    *   The TF-IDF vectors of two documents are compared using Cosine Similarity.
    *   Cosine Similarity measures the cosine of the angle between two vectors, providing a score between 0 and 1 that indicates how similar they are. A score closer to 1 means higher similarity.
5.  **Grouping**:
    *   The script iterates through the documents. For each document, it compares it against subsequent documents.
    *   If the Cosine Similarity score between two documents is greater than or equal to a predefined threshold (currently 0.6), they are considered similar and grouped together.
    *   To optimize the process and avoid redundant comparisons, documents that have already been assigned to a group are skipped.
6.  **Output**: The identified groups of similar items are written to a JSON file.

## Directory Structure

```
joshuaalpuerto-list-deduplicator/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── data/                     # (Assumed for input files, e.g., companies.txt)
└── src/
    ├── index.ts              # Main script logic
    ├── similarity/
    │   ├── cosine.ts         # Cosine similarity implementation
    │   └── type.ts           # TypeScript type for similarity measures
    └── vectorizations/
        ├── accents.ts        # Accent removal utility
        ├── tfidf.ts          # TF-IDF vectorization implementation
        ├── tokenizer.ts      # Text tokenization and normalization logic (includes stop words)
        └── type.ts           # TypeScript type for vectorization methods
```

## Prerequisites

*   Node.js (version specified in `package.json` or higher, e.g., >=18.19 for `yocto-spinner`)
*   pnpm (or npm/yarn, though `pnpm-lock.yaml` is provided)

## Installation

1.  Clone the repository or download the project files.
2.  Navigate to the project directory:
    ```bash
    cd joshuaalpuerto-list-deduplicator
    ```
3.  Install dependencies using pnpm:
    ```bash
    pnpm install
    ```
    (If using npm: `npm install`)
    (If using yarn: `yarn install`)

## Usage

The script is run from the command line using Node.js. You need to provide the path to the input file and the desired path for the output JSON file.

```bash
npm start -- --inputFile=<path_to_input_file.txt> --outputFile=<path_to_output_file.json>
```

Or, if using pnpm directly:

```bash
pnpm start -- --inputFile=<path_to_input_file.txt> --outputFile=<path_to_output_file.json>
```

**Example:**

Assuming you have an input file named `companies.txt` in a `data` directory:

```bash
npm start -- --inputFile=./data/companies.txt --outputFile=./output_groups.json
```

This will process `companies.txt`, find similar entries, and save the grouped results into `output_groups.json`. A spinner will indicate progress in the console.

## Contributing
Contributions are welcome!