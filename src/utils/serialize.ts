let emptySpan = /<span .*>(\s|\uFEFF)*<\/span>/g; // 删除空的span标签，可能含有0宽字符
export function serializeHtml(nodes: any[]): string {
  if (!nodes) return '';
  return (
    nodes
      .map((node) => {
        let { type, children, text, attributes = {}, url } = node;
        let attributesStr = '';
        Object.keys(attributes).forEach((key) => {
          attributesStr = `${attributesStr} ${key}="${attributes[key]}"`.trim();
        });

        if (!type && !text) {
          return '';
        }
        if (text) {
          if (attributesStr) {
            return `<span ${attributesStr}>${text}</span>`;
          }
          return text;
        }
        if (type === 'img') {
          return `<img src="${url}" "/>`;
        }

        return `<${type}  ${attributesStr}>${serializeHtml(children)}</${type}>`;
      })
      .join('')
      // .replace(emptySpan, '')
      .trim()
  );
}

export function serializeContent(nodes: any[]): string {
  if (!nodes) return '';
  return nodes
    .map((node) => {
      if (node.type === 'p') {
        return `${serializeContent(node.children)}/n`;
      }
      if (node.text) {
        return node.text;
      }
      return serializeContent(node.children);
    })
    .join('');
}
