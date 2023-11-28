import { createPluginFactory } from '@udecode/plate-common';
import { isEnable, addEmptyTextNodeWithDynamicColor, KEY_DYNAMIC_COLOR } from '../dynamic-font-color';
import { DynamicFontColorPlugin } from '../dynamic-font-color/types';
import { isImageUrl } from '../image/utils/isImageUrl';

export const KEY_PASTE_HANDLE = 'paste_handle';

const createPasteHandlePlugin = (val: { options: { insertImage: boolean } }) => {
  const insertImage = val.options?.insertImage;
  return createPluginFactory({
    key: KEY_PASTE_HANDLE,
    handlers: {
      onPaste: (editor) => (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('=================plain===paste=============');
        const { files } = event.clipboardData;
        const text = event.clipboardData.getData('text/plain');

        // 图片处理 ||  图片url链接 也直接显示图片
        if (files.length > 0 || isImageUrl(text)) {
          if (!insertImage) {
            console.log('quit :>> ');
            return;
          }
          editor.insertData(event.clipboardData);
          return;
        }
        if (isEnable(editor)) {
          // 动态字体颜色处理
          const { dynamicFontColor } =
            (editor.pluginsByKey[KEY_DYNAMIC_COLOR]?.options as DynamicFontColorPlugin) || {};
          addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
        }
        const isSlate = event.clipboardData.getData('application/x-slate-fragment');
        if (isSlate) {
          editor.insertData(event.clipboardData);
        } else {
          editor.insertTextData(event.clipboardData);
        }
      },
    },
  })(val);
};

export { createPasteHandlePlugin };
