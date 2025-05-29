import { readFileSync, existsSync } from 'fs';
import path from 'path';

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

const parseFile = (content, format) => {
  if (format === 'json') {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }
  throw new Error(`Unsupported file format: ${format}`);
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

export default loadParsedFiles;
