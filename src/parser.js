import yaml from 'js-yaml';

const parseFile = (content, format) => {
  const formats = ['json', 'yaml', 'yml'];
  if (!formats.includes(format)) {
    throw new Error(`Unsupported file format: ${format}`);
  }
  if (format === 'json') {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }
  if (format === 'yaml' || format === 'yml') {
    try {
      return yaml.load(content) ?? {};
    } catch (error) {
      throw new Error(`Failed to parse YAML: ${error.message}`);
    }
  }
  throw new Error(`Unsupported or missing file format: ${format}`);
};

export default parseFile;
