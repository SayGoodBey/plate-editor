import { parseHtmlDocument } from '@udecode/plate-common';

let emptySpan = /<span .*>(\s|\uFEFF)*<\/span>/g; // 删除空的span标签，可能含有0宽字符

const regex = /(<[^>]*>)|([^<]*)/g; // 匹配尖括号内外内容

const replacer = (match, group1, group2) => {
  if (group1) {
    // 尖括号内内容
    return group1;
  } else {
    // 尖括号外内容
    return group2.replace(/\s+/g, '&nbsp;');
  }
};
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
    .replace(regex, replacer); // android 空格转nbsp,标签内的不转换
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
