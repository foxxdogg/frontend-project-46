import yaml from 'js-yaml'
import path from 'path'
import { readFileSync } from 'fs'

const getAbsolutePath = (filepath) => {
  const absFilePath = path.isAbsolute(filepath) ? filepath : path.resolve(process.cwd(), filepath)
  return absFilePath
}

const readFile = (filepath) => {
  const absolutePath = getAbsolutePath(filepath)
  try {
    return readFileSync(absolutePath, 'utf-8')
  }
  catch (error) {
    throw new Error(`Failed to read file: ${filepath}\n${error.message}`)
  }
}

const getFileFormat = (filepath) => {
  const ext = path.extname(filepath).slice(1)
  if (!ext) throw new Error(`Cannot determine file format: ${filepath}`)
  return ext
}

const parseFile = (content, format) => {
  const formats = ['json', 'yaml', 'yml']
  if (!formats.includes(format)) {
    throw new Error(`Unsupported file format: ${format}`)
  }
  if (format === 'json') {
    try {
      return JSON.parse(content)
    }
    catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`)
    }
  }
  if (format === 'yaml' || format === 'yml') {
    try {
      return yaml.load(content) ?? {}
    }
    catch (error) {
      throw new Error(`Failed to parse YAML: ${error.message}`)
    }
  }
  throw new Error(`Unsupported or missing file format: ${format}`)
}

const loadParsedFiles = (filepath1, filepath2) => {
  const file1 = readFile(filepath1)
  const file2 = readFile(filepath2)
  return [parseFile(file1, getFileFormat(filepath1)), parseFile(file2, getFileFormat(filepath2))]
}

export { loadParsedFiles, parseFile }
