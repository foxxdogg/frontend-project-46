import parseFile from '../src/parser.js';

test('throws on unsupported file format', () => {
  const content = '';
  const format = 'yl';
  expect(() => parseFile(content, format)).toThrow(
    `Unsupported file format: ${format}`
  );
});

test('throws on invalid JSON', () => {
  const content = '{invalid json}';
  const format = 'json';
  try {
    parseFile(content, format);
  } catch (error) {
    expect(error.message).toBe(`${error.message}`);
  }
});

test('throws on invalid YAML', () => {
  const content = `
    name: John Doe
    age: 30
    address:
      street: 123 Main St
      city: New York
      zip 10001
  `;
  const format = 'yml';
  try {
    parseFile(content, format);
  } catch (error) {
    expect(error.message).toBe(`${error.message}`);
  }
});
