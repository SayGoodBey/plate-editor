import { createPlugins } from '@udecode/plate-core';
import { createPluginFactory } from '@udecode/plate-common';
const ELEMENT_DIV = 'div';
const ELEMENT_SPAN = 'span';
const ELEMENT_FORMULA = 'formula';
const ELEMENT_PARAGRAPH = 'p';

export const basicElementsPlugins = createPlugins([
  createPluginFactory({
    key: ELEMENT_PARAGRAPH,
    isElement: true,
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'P',
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
    isInline: true,
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
  createPluginFactory({
    key: ELEMENT_FORMULA,
    isElement: true,
    isInline: true,
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'FORMULA',
        },
      ],
      getNode(el) {
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
