import React from 'react';
import { addStyles, StaticMathField } from 'react-mathquill';

addStyles();

export const FormulaElement: React.FC = (props: any) => {
  const { nodeProps, children } = props;
  return (
    <span>
      <StaticMathField>{nodeProps.content}</StaticMathField>
      {children}
    </span>
  );
};
