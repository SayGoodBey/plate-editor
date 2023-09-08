import { Node, Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
// 在ref 上扩展的方法
export function clear(editorRef: any) {
  const initialEditorValue: Node[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];
  Transforms.removeNodes(editorRef, {
    at: {
      anchor: Editor.start(editorRef, []),
      focus: Editor.end(editorRef, []),
    },
    mode: 'highest',
  });
  Transforms.insertNodes(editorRef, initialEditorValue);
}

function* walkPreOrder(node: Node & { children?: Node[] }): any {
  if (!node) return;

  yield node;
  if (!node.children) return;
  for (let child of node.children) {
    yield* walkPreOrder(child);
  }
}
function locateByKey(editorRef: any, [key, value]: string[]): any {
  for (let node of walkPreOrder(editorRef)) {
    const { attributes = {} } = node;
    if (attributes?.[key] === value) {
      return node;
    }
  }
  return null;
}
export function deleteDom(editorRef: any, params: string[]) {
  const nodeByKey = locateByKey(editorRef, params);

  const path = ReactEditor.findPath(editorRef, nodeByKey);

  Transforms.removeNodes(editorRef, {
    at: path,
    voids: true,
  });
}
