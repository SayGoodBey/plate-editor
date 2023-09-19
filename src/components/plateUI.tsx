import React from 'react';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_IMAGE } from '@udecode/plate-media';

import ParagraphElement from './ParagraphElement';
import ImageElement from './ImageElement';
import { styleStringToObject } from '../utils/index';
import { FormulaElement } from './MathFormula';

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
      {children.map((child: any) => (child.props?.text ? parseFormula(child) : child))}
    </span>
  );
};

export const plateUI = {
  [ELEMENT_PARAGRAPH]: ParagraphElement,
  [ELEMENT_IMAGE]: ImageElement,
  div: BlockElement,
  span: SpanElement,
};

function parseFormula(child: any) {
  const content = child.props.text?.text;
  const regex = /\$(.*?)\$/g;
  const matches = content.match(regex);
  const fragment = [];
  let lastIndex;
  if (matches) {
    for (const match of matches) {
      let endIndex = content.indexOf(match);
      fragment.push(content.slice(lastIndex, endIndex));
      fragment.push(<FormulaElement content={match.slice(1, -1)} />);
      lastIndex = endIndex + match.length;
    }
    if (lastIndex < content.length - 1) {
      fragment.push(content.slice(lastIndex));
    }
  } else {
    return child;
  }
  return fragment;
}
