import { createPluginFactory } from '@udecode/plate-core';
import { PlateEditor } from '@udecode/plate-common';
import { createHTMLPlugin } from './types';

const PLUGIN_KEY_HIGHLIGHT_HTML = 'PLUGIN_KEY_HIGHLIGHT_HTML';

interface SlateNode {
  type: string;
  color: string;
  children: SlateText[];
}

interface SlateText {
  text: string;
  color: string;
}

const convertArrayToSlateNodes = (array: {type: string; color: string; children: {text: string; color: string}[]}[]): SlateNode[] => {
  return array.map((item) => ({
    type: item.type,
    color: item.color,
    children: item.children.map(child => ({
      text: child.text,
      color: child.color,
    })),
  }));
};

const serializeHtmlWithColor = (nodes: SlateNode[]): string => {
  return nodes.map(node => {
    const children = node.children.map(child => {
      return `<span ${child.color ? `style="color: ${child.color}"` : ''}>${child.text}</span>`;
    }).join('');

    return `<${node.type} ${node.color ? `style="color: ${node.color}"` : ''}>${children}</${node.type}>`;
  }).join('');
};

export const createHighlightHTMLPlugin = createPluginFactory({
  isElement: true,
  key: PLUGIN_KEY_HIGHLIGHT_HTML,
  withOverrides: (editor: PlateEditor) => {
    const { onChange } = editor;
    editor.onChange = () => {
      // 在调用 onChange 之前先检查所有节点
      if (editor.children.length === 1 && editor.children[0].children[0].text === '') {
        // 所有内容都已删除
        editor.children = [{
          type: 'p',
          color: '',
          children: [{
            text: '',
            color: '',
          }],
        }];
      }

      const { onHtmlChange } = editor.pluginsByKey[PLUGIN_KEY_HIGHLIGHT_HTML].options as createHTMLPlugin;

      if (typeof onHtmlChange === 'function') {
        const nodes = convertArrayToSlateNodes(editor.children as {type: string; color: string; children: {text: string; color: string}[]}[]);
        const html = serializeHtmlWithColor(nodes);
        onHtmlChange(html);
      }

      onChange();
    };

    return editor;
  },
});
