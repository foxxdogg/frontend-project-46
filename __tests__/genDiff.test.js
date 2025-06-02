import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { genDiff, loadParsedFiles } from '../src/lib.js';

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

describe('genDiff flat JSON tests with fixtures', () => {
  const cases = [
    'identical',
    'added',
    'removed',
    'changed',
    'removed_and_added',
    'mixed',
    'sorted_keys',
  ];

  cases.forEach((caseName) => {
    test(`case: ${caseName}`, () => {
      const [original, updated] = loadParsedFiles(
        getFixturePath('file1.json', caseName),
        getFixturePath('file2.json', caseName),
      );
      const expected = fs.readFileSync(
        getFixturePath('expected.txt', caseName),
        'utf-8',
      );
      const received = genDiff(original, updated);
      expect(received.trim().replace(/\r\n/g, '\n')).toBe(
        expected.trim().replace(/\r\n/g, '\n'),
      );
    });
  });
});
