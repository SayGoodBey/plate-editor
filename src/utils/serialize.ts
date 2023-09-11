let emptySpan = /<span .*>(\s|\uFEFF)*<\/span>/g; // 删除空的span标签，可能含有0宽字符
export function serializeHtml(nodes: any[]): string {
  if (!nodes) return '';
  return nodes
    .map((node) => {
      let { type, color, children, text } = node;

      if (type === 'span' && !text && children) {
        return serializeHtml(children);
      }
      if (!type && !text) {
        return '';
      }
      if (text) {
        return `<span ${color ? `style="color: ${color}"` : ''}>${text}</span>`;
      }
      if (type === 'img') {
        const { url, alt, width, height } = node;
        return `<img src="${url}" alt="${alt}" width="${width}" height="${height}" />`;
      }

      if (type === 'paragraph') {
        type = 'p';
      }

      return `<${type} ${color ? `style="color: ${color}"` : ''}>${serializeHtml(children)}</${type}>`;
    })
    .join('')
    .replace(emptySpan, '')
    .trim();
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
