import { createPluginFactory, usePlateEditorRef } from '@udecode/plate-common';
import { Node } from 'slate';
import { toArray } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { WordCountPlugin } from './types';
import * as React from 'react';

const PLUGIN_WORD_COUNT = 'PLUGIN_WORD_COUNT';

const serialize = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

const WordCountElement: FC = (props: any) => {
  const editor = usePlateEditorRef();
  const [value, setValue] = useState<Node[]>([]);
  const [valueLength, setValueLength] = useState(0);
  const { maxLength, showWordCount } = editor.pluginsByKey[PLUGIN_WORD_COUNT].options as WordCountPlugin;
  const { onChange } = editor;

  editor.onChange = (...args) => {
    onChange(...args);
    setValue(editor.children);
  };

  useEffect(() => {
    if (!value) return;
    const serializedValue = serialize(value);
    setValueLength(toArray(serializedValue).length);
  }, [value]);

  // 当 wordCount 为 true 时才渲染 DOM
  return showWordCount ? (
    <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '12px' }}>
      字数: {valueLength} 最大长度{maxLength}
    </div>
  ) : null;
};

export const createWordCountPlugin = createPluginFactory({
  isElement: false,
  key: PLUGIN_WORD_COUNT,
  renderAfterEditable: (editableProps: any) => {
    return <WordCountElement {...editableProps} />;
  },
});
