import { readFileSync, existsSync } from 'fs';
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
  if (!existsSync(absolutePath)) {
    throw new Error(`File not found: ${filepath}`);
  }
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

const isEmpty = (obj) => obj && Object.keys(obj).length === 0;
const formatLine = (sign, key, value) => `${sign} ${key}: ${value}`;

const genDiff = (original, updated) => {
  if (isEmpty(original) || isEmpty(updated)) {
    const sign = isEmpty(original) ? '+' : '-';
    const entries = isEmpty(original) ? updated : original;
    const sorted = [...Object.entries(entries)].sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    const string = sorted
      .map(([key, value]) => formatLine(sign, key, value))
      .join('\n');
    return `{\n${string}\n}`;
  }

  const keys = [
    ...new Set([...Object.keys(original), ...Object.keys(updated)]),
  ].sort((a, b) => a.localeCompare(b));
  const lines = keys.flatMap((key) => {
    const originalValue = original[key];
    const updatedValue = updated[key];
    const hasOrig = Object.hasOwn(original, key);
    const hasUpd = Object.hasOwn(updated, key);
    if (hasOrig && hasUpd && originalValue === updatedValue) {
      return [formatLine(' ', key, updatedValue)];
    }
    if (hasOrig && hasUpd && originalValue !== updatedValue) {
      return [
        formatLine('-', key, originalValue),
        formatLine('+', key, updatedValue),
      ];
    }
    if (!hasOrig) {
      return [formatLine('+', key, updatedValue)];
    }
    return [formatLine('-', key, originalValue)];
  });
  return `{\n${lines.join('\n')}\n}`;
};

const normalize = (text) => text.trim().replace(/\r\n/g, '\n');

export { loadParsedFiles, genDiff, normalize };
