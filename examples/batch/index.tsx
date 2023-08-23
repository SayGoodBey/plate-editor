import React, { useRef } from 'react';
import PlateEditor from '../../src/index';
import response from './response.json';

const BatchDemo = () => {
  const editorRef = useRef<any>(null);
  return <PlateEditor ref={editorRef} initialValue={response.data} />;
};

export default BatchDemo;
