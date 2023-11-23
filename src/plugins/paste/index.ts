import { createPluginFactory, insertText } from '@udecode/plate-common';
import { Path, Transforms } from 'slate';
import { isEnable, addEmptyTextNodeWithDynamicColor, KEY_DYNAMIC_COLOR } from '../dynamic-font-color';
import { DynamicFontColorPlugin } from '../dynamic-font-color/types';
import { isImageUrl } from '../image/utils/isImageUrl';

export const KEY_PASTE_HANDLE = 'paste_handle';

const getValueChild = (value: any, path?: Path) => {
  if (!path) {
    return null;
  }
  let child = value[path[0]];
  for (let i = 1; i < path.length; i++) {
    child = child.children[path[i]];
  }
  return child;
};

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
        editor.insertTextData(event.clipboardData);
      },
    },
  })(val);
};

export { createPasteHandlePlugin };
