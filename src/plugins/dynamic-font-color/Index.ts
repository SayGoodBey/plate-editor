/**
 * 动态字体颜色插件
 * 原理是在用户输入内容前，先在当前位置插入一个空的文本节点，颜色为指定的dynamicFontColor
 * slate在内容改变时，会自动的执行normalize操作，将空的文本节点合并到前后的文本节点中。
 * 因此，插入空文本节点时，需要关闭normalize操作，等用户输入完成后，再开启normalize操作。
 */

import { createPluginFactory, PlateEditor, insertText, isCollapsed } from '@udecode/plate-common';
import { DynamicFontColorPlugin } from './types';
import { Path, Transforms, Node } from 'slate/dist';

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

let isComposition = false;
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
const isEnable = (editor: PlateEditor) => {
  const { dynamicFontColor } = editor.pluginsByKey[KEY_DYNAMIC_COLOR].options as DynamicFontColorPlugin;
  return !!dynamicFontColor;
};

const noMetaKey = (event: any) => {
  return !event.metaKey && !event.ctrlKey;
};

/**
 * 插入一个颜色为dynamicFontColor的空文本节点
 * @param editor
 * @param color
 */
const addEmptyTextNodeWithDynamicColor = (editor: PlateEditor, color?: string) => {
  const child = getValueChild(editor.children, editor.selection?.anchor.path);
  console.log('checkChildColor', editor.children, child?.color, color);
  // 一定要判断当前node的颜色与dynamicFontColor是否不同，否则，会重复插入空文本节点，导致slate报错
  if (child?.color !== color) {
    console.log('addEmptyTextNodeWithDynamicColor', child?.color, isCollapsed(editor.selection));
    setEnableNormalizing(false);
    Transforms.insertNodes(
      editor as any,
      {
        ...child,
        text: '',
        color: color,
      } as any,
    );
  }
};

const createDynamicFontColorPlugin = createPluginFactory({
  key: KEY_DYNAMIC_COLOR,
  handlers: {
    onCompositionStart: (editor) => (event: any) => {
      isComposition = true;
      console.log('onCompositionStart', isComposition);
      if (!isEnable(editor)) return;
      const { dynamicFontColor } = editor.pluginsByKey[KEY_DYNAMIC_COLOR].options as DynamicFontColorPlugin;
      // iOS在英文自动联想时，会触发onCompositionStart事件，此时，需要插入一个空文本节点
      addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
    },
    onCompositionEnd: (editor) => (event: any) => {
      isComposition = false;
      console.log('onCompositionEnd', isComposition, event.nativeEvent.data);
      // PC上，onCompositionEnd时，新输入的字符串并没有更新到编辑器的value中，因此，需要手动插入
      // 而在iOS上，onCompositionEnd时，新输入的字符串已经更新到编辑器的value中，因此，需要判断是否需要插入
      // const lengthBefore = valueBeforeComposition.length
      // const currentValue = serialize(editor.children)
      // const lengthAfter = currentValue.length
      // console.log('onCompositionEnd. lengthBefore: %s, lengthAfter: %s, compositionDate: %s', lengthBefore, lengthAfter, event.nativeEvent.data)
      // if (lengthBefore + event.nativeEvent.data.length !== lengthAfter) {
      //   insertText(editor, event.nativeEvent.data)
      // }
    },
    onKeyDown: (editor) => (event: any) => {
      if (!isEnable(editor)) return;
      console.log('onKeyDown', event.key);
      const { dynamicFontColor } = editor.pluginsByKey[KEY_DYNAMIC_COLOR].options as DynamicFontColorPlugin;
      // 当isCollapsed为false时，表示当前有选中的文本，此时，如果直接插入新节点，会导致选中的文本被替换掉
      // event.key.length说明时用户输入了一个字符，需要替换选中的文本，因此，需要插入一个空文本节点
      if (isCollapsed(editor.selection) || (event.key.length === 1 && noMetaKey(event))) {
        // 大部分键盘的keydown事件，都需要插入一个空文本节点
        addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
      }
    },
    onDOMBeforeInput: (editor) => (event: any) => {
      // isPropagationStopped必须要返回true。没有仔细看slate关于这块的处理，但如果不返回true，在iOS自动联想输入时会有问题
      event.isPropagationStopped = () => false;
      if (!isEnable(editor)) return;
      // console.log('onDOMBeforeInput', event.inputType, event.data, event.data.length)
      const { dynamicFontColor } = editor.pluginsByKey[KEY_DYNAMIC_COLOR].options as DynamicFontColorPlugin;
      let child = getValueChild(editor.children, editor.selection?.anchor.path);
      if (event.inputType === 'insertReplacementText') {
        event.isPropagationStopped = () => true;
        const range = event.getTargetRanges();
        // 这部分逻辑，不要修改为先插入空节点，再插入内容的方式。否则在iOS上，输入中文时，光标会有问题
        Transforms.delete(editor as any, {
          at: {
            path: editor.selection?.anchor.path,
            offset: range[0].startOffset,
          } as any,
          distance: range[0].endOffset - range[0].startOffset,
        });
        addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
        insertText(editor, event.dataTransfer.getData('text/plain'));
      } else if (event.inputType === 'insertText') {
        if (event.data && event.data.trim()) {
          event.isPropagationStopped = () => true;
          event.preventDefault();
          addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
          insertText(editor, event.data);
        }
      } else if (event.inputType === 'insertCompositionText') {
      }
    },
    onPaste: (editor) => (event: any) => {
      // if (!isEnable(editor)) return;
      console.log(event);
      console.log(event.clipboardData);
      console.log(event.clipboardData.files);
      console.log('onPaste', event.clipboardData.getData('text/plain'));
      event.preventDefault();
      event.stopPropagation();
      const { dynamicFontColor } = editor.pluginsByKey[KEY_DYNAMIC_COLOR].options as DynamicFontColorPlugin;
      addEmptyTextNodeWithDynamicColor(editor, dynamicFontColor);
      insertText(editor, event.clipboardData.getData('text/plain'));
    },
  },

  // withOverrides: (editor) => {
  //   const { normalizeNode, onChange } = editor;

  //   // 重写normalizeNode方法，根据开关状态，决定是否执行normalize操作
  //   editor.normalizeNode = (entry) => {
  //     if (enableNormalizing) {
  //       normalizeNode(entry);
  //     }
  //   };

  //   editor.onChange = (...args: any[]) => {
  //     onChange(...args);
  //     setEnableNormalizing(true);
  //     // 内容改变后，需要手动执行normalize操作
  //     normalizeNode([editor, []]);
  //   };
  //   return editor;
  // },
});

export { createDynamicFontColorPlugin };
