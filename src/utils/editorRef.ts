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

type deleteDomParamsType = Record<string, string>[];

// TODO: 待优化 缺少缓存
function locateByKey(editorRef: any, params: deleteDomParamsType): any {
  const result = [];
  for (let node of walkPreOrder(editorRef)) {
    const { attributes = {} } = node;

    if (isPassCondition(attributes, params)) {
      result.push(node);
    }
  }
  return result;
}

// node attributes 是否满足条件
function isPassCondition(attributes: deleteDomParamsType, params: deleteDomParamsType): boolean {
  let result = true;
  for (let key in params) {
    if (attributes?.[key] !== params[key]) {
      return (result = false);
    }
  }
  return result;
}

function deleteNode(editorRef: any, node: Node): void {
  const path = ReactEditor.findPath(editorRef, node);

  Transforms.removeNodes(editorRef, {
    at: path,
    voids: true,
  });
}
export function deleteDom(editorRef: any, params: deleteDomParamsType) {
  const nodeArr = locateByKey(editorRef, params).reverse();
  nodeArr.forEach((node: Node) => deleteNode(editorRef, node));
}
