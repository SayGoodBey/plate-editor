import { createParagraphPlugin, ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { createPlugins } from '@udecode/plate-core';
import { createPluginFactory } from '@udecode/plate-common';
const ELEMENT_DIV = 'div';
const ELEMENT_SPAN = 'span';

export const basicElementsPlugins = createPlugins([
  createParagraphPlugin({
    deserializeHtml: {
      isElement: true,
      getNode(el, node) {
        const attributeNames = el.getAttributeNames();
        const attributes = attributeNames.reduce((acc: any, name: string) => {
          acc[name] = el.getAttribute(name);
          return acc;
        }, {});
        return { attributes, className: el.className, type: el.nodeName.toLowerCase() };
      },
    },
  }),
  createPluginFactory({
    key: ELEMENT_DIV,
    isElement: true,
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'DIV',
        },
      ],
      getNode(el, node) {
        const attributeNames = el.getAttributeNames();
        const attributes = attributeNames.reduce((acc: any, name: string) => {
          acc[name] = el.getAttribute(name);
          return acc;
        }, {});
        return { attributes, className: el.className, type: el.nodeName.toLowerCase() };
      },
    },
  })(),

  createPluginFactory({
    key: ELEMENT_SPAN,
    isElement: true,
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'SPAN',
        },
      ],
      getNode(el, node) {
        const attributeNames = el.getAttributeNames();
        const attributes = attributeNames.reduce((acc: any, name: string) => {
          acc[name] = el.getAttribute(name);
          return acc;
        }, {});
        return { attributes, className: el.className, type: el.nodeName.toLowerCase() };
      },
    },
  })(),
]);
