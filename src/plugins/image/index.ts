import { createPluginFactory } from '@udecode/plate-common';
import { CustomImagePlugin } from './type';
import { withImage } from './withImage';
export const ELEMENT_IMAGE = 'img';

/**
 * 允许配置图片插入方式 inline or block ,默认是block
 */
export const createImagePlugin = (val: { options: CustomImagePlugin }) => {
  const isInline = val.options?.insertNodesOptions ? !val.options?.insertNodesOptions?.nextBlock : false;
  return createPluginFactory<CustomImagePlugin>({
    key: ELEMENT_IMAGE,
    isElement: true,
    isVoid: true,
    isInline,
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
  })(val);
};
