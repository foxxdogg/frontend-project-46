import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { genDiff, loadParsedFiles, normalize } from '../src/buildDiff.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', 'genDiffCases', 'json', filename);

[
  { ext: 'json', desc: 'JSON' },
  { ext: 'yml', desc: 'YML/YAML' },
].forEach(({ ext, desc }) => {
  describe(`genDiffJson ${desc} tests with fixtures`, () => {
    test('case: json', () => {
      const [original, updated] = loadParsedFiles(
        getFixturePath(`file1.${ext}`),
        getFixturePath(`file2.${ext}`),
      )
      const expected = fs.readFileSync(getFixturePath('expected.txt'), 'utf-8')
      const received = genDiff(original, updated, 'json')
      expect(normalize(received)).toBe(normalize(expected))
    })
  })
})
