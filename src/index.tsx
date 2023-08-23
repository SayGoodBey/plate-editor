import { Plate, PlateProvider, createPlugins, deserializeHtml, parseHtmlDocument } from '@udecode/plate-core';
import { ReactEditor } from 'slate-react';
import { createFontColorPlugin, createFontSizePlugin } from '@udecode/plate-font';
import { Node, Transforms } from 'slate';
import { basicNodesPlugins } from './plugins/basic-nodes/basicNodesPlugins';
import { createLimitCharsPlugin } from './plugins/limit-chars/limitchars';
import { createHighlightHTMLPlugin } from './plugins/serializing-html/HighlightHTML';
import React, { useRef, forwardRef, useEffect } from 'react';
import { createDynamicFontColorPlugin } from './plugins/dynamic-font-color/Index';
import { createPastePlainTextPlugin } from './plugins/paste-plain-text/Index';
import { toArray } from 'lodash';
import { createWordCountPlugin } from './plugins/word-count/Index';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createDndPlugin } from '@udecode/plate-dnd';
import { plateUI } from './common/plateUI';

import styles from './index.module.css';
import { FloatingToolbar } from './components/FloatingToolbar';

const serialize = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

const defaultConfig = {
  maxLength: 2000,
  spellCheck: false,
  style: {
    outline: 'none',
    color: '',
  },
};

interface PlateEditorPropsType {
  placeholder?: string;
  dynamicFontColor?: string;
  autoFocus?: boolean;
  maxLength?: number;
  readOnly?: boolean;
  initialValue?: any;
  fontColor?: string;
  fontSize?: string;
  onHtmlChange?: Function;
  onChange?: Function;
  onLengthChange?: Function;
  onLoaded?: (element: any) => void;
  onResizeContent?: () => void;
  showWordCount?: boolean;
  className?: string; // plate编辑器类名
  rootClassName?: string; // 编辑器根容器类名
}

const PlateEditor = forwardRef<any, PlateEditorPropsType>((props, editorRef) => {
  const elementRef = useRef<any>(null);
  console.log('re-render----------------------------------');
  const config = { ...defaultConfig, ...props };
  const {
    rootClassName = '',
    showWordCount,
    dynamicFontColor,
    onHtmlChange,
    initialValue,
    onLoaded,
    fontColor,
    fontSize,
    onResizeContent,
    ...editableProps
  } = config;
  console.log('props :>> ', props);
  React.useEffect(() => {
    // FIXME: 是否有可能 children[0] 为null
    const element = elementRef.current.children[0];
    console.log(editorRef);
    onLoaded && onLoaded(generateEventHandle(element, editorRef));
  }, []);

  const plugins = createPlugins(
    [
      ...basicNodesPlugins,
      // createDeserializePlugin({
      //   options: {
      //     initialValue: initialValue,
      //   },
      // }) as any,
      createFontColorPlugin({
        options: { color: fontColor },
      }),
      createFontSizePlugin({
        options: { fontSize },
      }),
      createHighlightHTMLPlugin({
        options: {
          onHtmlChange: onHtmlChange,
        },
      }), // 返回html格式的插件
      createWordCountPlugin({
        options: {
          maxLength: editableProps.maxLength,
          showWordCount: showWordCount,
        },
      }),
      createDndPlugin({ options: { enableScroller: true } }),
      createDynamicFontColorPlugin({
        options: {
          dynamicFontColor: dynamicFontColor,
        },
      }),
      createPastePlainTextPlugin(),
      createLimitCharsPlugin({
        options: {
          maxLength: editableProps.maxLength,
        },
      }), // 限制输入长度的插件
    ],
    { components: plateUI },
  );

  const onChangeData = (value: any) => {
    const serializedValue = serialize(value);
    const valueLength = toArray(serializedValue).length;
    const element = elementRef.current.children[0];
    console.log(editorRef);
    editableProps?.onChange?.(value, generateEventHandle(element, editorRef));
    if (editableProps.onLengthChange) {
      editableProps.onLengthChange(valueLength);
    }
    console.log('value', value);
  };
  useEffect(() => {
    const document = parseHtmlDocument(initialValue);
    const fragment = deserializeHtml(editorRef.current, { element: document.body });
    editorRef.current.insertFragment(fragment);
  }, []);

  return (
    <div ref={elementRef} className={`${styles.rootEditor} ${rootClassName}`}>
      <DndProvider backend={HTML5Backend}>
        <PlateProvider editorRef={editorRef} plugins={plugins} onChange={onChangeData}>
          <Plate editableProps={editableProps}>
            {/* https://platejs.org/docs/components/floating-toolbar */}
            <FloatingToolbar>
              <span>xxxxx</span>
              <span>AAAAA</span>
            </FloatingToolbar>
          </Plate>
        </PlateProvider>
      </DndProvider>
    </div>
  );
});

export default PlateEditor;

const generateEventHandle = (element: any, editorRef: any) => {
  return {
    getBody: () => element,
    getContent: () => element.innerHTML,
    setContent: (newValue: string) => {
      Transforms.insertText(editorRef, newValue, { at: [0, 0] });
      // console.log('不再支持 setContent, 通过修改initialValue来实现');
    },
    getDoc() {
      console.log('应该是不需要再支持了');
    },
    on(key: string, callback: any) {
      element.addEventListener(key, callback);
    },
    blur() {
      ReactEditor.blur(editorRef);
    },
    focus() {
      ReactEditor.focus(editorRef);
    },
  };
};
