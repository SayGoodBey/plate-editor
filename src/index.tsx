import React, { useRef, forwardRef, useEffect, ReactNode } from 'react';
import { Transforms, Editor, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { Plate, PlateProvider, createPlugins, deserializeHtml, parseHtmlDocument } from '@udecode/plate-core';
import { createFontColorPlugin, createFontSizePlugin } from '@udecode/plate-font';
import {
  basicElementsPlugins,
  createImagePlugin,
  createWordCountPlugin,
  createDynamicFontColorPlugin,
  createPasteHandlePlugin,
} from './plugins';
import { serializeContent, serializeHtml } from './utils';
import { plateUI, FloatingToolbar } from './components';
import styles from './index.module.css';

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
  onHtmlChange?: (html: string, content: string) => void;
  onChange?: Function;
  scrollSelectionIntoView?: () => void;
  onLoaded?: (element: any) => void;
  onResizeContent?: () => void;
  showWordCount?: boolean;
  className?: string; // plate编辑器类名
  rootClassName?: string; // 编辑器根容器类名
  toolbar?: ReactNode;
  rootId?: string; // 编辑器根容器id
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  uploadImage?: (v: string, files: FileList) => Promise<string | ArrayBuffer>;
}

const PlateEditor = forwardRef<any, PlateEditorPropsType>((props, editorRef) => {
  const elementRef = useRef<any>(null);
  const config = { ...defaultConfig, ...props };
  const {
    rootClassName = '',
    rootId = '',
    showWordCount,
    dynamicFontColor,
    onHtmlChange,
    initialValue,
    onLoaded,
    fontColor,
    fontSize,
    onChange,
    toolbar,
    uploadImage,
    onResizeContent,
    ...editableProps
  } = config;
  React.useEffect(() => {
    // FIXME: 是否有可能 children[0] 为null
    const element = elementRef.current.children[0];
    onLoaded && onLoaded(generateEventHandle(element, editorRef.current));
  }, []);

  const plugins = createPlugins(
    [
      ...basicElementsPlugins,
      createImagePlugin({
        options: {
          uploadImage,
          insertNodesOptions: {
            nextBlock: true,
          },
        },
      }),
      createFontColorPlugin({
        options: { color: fontColor },
      }),
      createFontSizePlugin({
        options: { fontSize },
      }),
      createWordCountPlugin({
        options: {
          maxLength: editableProps.maxLength,
          showWordCount: showWordCount,
        },
      }),
      createDynamicFontColorPlugin({
        options: {
          dynamicFontColor,
        },
      }),
      createPasteHandlePlugin(),
    ],
    { components: plateUI },
  );

  const onChangeData = (value: any) => {
    const [element] = elementRef.current.children;
    onChange?.(value, generateEventHandle(element, editorRef.current));
    const data = serializeHtml(editorRef.current.children);
    onHtmlChange &&
      onHtmlChange(serializeHtml(editorRef.current.children), serializeContent(editorRef.current.children));
  };

  const clear = (editorRef) => {
    const initialEditorValue: Node[] = [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ];
    Transforms.removeNodes(editorRef, {
      at: {
        anchor: Editor.start(editorRef, []),
        focus: Editor.end(editorRef, []),
      },
      mode: 'highest',
    });
    Transforms.insertNodes(editorRef, initialEditorValue);
  };

  // initialValue 修改的时候编辑器重新设置初始值
  useEffect(() => {
    clear(editorRef.current);
    if (initialValue) {
      console.log('initialValue===', initialValue);
      const document = parseHtmlDocument(initialValue);
      const fragment = deserializeHtml(editorRef.current, { element: document.body });
      editorRef.current.insertFragment(fragment);
      console.log('fragment :>> ', fragment);
      editorRef.current.insertHtmlText = (text: string) => {
        const result = deserializeHtml(editorRef.current, { element: parseHtmlDocument(text).body });
        editorRef.current.insertFragment(result);
      };
    }

    // editorRef.current.clear = () => clear(editorRef.current);
  }, [initialValue]);
  return (
    <div id={rootId} ref={elementRef} className={`${styles.rootEditor} ${rootClassName}`}>
      <PlateProvider editorRef={editorRef} plugins={plugins} onChange={onChangeData}>
        <Plate editableProps={editableProps}>
          {/* https://platejs.org/docs/components/floating-toolbar */}
          {toolbar && <FloatingToolbar>{toolbar}</FloatingToolbar>}
        </Plate>
      </PlateProvider>
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
