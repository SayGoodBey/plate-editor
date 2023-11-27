/**
 * 动态字体颜色插件
 * 原理是在用户输入内容前，先在当前位置插入一个空的文本节点，颜色为指定的dynamicFontColor
 * slate在内容改变时，会自动的执行normalize操作，将空的文本节点合并到前后的文本节点中。
 * 因此，插入空文本节点时，需要关闭normalize操作，等用户输入完成后，再开启normalize操作。
 */

import { createPluginFactory, PlateEditor, insertText, isCollapsed } from '@udecode/plate-common';
import { DynamicFontColorPlugin } from './types';
import { isDeleteKey } from '../../utils';

export const KEY_DYNAMIC_COLOR = 'dynamic_font_color';

let enableNormalizing = true;

const isWindows = () => {
  return /Win/i.test(navigator.userAgent);
  // return window.navigator.platform.indexOf('Win') > -1;
};

/**
 * normalize 开关。
 * @param enable
 */
const setEnableNormalizing = (enable: boolean) => {
  enableNormalizing = enable;
};

/**
 * 判断是否启用动态字体颜色插件
 * 当设置了dynamicFontColor时，启用
 * @param editor
 * @returns
 */
export const isEnable = (editor: PlateEditor) => {
  const { dynamicFontColor } = (editor.pluginsByKey[KEY_DYNAMIC_COLOR]?.options as DynamicFontColorPlugin) || {};
  return !!dynamicFontColor || window.dynamicFontColor;
};

const noMetaKey = (event: any) => {
  return !event.metaKey && !event.ctrlKey;
};

// 是否是功能键
const isFnKey = (event) => {
  return (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey ||
    event.metaKey ||
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape', 'CapsLock'].includes(event.key)
  );
};

/**
 * 插入一个颜色为dynamicFontColor的空文本节点
 * @param editor
 * @param color
 */
export const addEmptyTextNodeWithDynamicColor = (editor: PlateEditor, color: string) => {
  if (!color) return;
  console.log('try to insert zero');
  setEnableNormalizing(false);
  const { anchor } = editor.selection;

  editor.insertNodes({
    text: '',
    color,
  });

  if (anchor.offset === 0 && anchor.path[1] === 0 && isWindows()) {
    console.log('insert in head ');
    // 在windows上，如果光标在第一个位置，需要插入一个空的文本节点，否则，光标会跳到上一行
    editor.insertNode(
      {
        text: '',
        color,
      },
      { at: [anchor.path[0]] },
    );
  }
};

const createDynamicFontColorPlugin = createPluginFactory({
  key: KEY_DYNAMIC_COLOR,
  handlers: {
    onCompositionStart: (editor) => (event: any) => {
      console.log('onCompositionStart');
      if (!isEnable(editor)) return;
      const { dynamicFontColor } = (editor.pluginsByKey[KEY_DYNAMIC_COLOR]?.options as DynamicFontColorPlugin) || {};
      // iOS在英文自动联想时，会触发onCompositionStart事件，此时，需要插入一个空文本节点
      addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
    },
    onCompositionEnd: (editor) => (event: any) => {
      console.log('onCompositionEnd');
    },
    onKeyDown: (editor) => (event: any) => {
      console.log('onKeyDown');
      if (!isEnable(editor)) return;
      if (isDeleteKey(event)) return;
      if (isFnKey(event)) return;
      const { dynamicFontColor } = (editor.pluginsByKey[KEY_DYNAMIC_COLOR]?.options as DynamicFontColorPlugin) || {};
      // 当isCollapsed为false时，表示当前有选中的文本，此时，如果直接插入新节点，会导致选中的文本被替换掉
      // event.key.length说明时用户输入了一个字符，需要替换选中的文本，因此，需要插入一个空文本节点
      if (isCollapsed(editor.selection) || (event.key.length === 1 && noMetaKey(event))) {
        // 大部分键盘的keydown事件，都需要插入一个空文本节点
        addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
      }
    },
    onDOMBeforeInput: (editor) => (event: any) => {
      console.log('onDOMBeforeInput', event.inputType);

      // isPropagationStopped必须要返回true。没有仔细看slate关于这块的处理，但如果不返回true，在iOS自动联想输入时会有问题
      event.isPropagationStopped = () => false;
      if (!isEnable(editor)) return;
      // console.log('onDOMBeforeInput', event.inputType, event.data, event.data.length)
      const { dynamicFontColor } = (editor.pluginsByKey[KEY_DYNAMIC_COLOR]?.options as DynamicFontColorPlugin) || {};
      // let child = getValueChild(editor.children, editor.selection?.anchor.path);

      if (event.inputType === 'insertReplacementText') {
        event.isPropagationStopped = () => true;
        const range = event.getTargetRanges();
        // 这部分逻辑，不要修改为先插入空节点，再插入内容的方式。否则在iOS上，输入中文时，光标会有问题
        editor.delete({
          at: {
            path: editor.selection?.anchor.path,
            offset: range[0].startOffset,
          } as any,
          distance: range[0].endOffset - range[0].startOffset,
        });
        console.log('insertReplacementText====');
        insertText(editor, event.dataTransfer.getData('text/plain'));
      } else if (event.inputType === 'insertText') {
        if (event.data && event.data.trim()) {
          event.isPropagationStopped = () => true;
          event.preventDefault();
          console.log('insertText====');
          insertText(editor, event.data);
        }
      } else if (event.inputType === 'insertCompositionText') {
        console.log('insertCompositionText', event.data);
      }
    },
  },

  withOverrides: (editor) => {
    const { normalizeNode, onChange } = editor;

    // 重写normalizeNode方法，根据开关状态，决定是否执行normalize操作
    editor.normalizeNode = (entry) => {
      // console.log('normalizeNode', enableNormalizing, entry);
      if (enableNormalizing) {
        normalizeNode(entry);
      }
    };

    editor.onChange = (...args: any[]) => {
      onChange(...args);
      setEnableNormalizing(true);
      // 内容改变后，需要手动执行normalize操作
      normalizeNode([editor, []]);
    };
    return editor;
  },
});

export { createDynamicFontColorPlugin };

// 1. onKeyDown 中文不触发
// 2. 可能插入到零款span里面
// 3. 确认需要插入的地址
