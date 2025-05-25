
import { promises as fs } from 'fs';
import { parseArgs } from 'node:util';
import yoctoSpinner from 'yocto-spinner';
import { basicNormalizer, Levenshtein } from '../src/index';

async function main() {
  // should accept args from command line
  // node --loader ts-node/esm demo/levenshtein.ts --inputFile=./data/companies.txt --outputFile=./output.json
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
    console.error('Usage: node --loader ts-node/esm demo/levenshtein.ts --inputFile=./data/companies.txt --outputFile=./output.json');
    process.exit(1);
  }

  const inputFile = values.inputFile;
  const raw = await fs.readFile(inputFile, 'utf-8');


  const documents = raw.split(/\r?\n/).map((l => basicNormalizer(l.normalize('NFKC')))).filter(Boolean);
  const levenshtein = new Levenshtein();


  const groups: string[][] = [];
  const visited: Set<string> = new Set();

  const spinner = yoctoSpinner({ text: 'Processing: ' }).start();

  // This is O(n^2) complexity for worst case scenario but it does not need to compare the same document
  for (let i = 0; i < documents.length; i++) {
    if (visited.has(documents[i])) continue;
    
    visited.add(documents[i]);
    const group: string[] = [documents[i]];

    for (let j = i + 1; j < documents.length; j++) {
      if (visited.has(documents[j])) continue;

      const distance = levenshtein.similarity(documents[i], documents[j]);
      if (distance >= 0.6) {
        visited.add(documents[j]);
        group.push(documents[j]);
      }
    }

    groups.push(group);
    spinner.text = `Processing ${i + 1} of ${documents.length}`;
  }
  spinner.stop();

  // export groups to json file
  await fs.writeFile(values.outputFile, JSON.stringify(groups, null, 2));

}

main().catch(err => {
  console.error(err);
  process.exit(1);
});



