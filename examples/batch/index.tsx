import React, { useEffect, useRef } from 'react';
import PlateEditor from '../../src/index';
import response from './response.json';
import SplitInit from './SplitProblem/split';
import './index.less';
import mixins_question_dialog from './SplitProblem/mixins_question_dialog';
import mixins_question_error from './SplitProblem/mixins_question_error';
import mixins_question_operation from './SplitProblem/mixins_question_operation';

const defaultConfig = {
  getParam(type: string) {
    return (
      {
        split_question_type: ['单选题', '多选题', '判断题'],
      }[type] || ''
    );
  },
};

const BatchDemo = () => {
  const editorRef = useRef<any>(null);
  let editor: any = {};
  // console.log(SplitInit);
  SplitInit(defaultConfig, editor);
  const transform = editor.toHTML(response.data);
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
      split_question_type: ['单选题', '多选题', '判断题', '填空题', '简答题', '计算题', '应用题'],
    };
    console.log('mixins :>> ', mixins);
    setTimeout(() => {
      mixins.renderQuestion();
    }, 1000);
  };
  return (
    <div>
      <div id="tinymce-editor">
        <PlateEditor ref={editorRef} initialValue={transform} onLoaded={renderQuestion} />
      </div>
    </div>
  );
};

export default BatchDemo;
