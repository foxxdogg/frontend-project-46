import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { genDiff, loadParsedFiles, normalize } from '../src/buildDiff.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename, caseName) => path.join(
  __dirname,
  '..',
  '__fixtures__',
  'genDiffCases',
  'nested',
  caseName,
  filename,
)

const cases = [
  'mixed',
  'identical',
  'added',
  'removed',
  'changed',
  'removed_and_added',
  'sorted_keys',
];

[
  { ext: 'json', desc: 'JSON' },
  { ext: 'yml', desc: 'YML/YAML' },
].forEach(({ ext, desc }) => {
  describe(`genDiff ${desc} tests with fixtures`, () => {
    cases.forEach(caseName => {
      test(`case: ${caseName}`, () => {
        const [original, updated] = loadParsedFiles(
          getFixturePath(`file1.${ext}`, caseName),
          getFixturePath(`file2.${ext}`, caseName),
        )
        const expected = fs.readFileSync(
          getFixturePath('expected.txt', caseName),
          'utf-8',
        )
        const received = genDiff(original, updated, 'stylish')
        expect(normalize(received)).toBe(normalize(expected))
      })
    })
  })
})
