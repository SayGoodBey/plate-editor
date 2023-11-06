import React, { useRef, forwardRef, useEffect, ReactNode, useState } from 'react';
import { Node, Path, Text } from 'slate';
import { ReactEditor } from 'slate-react';
import { Plate, PlateProvider, createPlugins, deserializeHtml } from '@udecode/plate-core';
import { createFontColorPlugin, createFontSizePlugin } from '@udecode/plate-font';
import {
  basicElementsPlugins,
  createImagePlugin,
  createWordCountPlugin,
  createDynamicFontColorPlugin,
  createPasteHandlePlugin,
  createKeyUpPlugin,
} from './plugins';
import {
  serializeContent,
  serializeHtml,
  clear,
  deleteDom,
  findDomPath,
  replaceDom,
  getSelectedDOM,
  locateByKey,
  parseHtmlStr,
  isEmpty,
} from './utils';
import { plateUI, FloatingToolbar } from './components';
import './index.css';

const defaultConfig = ({ readOnly }) => {
  const config = {
    maxLength: 2000,
    spellCheck: false,
    style: {
      outline: 'none',
      color: '',
    },
  };
  if (readOnly) {
    config.renderPlaceholder = () => null;
  }
  return config;
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
  insertImage?: boolean;
  uploadImage?: (v: string, files: FileList) => Promise<string | ArrayBuffer>;
  resetInitialValue?: number;
}

const PlateEditor = forwardRef<any, PlateEditorPropsType>((props, editorRef) => {
  const elementRef = useRef<any>(null);
  const config = { ...defaultConfig(props), ...props };
  let {
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
    insertImage,
    onResizeContent,
    resetInitialValue,
    ...editableProps
  } = config;
  useEffect(() => {
    if (dynamicFontColor) {
      window.dynamicFontColor = dynamicFontColor;
    }
  }, [dynamicFontColor]);
  useEffect(() => {
    // FIXME: 是否有可能 children[0] 为null
    const element = elementRef.current.children[0];
    onLoaded && onLoaded(generateEventHandle(element, editorRef.current));
  }, []);

  const [_, setCount] = useState(0);
  const plugins = createPlugins(
    [
      ...basicElementsPlugins,
      createImagePlugin({
        options: {
          uploadImage,
          insertNodesOptions: {
            nextBlock: false,
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
          showWordCount,
        },
      }),
      createDynamicFontColorPlugin({
        options: {
          dynamicFontColor,
        },
      }),

      createPasteHandlePlugin({ options: { insertImage } }),
      createKeyUpPlugin(),
    ].filter((item) => item),
    { components: plateUI },
  );
  const onChangeData = (value: any) => {
    const [element] = elementRef.current.children;
    console.log('编辑器--onchange-----');
    onChange?.(value, generateEventHandle(element, editorRef.current));
    onHtmlChange?.(serializeHtml(editorRef.current.children), serializeContent(editorRef.current.children));
  };

  // initialValue 修改的时候编辑器重新设置初始值,现在更改成不是受控模式，频繁设置同一个初始值后面没生效,此处需要hack;
  useEffect(() => {
    console.log('initialValue=======', initialValue);
    if (initialValue) {
      let fragment = deserializeHtml(editorRef.current, {
        element: parseHtmlStr(initialValue).body,
        stripWhitespace: false,
      });
      if (fragment[0] && Text.isText(fragment[0])) {
        fragment = [{ type: 'p', children: fragment }];
      }
      console.log('fragment :>> ', fragment);
      editorRef.current.children = fragment;
      editorRef.current.onChange();
      const endPoint = editorRef.current.end([]);
      editorRef.current.select(endPoint);
    } else {
      editorRef.current.children = [{ type: 'p', children: [{ text: '' }] }];
      editorRef.current.onChange();
    }
  }, [initialValue, resetInitialValue]);

  useEffect(() => {
    console.log('编辑器重新渲染了-----修改的pluginOptions生效');
    setCount((count) => count + 1);
  }, [showWordCount]);

  // 对外抛出挂载方法
  useEffect(() => {
    editorRef.current.clear = () => clear(editorRef.current); // 清空编辑器内容
    editorRef.current.deleteDom = (params) => deleteDom(editorRef.current, params); // 删除dom

    editorRef.current.findDomPath = (params) => findDomPath(editorRef.current, params); // 获取dom path
    editorRef.current.replaceDom = (params, htmlStr) => replaceDom(editorRef.current, params, htmlStr); // 获取dom path
    editorRef.current.convertHtmlToSlate = (html: string) => {
      // html string to slate data
      return deserializeHtml(editorRef.current, { element: parseHtmlStr(html).body });
    };
    editorRef.current.getSelectedDOM = () => getSelectedDOM(editorRef.current); // 获取选中的dom
    editorRef.current.focus = () => ReactEditor.focus(editorRef.current);
    editorRef.current.blur = () => ReactEditor.blur(editorRef.current);
    editorRef.current.findPath = (node: Node) => ReactEditor.findPath(editorRef.current, node);
    editorRef.current.locateByKey = (params, nodes) => locateByKey(nodes ?? editorRef.current, params); // 查找指定node
    editorRef.current.getNodeDom = (node: Node) => ReactEditor.toDOMNode(editorRef.current, node); // 获取node 对应dom
    editorRef.current.getNodeText = (node: Node) => Node.string(node);
    editorRef.current.Path = Path;
    editorRef.current.isFocused = () => ReactEditor.isFocused(editorRef.current);
  }, []);
  return (
    <div id={rootId} ref={elementRef} className={`rootEditor ${rootClassName}`}>
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
    getContent: () => serializeHtml(editorRef.children),
    getText: () => serializeContent(editorRef.children),
    // setContent: (newValue: string) => {
    //   Transforms.insertText(editorRef, newValue, { at: [0, 0] });
    //   // console.log('不再支持 setContent, 通过修改initialValue来实现');
    // },
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
    getWordCount() {
      return editorRef.getWordCount();
    },
  };
};
