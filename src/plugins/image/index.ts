import { createPluginFactory } from '@udecode/plate-common';
import { ImagePlugin, withImage } from '@udecode/plate-media';

export const ELEMENT_IMAGE = 'img';

/**
 * Enables support for images.
 */
export const createImagePlugin = createPluginFactory<ImagePlugin>({
  key: ELEMENT_IMAGE,
  isElement: true,
  isVoid: true,
  isInline: true,
  withOverrides: withImage,
  then: (editor, { type }) => ({
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'IMG',
        },
      ],
      getNode: (el) => ({
        type,
        url: el.getAttribute('src'),
      }),
    },
  }),
});
