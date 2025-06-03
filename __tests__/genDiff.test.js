import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { genDiff, loadParsedFiles, normalize } from '../src/lib.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename, caseName) => path.join(
  __dirname,
  '..',
  '__fixtures__',
  'genDiffCases',
  caseName,
  filename,
);

const cases = [
  'identical',
  'added',
  'removed',
  'changed',
  'removed_and_added',
  'mixed',
  'sorted_keys',
];

[
  { ext: 'json', desc: 'flat JSON' },
  { ext: 'yml', desc: 'flat YML/YAML' },
].forEach(({ ext, desc }) => {
  describe(`genDiff ${desc} tests with fixtures`, () => {
    cases.forEach((caseName) => {
      test(`case: ${caseName}`, () => {
        const [original, updated] = loadParsedFiles(
          getFixturePath(`file1.${ext}`, caseName),
          getFixturePath(`file2.${ext}`, caseName),
        );
        const expected = fs.readFileSync(
          getFixturePath('expected.txt', caseName),
          'utf-8',
        );
        const received = genDiff(original, updated);
        expect(normalize(received)).toBe(normalize(expected));
      });
    });
  });
});
