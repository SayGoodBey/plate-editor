import React from 'react';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import ParagraphElement from '../components/ParagraphElement/Index';
import ImageElement from '../components/ImageElement';
const BlockElement = (props: any) => {
  const { attributes, nodeProps, children, element } = props;

  return (
    <div {...attributes} {...nodeProps} className={element.className}>
      {children}
    </div>
  );
};

export const plateUI = {
  [ELEMENT_PARAGRAPH]: ParagraphElement,
  [ELEMENT_IMAGE]: ImageElement,
  ['div']: BlockElement,
};
