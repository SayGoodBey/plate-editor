import { parseHtmlDocument } from '@udecode/plate-common';

let emptySpan = /<span .*>(\s|\uFEFF)*<\/span>/g; // 删除空的span标签，可能含有0宽字符
export function serializeHtml(nodes: any[]): string {
  if (!nodes) return '';
  return nodes
    .map((node) => {
      let { type, children, text, attributes = {}, url, color } = node;
      let attributesStr = '';
      if (text && color) {
        if (attributes['style']) {
          attributes['style'] = `${attributes['style']};color:${color};`;
        } else {
          attributes['style'] = `color:${color};`;
        }
      }
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
      if (type === 'formula') {
        return `$${attributes.content}$`;
      }

      return `<${type}  ${attributesStr}>${serializeHtml(children)}</${type}>`;
    })
    .join('')
    .replace(/\n/g, '<br>') // android 不支持/n  粘贴的内容 /n统一转br
    .replace(/\s+/g, '&nbsp;'); // android 空格转nbsp;
}

export function serializeContent(nodes: any[]): string {
  if (!nodes) return '';
  return nodes
    .map((node) => {
      if (node.type === 'p') {
        return `${serializeContent(node.children)}/n`;
      }
      if (node.type === 'formula') {
        return `$${node.attributes.content}$`;
      }
      if (node.text) {
        return node.text;
      }
      return serializeContent(node.children);
    })
    .join('')
    .replace(/\/n$/, ''); // 移除最后一个/n
}

export function parseHtmlStr(text: string) {
  return parseHtmlDocument(text.replace(/\$(.*?)\$/g, '<formula content="$1"></formula>'));
}
