import { createPluginFactory } from '@udecode/plate-common';
import { isEmpty as isEmptyFn, isDeleteKey, editorIsEmpty, isAndroid } from '../../utils';

export const KEY_EVENT_HANDLE = 'key_event_handle';

export const createKeyEventPlugin = createPluginFactory({
  key: KEY_EVENT_HANDLE,
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
    onKeyDown: (editor) => (event: any) => {
      // android 点击撤销键，点击两次才会触发一次 【【LMS-富文本】新建资料讨论等，安卓，删除一个文字之后，对应的数字未减少，见视频】https://www.tapd.cn/45976096/bugtrace/bugs/view?bug_id=1145976096001115087

      if (isAndroid && event.key === 'Backspace') {
        setTimeout(() => {
          console.log('触发了自动change---------------');
          editor.onChange();
        }, 10);
      }
    },
  },
});
