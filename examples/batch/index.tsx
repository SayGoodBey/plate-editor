import React, { useEffect, useRef } from 'react';
import PlateEditor from '../../src/index';
import response from './response.json';
import SplitInit from './SplitProblem/split';
import manualSplit from './SplitProblem/manualSplit';
import './index.less';
import mixins_question_dialog from './SplitProblem/mixins_question_dialog';
import mixins_question_error from './SplitProblem/mixins_question_error';
import mixins_question_operation from './SplitProblem/mixins_question_operation';
import { ReactEditor } from 'slate-react';

const { contextToolbarClickHandler } = manualSplit;

const QuestionTypes = ['单选题', '多选题', '填空题', '判断题', '问答题', '综合题'];

const defaultConfig = {
  getParam(type: string) {
    return (
      {
        split_question_type: QuestionTypes,
      }[type] || ''
    );
  },
};

const Toolbar = ({ onItemClick }) => {
  return (
    <div style={{ backgroundColor: 'white' }}>
      {QuestionTypes.map((item, index) => (
        <span key={item} style={{ margin: '0 10px' }} onClick={() => onItemClick(index + 1)}>
          {item}
        </span>
      ))}
    </div>
  );
};

const BatchDemo = () => {
  const editorRef = useRef<any>(null);
  let editor: any = {};
  // console.log(SplitInit);
  SplitInit(defaultConfig, editor);
  const transform = editor.toHTML(response.data);
  window.richML = editor;
  // console.log(transform);
  const renderQuestion = () => {
    let mixins: any = [mixins_question_dialog, mixins_question_error, mixins_question_operation].reduce((acc, cur) => {
      const { data, methods } = cur;
      if (data) {
        return { ...acc, ...data(), ...methods };
      }
      return { ...acc, ...methods };
    }, {});
    mixins.initComputed = {
      split_question_type: QuestionTypes,
    };
    setTimeout(() => {
      mixins.renderQuestion();
    }, 1000);
  };

  const onItemClick = (type: number) => {
    const result = getSelectedDOM(editorRef.current);

    // const result = ReactEditor.toDOMNode(editorRef.current, editorRef.current.selection);
    // console.log('result :>> ', result);
    // focusEditor(editorRef.current, editorRef.current.selection);
    // const result = Editor.string(editorRef.current, editorRef.current.selection);
    // console.log(result);
    // console.log(Editor.node(editorRef.current, editorRef.current.selection));
    // console.log(window.getSelection());
    // console.log(window.getSelection()?.getRangeAt(0).cloneContents());
    contextToolbarClickHandler(editorRef.current, type, result);
    renderQuestion();
  };

  return (
    <div>
      <div id="tinymce-editor">
        <PlateEditor
          ref={editorRef}
          rootId="tinymce-editor-wrapper"
          initialValue={transform}
          onLoaded={renderQuestion}
          toolbar={<Toolbar onItemClick={onItemClick} />}
        />
      </div>
    </div>
  );
};

export default BatchDemo;

// 获取选中范围的 DOM 元素
function getSelectedDOM(editor) {
  const { selection } = editor;
  console.log(selection);
  if (selection) {
    const domSelection = ReactEditor.toDOMRange(editor, selection);

    let div = document.createElement('div');
    div.appendChild(domSelection.cloneContents());

    return div.innerHTML;
  }
  return null;
}
