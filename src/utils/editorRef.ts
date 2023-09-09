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

enum DeleteMode {
  Equal = 'equal',
  Contain = 'contain',
}
interface DeleteDomParamsType {
  [key: string]: {
    value: string;
    mode?: DeleteMode;
  };
}

// TODO: 待优化 缺少缓存
function locateByKey(editorRef: any, params: DeleteDomParamsType): any {
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
function isPassCondition(attributes: Record<string, string>, params: DeleteDomParamsType): boolean {
  let result = true;
  for (let key in params) {
    if (!attributes[key]) return (result = false);

    if (params[key]?.mode === DeleteMode.Contain) {
      if (!attributes[key]?.includes(params[key].value)) {
        return (result = false);
      }
    } else {
      if (attributes[key] !== params[key].value) {
        return (result = false);
      }
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
export function deleteDom(editorRef: any, params: DeleteDomParamsType) {
  const nodeArr = locateByKey(editorRef, params).reverse();
  nodeArr.forEach((node: Node) => deleteNode(editorRef, node));
}

export function findDomPath(editorRef: any, params: DeleteDomParamsType) {
  const nodeArr = locateByKey(editorRef, params);
  return nodeArr.map((node: Node) => ReactEditor.findPath(editorRef, node));
}
