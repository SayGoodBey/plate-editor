import { createPluginFactory } from '@udecode/plate-common';
import { isEmpty as isEmptyFn, isDeleteKey, editorIsEmpty } from '../../utils';
export const KEY_UP_HANDLE = 'key_up_handle';
export const createKeyUpPlugin = createPluginFactory({
  key: KEY_UP_HANDLE,
  handlers: {
    onKeyUp: (editor) => (event: any) => {
      // editorIsEmpty(editor) 用来防止没内容删除的时候placeholder 抖动
      // 判断内容是空的话删除内容，有一个spanElement placeholder判定不显示
      if (!isDeleteKey(event)) return;
      if (editorIsEmpty(editor)) return;
      if (isEmptyFn(editor)) {
        console.log('清除编辑器内容----');
        editor?.clear();
      }
    },
  },
});
