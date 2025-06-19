import { readFileSync } from 'fs'
import path from 'path'
import parseFile from './parser.js'
import getFormatter from './formatters/index.js'

const getAbsolutePath = filepath => {
  const absFilePath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(process.cwd(), filepath)
  return absFilePath
}

const readFile = filepath => {
  const absolutePath = getAbsolutePath(filepath)
  try {
    return readFileSync(absolutePath, 'utf-8')
  } catch (error) {
    throw new Error(`Failed to read file: ${filepath}\n${error.message}`)
  }
}

const getFileFormat = filepath => {
  const ext = path.extname(filepath).slice(1)
  if (!ext) throw new Error(`Cannot determine file format: ${filepath}`)
  return ext
}

const loadParsedFiles = (filepath1, filepath2) => {
  const file1 = readFile(filepath1)
  const file2 = readFile(filepath2)
  return [
    parseFile(file1, getFileFormat(filepath1)),
    parseFile(file2, getFileFormat(filepath2)),
  ]
}

const isPlainObject = val =>
  typeof val === 'object' && val !== null && !Array.isArray(val)

const genDiffTree = (original, updated) => {
  const keys = [
    ...new Set([...Object.keys(original), ...Object.keys(updated)]),
  ].sort((a, b) => a.localeCompare(b))
  return keys.map(key => {
    const originalValue = original[key]
    const updatedValue = updated[key]
    const hasOrig = Object.hasOwn(original, key)
    const hasUpd = Object.hasOwn(updated, key)
    if (hasOrig && !hasUpd) {
      return { key, type: 'removed', value: originalValue }
    }
    if (!hasOrig && hasUpd) {
      return { key, type: 'added', value: updatedValue }
    }
    if (isPlainObject(originalValue) && isPlainObject(updatedValue)) {
      return {
        key,
        type: 'nested',
        children: genDiffTree(originalValue, updatedValue),
      }
    }
    if (originalValue !== updatedValue) {
      return {
        key,
        type: 'updated',
        oldValue: originalValue,
        newValue: updatedValue,
      }
    }
    return { key, type: 'unchanged', value: originalValue }
  })
}

const genDiff = (original, updated, format = 'stylish') => {
  const diffTree = genDiffTree(original, updated)
  return getFormatter(format)(diffTree)
}

const normalize = text => text.replace(/\r\n/g, '\n')

export { loadParsedFiles, genDiff, normalize, isPlainObject }
