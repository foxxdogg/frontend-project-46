import { genDiff } from '../src/lib.js';

describe('genDiff', () => {
  test('returns no changes for equal objects', () => {
    const original = { a: 1 };
    const updated = { a: 1 };
    const expected = '{\n  a: 1\n}';
    expect(genDiff(original, updated)).toBe(expected);
  });

  test('returns empty diff for empty objects', () => {
    const original = {};
    const updated = {};
    const expected = '{\n\n}';
    expect(genDiff(original, updated)).toBe(expected);
  });
});
