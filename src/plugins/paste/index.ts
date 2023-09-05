import { createPluginFactory, insertText } from '@udecode/plate-common';
import { Path, Transforms } from 'slate/dist';
import { isEnable, addEmptyTextNodeWithDynamicColor, KEY_DYNAMIC_COLOR } from '../dynamic-font-color';
import { DynamicFontColorPlugin } from '../dynamic-font-color/types';

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

const createPasteHandlePlugin = createPluginFactory({
  key: KEY_PASTE_HANDLE,
  handlers: {
    onPaste: (editor) => (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('=================plain===paste=============');
      const { files } = event.clipboardData;
      if (files.length > 0) {
        // 图片处理
        editor.insertData(event.clipboardData);
        return;
      }
      if (isEnable(editor)) {
        // 动态字体颜色处理
        const { dynamicFontColor } = editor.pluginsByKey[KEY_DYNAMIC_COLOR].options as DynamicFontColorPlugin;
        addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
        insertText(editor, event.clipboardData.getData('text/plain'));
        return;
      }
      console.log('走默认的复制');
      // 之前的默认处理逻辑
      let child = getValueChild(editor.children, editor.selection?.anchor.path);
      const pastedText = event.clipboardData.getData('text/plain');
      Transforms.insertNodes(
        editor as any,
        {
          ...child,
          text: pastedText,
        } as any,
      );
    },
  },
});

export { createPasteHandlePlugin };