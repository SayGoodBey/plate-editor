import { createPluginFactory, getPluginOptions, usePlateEditorState } from '@udecode/plate-common';
import { Node } from 'slate';
import toArray from 'lodash.toarray';
import { FC, useEffect, useState } from 'react';
import { WordCountPlugin } from './types';
import * as React from 'react';
import styles from './index.module.less';

const PLUGIN_WORD_COUNT = 'PLUGIN_WORD_COUNT';

const serialize = (nodes: Node[]): string => {
  return nodes.map((n) => Node.string(n)).join('\n');
};

const WordCountElement: FC = (props: any) => {
  const editor = usePlateEditorState();
  const [valueLength, setValueLength] = useState(0);
  const { maxLength, showWordCount } = getPluginOptions<WordCountPlugin>(editor, PLUGIN_WORD_COUNT);
  const { onChange } = editor;

  editor.onChange = (...args) => {
    const stringNode = serialize(editor.children);
    const { length } = toArray(stringNode);

    setValueLength(length);

    onChange(...args);
  };
  const wordClass = valueLength > maxLength ? styles['warn-color'] : '';
  // 当 wordCount 为 true 时才渲染 DOM
  return showWordCount ? (
    <div className={styles['word-count']}>
      <span className={wordClass}>{valueLength}</span>/{maxLength}
    </div>
  ) : null;
};

export const createWordCountPlugin = createPluginFactory({
  isElement: false,
  key: PLUGIN_WORD_COUNT,
  renderAfterEditable: (editableProps: any) => {
    return <WordCountElement {...editableProps} />;
  },
  then: (editor) => {
    editor.getWordCount = () => {
      const stringNode = serialize(editor.children);
      const { length } = toArray(stringNode);
      return length;
    };
    return {};
  },
});
