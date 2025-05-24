
import { promises as fs } from 'fs';
import { parseArgs } from 'node:util';
import yoctoSpinner from 'yocto-spinner';
import { bag_of_words, TFIDFVectorizer, Cosine } from '../src/index';

async function main() {
  // should accept args from command line
  // node --loader ts-node/esm demo/tf-idf_cosine_similarity.ts --inputFile=./data/companies.txt --outputFile=./output.json
  const { values } = parseArgs({
    args: process.argv.slice(2), options: {
      inputFile: {
        type: "string",
      },
      outputFile: {
        type: "string",
      },
    },
    strict: true
  });

  if (!values.inputFile || !values.outputFile) {
    console.error('Usage: node --loader ts-node/esm demo/tf-idf_cosine_similarity.ts --inputFile=./data/companies.txt --outputFile=./output.json');
    process.exit(1);
  }

  const inputFile = values.inputFile;
  const raw = await fs.readFile(inputFile, 'utf-8');

  const documents = raw.split(/\r?\n/).map((l => l.trim())).filter(Boolean);
  const vectorizer = new TFIDFVectorizer(bag_of_words);
  // lear the vocabularty
  vectorizer.fit(documents);
  const cosine = new Cosine();


  const grouped: Map<string, {
    vector: number[],
    matched: string[]
  }> = new Map();

  const spinner = yoctoSpinner({ text: 'Processing: ' }).start();

  // This is O(n^2) complexity for worst case scenario but it lessen the amount the number it needs to compare because we are using a map to store the groups
  // this is way faster compared to previous implementation.
  for (let i = 0; i < documents.length; i++) {
    // we don't have any group yet add the first document
    if (grouped.size === 0) {
      grouped.set(documents[i], {
        vector: vectorizer.transform(documents[i]),
        matched: [documents[i]]
      });
    } else {
      const currentDocumentVector = vectorizer.transform(documents[i]);
      // Get the values and keys as arrays
      const currentGroupValues = Array.from(grouped.values());
      const currentGroupKeys = Array.from(grouped.keys());
      let scores: number[] = [];

      for (let j = 0; j < currentGroupValues.length; j++) {
        const score = cosine.similarity(currentGroupValues[j].vector, currentDocumentVector);
        scores.push(score);
      }

      const maxScore = Math.max(...scores);
      // we found match?
      if (maxScore >= 0.6) {
        const index = scores.indexOf(maxScore);
        const document = currentGroupKeys[index]
        grouped.get(document)!.matched.push(documents[i]);
      } else {
        // else add to the group
        grouped.set(documents[i], {
          vector: currentDocumentVector,
          matched: [documents[i]]
        });
      }
    }

    spinner.text = `Processing ${i + 1} of ${documents.length}`;
  }
  spinner.stop();

  const formatted = Array.from(grouped.values()).map(item => item.matched);
  // export groups to json file
  await fs.writeFile(values.outputFile, JSON.stringify(formatted, null, 2));

}

main().catch(err => {
  console.error(err);
  process.exit(1);
});



