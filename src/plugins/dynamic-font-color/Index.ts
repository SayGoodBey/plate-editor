/**
 * 动态字体颜色插件
 * 原理是在用户输入内容前，先在当前位置插入一个空的文本节点，颜色为指定的dynamicFontColor
 * slate在内容改变时，会自动的执行normalize操作，将空的文本节点合并到前后的文本节点中。
 * 因此，插入空文本节点时，需要关闭normalize操作，等用户输入完成后，再开启normalize操作。
 */

import { createPluginFactory, PlateEditor, insertText, isCollapsed } from '@udecode/plate-common';
import { DynamicFontColorPlugin } from './types';
import { Path } from 'slate';
import { isEmpty as isEmptyFn } from '../../utils';

export const KEY_DYNAMIC_COLOR = 'dynamic_font_color';

/**
 * 根据path，获取child
 * @param value
 * @param path
 * @returns
 */
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

let enableNormalizing = true;

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
  return !!dynamicFontColor;
};

const noMetaKey = (event: any) => {
  return !event.metaKey && !event.ctrlKey;
};
const isDeleteKey = (event) => {
  return event.keyCode === 8 || event.keyCode === 46;
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
export const addEmptyTextNodeWithDynamicColor = (editor: PlateEditor, color?: string) => {
  console.log(' editor.selection?.anchor.path--', editor.selection?.anchor.path);
  console.log('editor.children---', editor.children);
  const child = getValueChild(editor.children, editor.selection?.anchor.path);
  const { anchor } = editor.selection;
  const isEmpty = editor.string([]) === '';
  const isParagraphHead = anchor.offset === 0 && anchor.path[1] === 0; // 在段落头部插入中文时，会插入到red zero节点之前，此时，需要插入一个空文本节点
  // 一定要判断当前node的颜色与dynamicFontColor是否不同，否则，会重复插入空文本节点，导致slate报错
  if (child?.color !== color || isEmpty || isParagraphHead) {
    console.log('insert zero');
    setEnableNormalizing(false);
    editor.insertNodes({
      ...child,
      text: '',
      color,
    });
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
    onKeyUp: (editor) => (event: any) => {
      // console.log('isEmptyFn(editor)----', isEmptyFn(editor));
      // 判断内容是空的话删除内容，有一个spanElement placeholder判定不显示
      if (isEmptyFn(editor)) {
        editor.children = [{ type: 'p', children: [{ text: '' }] }];
        editor.onChange();
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
        addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
        insertText(editor, event.dataTransfer.getData('text/plain'));
      } else if (event.inputType === 'insertText') {
        if (event.data && event.data.trim()) {
          event.isPropagationStopped = () => true;
          event.preventDefault();
          console.log('insertText====');
          addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
          insertText(editor, event.data);
        }
      } else if (event.inputType === 'insertCompositionText') {
        console.log('insertCompositionText', event.data);
        addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
      }
    },
  },

  withOverrides: (editor) => {
    const { normalizeNode, onChange } = editor;

    // 重写normalizeNode方法，根据开关状态，决定是否执行normalize操作
    editor.normalizeNode = (entry) => {
      // console.log('normalizeNode', enableNormalizing);
      if (enableNormalizing) {
        normalizeNode(entry);
      }
    };

    editor.onChange = (...args: any[]) => {
      console.log('DynamicFontColorPlugin-onChange', args);
      onChange(...args);
      setEnableNormalizing(true);
      // 内容改变后，需要手动执行normalize操作
      editor.normalizeNode([editor, []]);
    };
    return editor;
  },
});

export { createDynamicFontColorPlugin };
