export function serializeHtml(nodes: any[]): string {
  if (!nodes) return '';
  return nodes
    .map((node) => {
      const { type, color, children, text } = node;
      if (text) {
        return `<span ${color ? `style="color: ${color}"` : ''}>${text}</span>`;
      }
      if (type === 'img') {
        const { url, alt, width, height } = node;
        return `<img src="${url}" alt="${alt}" width="${width}" height="${height}" />`;
      }

      return `<${type} ${color ? `style="color: ${color}"` : ''}>${serializeHtml(children)}</${type}>`;
    })
    .join('');
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
