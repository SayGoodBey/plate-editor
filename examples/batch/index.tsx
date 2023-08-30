import React, { useEffect, useRef } from 'react';
import PlateEditor from '../../src/index';
import response from './response.json';
import SplitInit from './SplitProblem/split';
import manualSplit from './SplitProblem/manualSplit';
import './index.less';
import mixins_question_dialog from './SplitProblem/mixins_question_dialog';
import mixins_question_error from './SplitProblem/mixins_question_error';
import mixins_question_operation from './SplitProblem/mixins_question_operation';
import { Editor } from 'slate';
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
    console.log('mixins :>> ', mixins);
    setTimeout(() => {
      mixins.renderQuestion();
    }, 1000);
  };

  const onItemClick = (type: number) => {
    const result = Editor.string(editorRef.current, editorRef.current.selection);

    contextToolbarClickHandler(editorRef.current, type, result);
    renderQuestion();
  };

  return (
    <div>
      <div id="tinymce-editor">
        <PlateEditor
          ref={editorRef}
          initialValue={transform}
          onLoaded={renderQuestion}
          toolbar={<Toolbar onItemClick={onItemClick} />}
        />
      </div>
    </div>
  );
};

export default BatchDemo;
