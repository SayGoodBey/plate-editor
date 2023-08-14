import { createPluginFactory } from '@udecode/plate-common';
import { jsx } from 'slate-hyperscript';

const deserialize = (el: any): any => {
  if (el.nodeType === 3) {
    return jsx('text', {}, el.textContent);
  } else if (el.nodeType !== 1) {
    return null;
  }

  let { nodeName, style } = el;
  const newColor = style.color || '';

  const nodeNameNew = nodeName.toLowerCase();
  switch (nodeNameNew) {
    case 'body':
      const childrenBody = Array.from(el.childNodes)
        .map((childEl) => deserialize(childEl))
        .flat()
        .filter(Boolean);
      return jsx('fragment', {}, childrenBody);
    case 'br':
      return '\n';
    case 'blockquote':
    case 'p':
    case 'a':
      const elementProps = newColor ? { color: newColor } : {};
      const childrenElement = Array.from(el.childNodes)
        .map((childEl) => deserialize(childEl))
        .flat()
        .filter(Boolean);
      return jsx(
        'element',
        {
          type: nodeNameNew === 'a' ? 'link' : nodeNameNew,
          url: nodeNameNew === 'a' ? el.getAttribute('href') : undefined,
          ...elementProps,
        },
        childrenElement,
      );
    case 'span':
      const childrenSpan = Array.from(el.childNodes)
        .map((childEl) => deserialize(childEl))
        .flat()
        .filter(Boolean);
      const spanProps = newColor ? { color: newColor } : {};
      return childrenSpan.length === 1 ? jsx('text', { ...spanProps }, childrenSpan[0]) : childrenSpan;
    default:
      const textProps = newColor ? { color: newColor } : {};
      return jsx('text', { ...textProps }, el.textContent);
  }
};

const HTML_KEY_SERIALIZER = 'HTML_KEY_SERIALIZER';

export const createDeserializePlugin = createPluginFactory({
  isElement: true,
  key: HTML_KEY_SERIALIZER,
  withOverrides: (editor) => {
    const { insertNodes } = editor;
    const { initialValue } = editor.pluginsByKey[HTML_KEY_SERIALIZER].options as any;
    let deserialized;

    if (typeof initialValue === 'string' && initialValue.startsWith('<')) {
      const document = new DOMParser().parseFromString(initialValue, 'text/html');
      deserialized = deserialize(document.body);
    } else {
      deserialized = [jsx('element', { type: 'p' }, [jsx('text', {}, initialValue)])];
    }

    insertNodes(deserialized);
    return editor;
  },
});
