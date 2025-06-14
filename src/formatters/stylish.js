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

export default formatStylish;
