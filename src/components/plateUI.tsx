import React from 'react';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import ParagraphElement from './ParagraphElement';
import ImageElement from './ImageElement';
import { styleStringToObject } from '../utils/index';
const BlockElement = (props: any) => {
  const { attributes, nodeProps = {}, children, element } = props;
  const elementAttr = Object.entries(element).reduce((acc, [key, value]) => {
    if (key.startsWith('data-')) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
  // 需要重新整理className, nodeProps里面class 属性报错
  const { class: nodePropsClass = '', style: nodePropsStyle = '', ...restNodeProps } = nodeProps;
  const reactStyle = styleStringToObject(nodePropsStyle);
  const disposalClassName = Array.from(new Set([element.className, nodePropsClass, props.className])).join(' ');

  // 梳理一下这几个属性的关系
  return (
    <div {...attributes} {...elementAttr} {...restNodeProps} className={disposalClassName} style={reactStyle}>
      {children}
    </div>
  );
};

const SpanElement = (props: any) => {
  const { attributes, nodeProps = {}, children, element } = props;
  const elementAttr = Object.entries(element).reduce((acc, [key, value]) => {
    if (key.startsWith('data-')) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
  // 需要重新整理className, nodeProps里面class 属性报错
  const { class: nodePropsClass = '', style: nodePropsStyle = '', ...restNodeProps } = nodeProps;
  const disposalClassName = Array.from(new Set([element.className, nodePropsClass, props.className])).join(' ');

  // 梳理一下这几个属性的关系
  const reactStyle = styleStringToObject(nodePropsStyle);
  return (
    <span {...attributes} {...elementAttr} {...restNodeProps} className={disposalClassName} style={reactStyle}>
      {children}
    </span>
  );
};

export const plateUI = {
  [ELEMENT_PARAGRAPH]: ParagraphElement,
  [ELEMENT_IMAGE]: ImageElement,
  div: BlockElement,
  span: SpanElement,
};
