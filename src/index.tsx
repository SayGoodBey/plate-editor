import {
  Plate,
  PlateProvider,
  createPlugins,
} from '@udecode/plate-core';
import {
  createFontColorPlugin,
} from '@udecode/plate-font';
import { Node } from 'slate';
import { basicNodesPlugins } from './plugins/basic-nodes/basicNodesPlugins';
import { createLimitCharsPlugin } from './plugins/limit-chars/limitchars';
import { createHighlightHTMLPlugin } from './plugins/serializing-html/HighlightHTML';
import {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createDynamicFontColorPlugin } from './plugins/dynamic-font-color/Index';
import { createPastePlainTextPlugin } from './plugins/paste-plain-text/Index';
import { createDeserializePlugin } from '../src/plugins/html-serializer/htmlserializer';
import { toArray } from 'lodash';
import { createWordCountPlugin } from './plugins/word-count/Index';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createDndPlugin } from '@udecode/plate-dnd';
import { plateUI } from './common/plateUI';
import * as React from 'react';


const serialize = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

const EditorContainer: React.FC<{
  style: CSSProperties;
  children: ReactNode;
}> = ({ style, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const editableElement = containerRef.current.querySelector(
        '[contenteditable="true"]',
      );
      if (editableElement && editableElement instanceof HTMLElement) {
        editableElement.style.height = '100%';
      }
    }
  }, [style]);

  return (
    <div ref={containerRef} style={style}>
      {children}
    </div>
  );
};


const EEOEditor: FC<{
  placeholder?: string;
  dynamicFontColor?: string;
  autoFocus?: boolean;
  maxLength?: number;
  readOnly?: boolean;
  initialValue?: any;
  styleHeight?: string;
  styleBgcolor?: string;
  onHtmlChange?: Function;
  onChange?: Function;
  onLengthChange?: Function;
  showWordCount?: boolean;
}> = (props: any) => {
  const plugins = useMemo(
    () => {
      return createPlugins([
        ...basicNodesPlugins,
        createDeserializePlugin({
          options: {
            initialValue: props.initialValue,
          },
        }) as any,
        createFontColorPlugin(),
        createHighlightHTMLPlugin({
          options: {
            onHtmlChange: props.onHtmlChange,
          },
        }), // 返回html格式的插件
        createWordCountPlugin({
          options: {
            maxLength: props.maxLength,
            showWordCount: props.showWordCount,
          },
        }),
        createDndPlugin({ options: { enableScroller: true } }),
        createDynamicFontColorPlugin({
          options: {
            dynamicFontColor: props.dynamicFontColor,
          },
        }),
        createPastePlainTextPlugin(),
        createLimitCharsPlugin({
          options: {
            maxLength: props.maxLength,
          },
        }), // 限制输入长度的插件
      ], { components: plateUI });
    },
    [
      props.dynamicFontColor,
      props.maxLength,
      props.initialValue,
      props.onHtmlChange,
      props.showWordCount,
    ],
  );

  const [editableProps, setEditableProps] = useState({
    spellCheck: false,
    autoFocus: props.autoFocus,
    placeholder: props.placeholders,
    readOnly: props.readOnly,
    style: {
      outline: 'none',
      color: '',
    },
  });

  const onChangeData = (value: any) => {
    const serializedValue = serialize(value);
    const valueLength = toArray(serializedValue).length;
    props.onChange(value);
    if (props.onLengthChange) {
      props.onLengthChange(valueLength);
    }
  };


  useEffect(() => {
    setEditableProps(editableProps => {
      return {
        ...editableProps,
        autoFocus: props.autoFocus,
        placeholder: props.placeholders,
        readOnly: props.readOnly,
      };
    });
  }, [props.autoFocus, props.placeholders, props.readOnly, props.showWordCount]);

  return (
    <EditorContainer
      style={{
        height: `${props.styleHeight}px`,
        backgroundColor: props.styleBgcolor,
        position: 'relative',
        padding: '10px',
        border: '1px solid #ccc',
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <PlateProvider plugins={plugins} onChange={onChangeData}>
          <Plate editableProps={editableProps} />
        </PlateProvider>
      </DndProvider>
    </EditorContainer>
  );
};

export default EEOEditor;
