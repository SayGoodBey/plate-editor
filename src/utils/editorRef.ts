import { deserializeHtml, parseHtmlDocument } from '@udecode/plate-common';
import { Node, Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
// 在ref 上扩展的方法
export function clear(editorRef: any) {
  const initialEditorValue: Node[] = [
    {
      type: 'p',
      children: [{ text: '' }],
    },
  ];
  Transforms.delete(editorRef, {
    at: {
      anchor: Editor.start(editorRef, []),
      focus: Editor.end(editorRef, []),
    },
  });
  if (editorRef.children?.length === 0) {
    Transforms.insertNodes(editorRef, initialEditorValue);
  }
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
// 根据属性查找node
export function locateByKey(editorRef: any, params: DeleteDomParamsType): any {
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
    if (!attributes[key]) {
      result = false;
      break;
    }

    if (params[key]?.mode === DeleteMode.Contain) {
      const attrValue = attributes[key].split(' ').filter((item) => item);
      if (!attrValue?.includes(params[key].value)) {
        result = false;
        break;
      }
    } else {
      if (attributes[key] !== params[key].value) {
        result = false;
        break;
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

export function replaceDom(editorRef: any, params: DeleteDomParamsType, htmlStr: string) {
  const replacePath = findDomPath(editorRef, params)[0];
  const replaceNode = deserializeHtml(editorRef, { element: parseHtmlDocument(htmlStr).body });
  deleteDom(editorRef, params);
  editorRef.insertNodes(replaceNode, { at: replacePath });
}

export function getSelectedDOM(editorRef: any) {
  const { selection } = editorRef;
  console.log(selection);
  if (selection) {
    const domSelection = ReactEditor.toDOMRange(editorRef, selection);

    let div = document.createElement('div');
    div.appendChild(domSelection.cloneContents());

    return div.innerHTML;
  }
  return null;
}

// 判断编辑器内容为空
export function isEmpty(editorRef: any) {
  const [...node] = Array.from(
    editorRef.nodes({
      at: [],
      mode: 'all',
      match: (n) => editorRef.isVoid(n),
    }),
  );

  const stringText = editorRef.string([]);
  return !stringText && !node.length;
}
