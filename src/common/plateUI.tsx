import React from 'react';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import ParagraphElement from '../components/ParagraphElement/Index';
import ImageElement from '../components/ImageElement';
const BlockElement = (props: any) => {
  return (
    <div {...props.attributes} className={props.element.className}>
      {props.children}
    </div>
  );
};

export const plateUI = {
  [ELEMENT_PARAGRAPH]: ParagraphElement,
  [ELEMENT_IMAGE]: ImageElement,
  ['div']: BlockElement,
};
