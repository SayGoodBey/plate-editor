import { createPluginFactory } from '@udecode/plate-common';
import { CustomImagePlugin } from './type';
import { withImage } from './withImage';
import { getImageCount } from '../../utils';
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

    then: (editor, { type }) => {
      // 对外抛出获取图片的个数
      editor.getImageCount = () => getImageCount(editor.children);

      // 对外抛出手动插入图片，图片上传完的链接
      editor.insertImage = (url: string) => {
        const dataTransfer = new DataTransfer();

        dataTransfer.setData('text/plain', url);
        editor.insertData(dataTransfer);
      };

      return {
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
      };
    },
  })(val);
};
