const formatJson = tree => {
  const extractChanges = (nodes, parent = '') =>
    nodes
      .filter(({ type }) => type !== 'unchanged')
      .flatMap(node => {
        const { key, type, value, newValue, oldValue, children } = node;
        const fullKey = parent ? `${parent}.${key}` : key;
        switch (type) {
          case 'added':
          case 'removed':
            return { name: fullKey, status: type, value };
          case 'updated':
            return {
              name: fullKey,
              status: type,
              oldValue,
              newValue,
            };
          case 'nested':
            return extractChanges(children, fullKey);
          default:
            throw new Error(`Unknown node type: ${type}`);
        }
      });
  const result = { changes: extractChanges(tree) };
  return JSON.stringify(result, null, 2);
};

export default formatJson;
