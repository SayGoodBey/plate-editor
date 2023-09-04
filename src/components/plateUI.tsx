import React from 'react';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import ParagraphElement from './ParagraphElement';
import ImageElement from './ImageElement';
const BlockElement = (props: any) => {
  const { attributes, nodeProps, children, element } = props;
  const elementAttr = Object.entries(element).reduce((acc, [key, value]) => {
    if (key.startsWith('data-')) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
  // 梳理一下这几个属性的关系
  return (
    <div {...attributes} {...elementAttr} {...nodeProps} className={element.className}>
      {children}
    </div>
  );
};

export const plateUI = {
  [ELEMENT_PARAGRAPH]: ParagraphElement,
  [ELEMENT_IMAGE]: ImageElement,
  div: BlockElement,
};
