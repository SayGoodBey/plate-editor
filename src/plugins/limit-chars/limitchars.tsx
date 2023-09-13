import { createPluginFactory } from '@udecode/plate-common';
import { Editor, Node, Transforms, Text, Path } from 'slate';
import { LimitCharsPlugin } from './types';
import toArray from 'lodash.toarray';

const PLUGIN_KEY_LIMIT_CHARS = 'PLUGIN_KEY_LIMIT_CHARS';

const serialize = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

const getStringLength = (str: string) => toArray(str).length;

const removeAllEmptyNodes = (editor: Editor, path: Path) => {
  let removedLength = 0;
  const removeNode = (editor: Editor, path: Path) => {
    if (path.length === 0) return;
    const node = Node.get(editor, path);
    if (Text.isText(node)) {
      console.log('remove node', path);
      Transforms.removeNodes(editor, { at: path });
      removedLength += getStringLength(node.text);
      removeNode(editor, Path.parent(path));
    } else {
      if (node.children.length === 1 && Text.isText(node.children[0]) && node.children[0].text === '') {
        console.log('remove node', path);
        Transforms.removeNodes(editor, { at: path });
        removedLength++;
        removeNode(editor, Path.parent(path));
      }
    }
  };
  removeNode(editor, path);
  return removedLength;
};

// 定义截取函数
const truncateSlateContent = (editor: Editor, maxLength: number) => {
  const currentText = serialize(editor.children);
  const currentTextLength = getStringLength(currentText);
  if (currentTextLength <= maxLength) return;
  const lengthToTruncate = currentTextLength - maxLength;
  console.log('========== truncate start. maxLength: %s ==========', maxLength, lengthToTruncate);
  console.log('editor.children: %o', editor.children);
  let truncatedLength = 0;
  const nodePath: Path = [];
  const truncateNode = (node: Node, index?: number) => {
    console.log('truncateNode. nodePath: %o', nodePath);
    if (index !== undefined) {
      nodePath.push(index);
    }
    if (truncatedLength >= lengthToTruncate) return;
    console.log('need to truncate. truncatedLength: %s, lengthToTruncate: %s', truncatedLength, lengthToTruncate);
    if (Text.isText(node)) {
      console.log('text node');
      const nodeLength = getStringLength(node.text);
      if (truncatedLength + nodeLength >= lengthToTruncate) {
        const nodeLengthToTruncate = lengthToTruncate - truncatedLength;
        console.log(
          'truncate text. text: %s, nodeLength: %s, nodeLengthToTruncate: %s, lengthToTruncate: %s, truncatedLength: %s',
          node.text,
          nodeLength,
          nodeLengthToTruncate,
          lengthToTruncate,
          truncatedLength,
        );
        // nodeLength !== node.text.length 说明node.text中有emoji，此时需要用node.text.length作为总长，来计算offset
        if (nodeLength !== node.text.length) {
          console.log('has emoji');
          Editor.withoutNormalizing(editor, () => {
            // 一个emoji都算为一个可见字符
            // offset表示以可见字符为单位的偏移量
            const offset = nodeLength - nodeLengthToTruncate;
            // truncatedText表示实际需要截取掉的可见字符
            const truncatedText = toArray(node.text).slice(offset).join('');
            // truncatedTextLength表示要被截取的字符的实际字符长度。一个emoji可能占多个实际字符长度
            const truncatedTextLength = truncatedText.length;
            console.log(
              'delete text. offset: %s, truncatedText: %s, truncatedTextLength: %s',
              offset,
              truncatedText,
              truncatedTextLength,
            );
            // Transforms.delete方法，需要按照实际字符长度去删除
            Transforms.delete(editor as any, {
              at: { path: nodePath, offset: node.text.length - truncatedTextLength },
              distance: truncatedTextLength,
            });
          });
        } else {
          Transforms.delete(editor as any, {
            at: { path: nodePath, offset: nodeLength - nodeLengthToTruncate },
            distance: nodeLengthToTruncate,
          });
        }
        truncatedLength = lengthToTruncate;
      } else {
        const removedLength = removeAllEmptyNodes(editor, nodePath);
        console.log(
          'remove current node. nodeLength: %s, truncatedLength: %s, lengthToTruncate: %s, removedLength: %s',
          nodeLength,
          truncatedLength,
          lengthToTruncate,
          removedLength,
        );
        truncatedLength += removedLength;
      }
    } else {
      console.log('element node');
      for (let i = node.children.length - 1; i >= 0; i--) {
        truncateNode(node.children[i], i);
      }
    }
    nodePath.pop();
  };
  truncateNode(editor as Node);
  console.log('========== truncate end ==========');
};

export const createLimitCharsPlugin = createPluginFactory({
  isElement: false,
  key: PLUGIN_KEY_LIMIT_CHARS,
  useHooks: (editor) => {
    const { maxLength } = editor.pluginsByKey[PLUGIN_KEY_LIMIT_CHARS].options as LimitCharsPlugin;
    truncateSlateContent(editor as Editor, maxLength);
  },
  handlers: {
    onChange: (editor) => (event) => {
      const { maxLength } = editor.pluginsByKey[PLUGIN_KEY_LIMIT_CHARS].options as LimitCharsPlugin;
      truncateSlateContent(editor as Editor, maxLength);
    },
  },
});
