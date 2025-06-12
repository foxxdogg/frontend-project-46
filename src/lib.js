import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parser.js';

const getAbsolutePath = (filepath) => {
  const absFilePath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(process.cwd(), filepath);
  return absFilePath;
};

const readFile = (filepath) => {
  const absolutePath = getAbsolutePath(filepath);
  // if (!existsSync(absolutePath)) {
  //   throw new Error(`File not found: ${filepath}`);
  // }
  try {
    return readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file: ${filepath}\n${error.message}`);
  }
};

const getFileFormat = (filepath) => {
  const ext = path.extname(filepath).slice(1);
  if (!ext) throw new Error(`Cannot determine file format: ${filepath}`);
  return ext;
};

const loadParsedFiles = (filepath1, filepath2) => {
  const file1 = readFile(filepath1);
  const file2 = readFile(filepath2);
  return [
    parseFile(file1, getFileFormat(filepath1)),
    parseFile(file2, getFileFormat(filepath2)),
  ];
};

const isPlainObject = (val) => typeof val === 'object' && val !== null && !Array.isArray(val);
const getIndent = (depth, shift = 0) => ' '.repeat(depth * 4 - shift);

const formatValue = (val, depth = 1) => {
  if (!isPlainObject(val)) {
    return String(val);
  }
  const ident = getIndent(depth);
  const bracketIndent = getIndent(depth - 1);
  const lines = Object.entries(val)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => `${ident}${key}: ${formatValue(v, depth + 1)}`);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const genDiffTree = (original, updated) => {
  const keys = [...new Set([...Object.keys(original), ...Object.keys(updated)])].sort(
    (a, b) => a.localeCompare(b),
  );
  return keys.map((key) => {
    const originalValue = original[key];
    const updatedValue = updated[key];
    const hasOrig = Object.hasOwn(original, key);
    const hasUpd = Object.hasOwn(updated, key);
    if (hasOrig && !hasUpd) {
      return { key, type: 'removed', value: originalValue };
    }
    if (!hasOrig && hasUpd) {
      return { key, type: 'added', value: updatedValue };
    }
    if (isPlainObject(originalValue) && isPlainObject(updatedValue)) {
      return {
        key,
        type: 'nested',
        children: genDiffTree(originalValue, updatedValue),
      };
    }
    if (originalValue !== updatedValue) {
      return {
        key,
        type: 'updated',
        oldValue: originalValue,
        newValue: updatedValue,
      };
    }
    return { key, type: 'unchanged', value: originalValue };
  });
};

const formatStylish = (tree, depth = 1) => {
  const bracketIndent = getIndent(depth - 1);
  const lines = tree.flatMap((node) => {
    const { key, type } = node;
    switch (type) {
      case 'added':
        return `${getIndent(depth, 2)}+ ${key}: ${formatValue(node.value, depth + 1)}`;
      case 'removed':
        return `${getIndent(depth, 2)}- ${key}: ${formatValue(node.value, depth + 1)}`;
      case 'unchanged':
        return `${getIndent(depth, 2)}  ${key}: ${formatValue(node.value, depth + 1)}`;
      case 'updated':
        return [
          `${getIndent(depth, 2)}- ${key}: ${formatValue(node.oldValue, depth + 1)}`,
          `${getIndent(depth, 2)}+ ${key}: ${formatValue(node.newValue, depth + 1)}`,
        ];
      case 'nested':
        return `${getIndent(depth, 2)}  ${key}: ${formatStylish(node.children, depth + 1)}`;
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  });
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const genDiff = (original, updated, format = 'stylish') => {
  const diffTree = genDiffTree(original, updated);
  if (format === 'stylish') return formatStylish(diffTree);
  throw new Error(`Unsupported format: ${format}`);
};

const normalize = (text) => text.replace(/\r\n/g, '\n');

export { loadParsedFiles, genDiff, normalize };
