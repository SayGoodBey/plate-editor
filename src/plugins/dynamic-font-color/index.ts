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
  editor.addMark('color', color);
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
  },

  withOverrides: (editor) => {
    const { apply } = editor;
    const { dynamicFontColor } = (editor.pluginsByKey[KEY_DYNAMIC_COLOR]?.options as DynamicFontColorPlugin) || {};

    editor.apply = (operation) => {
      let newOperation = { ...operation };
      try {
        if (operation.type === 'insert_node') {
          newOperation.node.color = dynamicFontColor;
        }
        if (operation.type === 'insert_text') {
          newOperation.color = dynamicFontColor;
        }
      } catch (e) {
        console.log('修改op失败：', e);
      }
      apply(newOperation);
    };

    return editor;
  },
});

export { createDynamicFontColorPlugin };
