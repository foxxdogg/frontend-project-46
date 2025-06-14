import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const getFormatter = (format) => {
  let formatter;
  if (format === 'stylish') {
    formatter = formatStylish;
    return formatter;
  }
  if (format === 'plain') {
    formatter = formatPlain;
    return formatter;
  }
  throw new Error(`Unsupported format ${format}`);
};

export default getFormatter;
