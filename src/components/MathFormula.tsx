import React from 'react';
import { addStyles, StaticMathField } from 'react-mathquill';

addStyles();

export const FormulaElement: React.FC<{ content: string }> = ({ content }) => {
  return <StaticMathField>{content}</StaticMathField>;
};
