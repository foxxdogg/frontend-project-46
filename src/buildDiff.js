import getFormatter from './formatters/index.js'

const isPlainObject = val => typeof val === 'object' && val !== null && !Array.isArray(val)

const genDiffTree = (original, updated) => {
  const keys = [...new Set([...Object.keys(original), ...Object.keys(updated)])].sort((a, b) =>
    a.localeCompare(b),
  )
  return keys.map((key) => {
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

export { genDiff, normalize, isPlainObject }
