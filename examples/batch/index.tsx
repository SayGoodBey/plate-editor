import React, { useRef } from 'react';
import PlateEditor from '../../src/index';
import response from './response.json';
import SplitInit from './SplitProblem/split';
import './index.less';

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
  console.log(transform);
  return <PlateEditor ref={editorRef} initialValue={transform} />;
};

export default BatchDemo;
