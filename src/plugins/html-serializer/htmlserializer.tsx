import { createPluginFactory } from '@udecode/plate-common';

const HTML_KEY_SERIALIZER = 'HTML_KEY_SERIALIZER';

export const createDeserializePlugin = createPluginFactory({
  isElement: true,
  isLeaf: true,
  key: HTML_KEY_SERIALIZER,
  deserializeHtml: {
    // attributeNames: ['id', 'class', 'style'],

    getNode(el, node) {
      const attributeNames = el.getAttributeNames();
      const attributes = attributeNames.reduce((acc: any, name: string) => {
        acc[name] = el.getAttribute(name);
        return acc;
      }, {});
      return { attributes, className: el.className, type: el.nodeName.toLowerCase() };
    },
  },
});
