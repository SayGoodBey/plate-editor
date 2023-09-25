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

// const StaticMathField = React.lazy(() =>
//   import('react-mathquill').then(({ addStyles, StaticMathField }) => {
//     addStyles();
//     return { default: StaticMathField };
//   }),
// );

// const FormulaElement: React.FC = (props: any) => {
//   const { nodeProps, children } = props;
//   return (
//     <span>
//       <Suspense fallback={nodeProps.content}>
//         <StaticMathField>{nodeProps.content}</StaticMathField>
//       </Suspense>
//       {children}
//     </span>
//   );
// };

export default FormulaElement;
