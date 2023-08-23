import React, { useState, useRef } from 'react';
import PlateEditor from '../../src/index';
import response from './response.json';

const BatchDemo = () => {
  return <PlateEditor initialValue={response.data} />;
};

export default BatchDemo;
