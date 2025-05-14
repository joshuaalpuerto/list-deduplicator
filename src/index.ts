import { promises as fs } from 'fs';
import { parseArgs } from 'node:util';
import yoctoSpinner from 'yocto-spinner';
import { stripNonASCII } from './vectorizations/tokenizer';
import TFID from './vectorizations/tfidf';
import Cosine from './similarity/cosine';

async function main() {
  // should accept args from command line
  // npm start -- --inputFile=./data/companies.txt --outputFile=./output.json
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
    console.error('Usage: npm start -- --inputFile=./data/companies.txt --outputFile=./output.json');
    process.exit(1);
  }

  const inputFile = values.inputFile;
  const raw = await fs.readFile(inputFile, 'utf-8');

  // some documents include some non-ascii characters
  // lets remove those for now for simplicity
  const documents = raw.split(/\r?\n/).map(stripNonASCII).map((l => l.trim())).filter(Boolean);

  const groups = [];
  const visited = new Set();

  const spinner = yoctoSpinner({ text: 'Processing: ' }).start();

  // This is O(n^2) complexity so we want to track visited documents and skip them (to avoid going through the same document twice and posibly improve performance)
  // TODO: this is still a very slow implementation specially with large set of documents
  // but if this is just a script for backoffice it should be fine
  for (let i = 0; i < documents.length; i++) {
    if (visited.has(i)) continue;

    const group = [documents[i]];
    visited.add(i);

    for (let j = i + 1; j < documents.length; j++) {
      if (visited.has(j)) continue;
      const bagOfWords = [documents[i], documents[j]];
      // Ideally this should be instantiated once and reused with pre-computed vocab
      // but that would create a huge sparse vectors and would be memory intensive
      // our goal is to only find how similar the two text to each other.
      // we settle for this approach for now.
      const vectorization = new TFID(bagOfWords);
      const cosine = new Cosine(vectorization);
      const score = cosine.similarity(documents[i], documents[j]);

      if (score >= 0.6) {
        group.push(documents[j]);
        visited.add(j);
      }
    }
    spinner.text = `Processing ${i + 1} of ${documents.length}`;
    groups.push(group);
  }
  spinner.stop();
  // // export groups to json file
  await fs.writeFile(values.outputFile, JSON.stringify(groups, null, 2));

}

main().catch(err => {
  console.error(err);
  process.exit(1);
});



