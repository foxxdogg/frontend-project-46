import { loadParsedFiles, genDiff as genDiffFromData } from './buildDiff.js'

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const [file1, file2] = loadParsedFiles(filepath1, filepath2)
  return genDiffFromData(file1, file2, format)
}

export default genDiff
