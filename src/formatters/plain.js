const isPlainObject = (val) => typeof val === 'object' && val !== null && !Array.isArray(val);

const formatValue = (val) => {
  if (isPlainObject(val)) return '[complex value]';
  if (typeof val === 'string' && val !== 'false' && val !== 'true') return `'${val}'`;
  return val;
};

const makePath = (parent, key) => `${parent}${key}`;

const formatPlain = (tree, parent = '') => {
  const lines = tree
    .filter(({ type }) => type !== 'unchanged')
    .flatMap((node) => {
      const { key, type } = node;
      const val = formatValue(node.value);
      const newVal = formatValue(node.newValue);
      const oldVal = formatValue(node.oldValue);
      const path = makePath(parent, key);

      switch (type) {
        case 'added':
          return `Property '${path}' was added with value: ${val}`;
        case 'removed':
          return `Property '${path}' was removed`;
        case 'unchanged':
          return `Property '${path}' was unchanged`;
        case 'updated':
          return `Property '${path}' was updated. From ${oldVal} to ${newVal}`;
        case 'nested':
          return `${formatPlain(node.children, `${path}.`)}`;
        default:
          throw new Error(`Unknown node type: ${type}`);
      }
    });
  return lines.join('\n');
};

export default formatPlain;
