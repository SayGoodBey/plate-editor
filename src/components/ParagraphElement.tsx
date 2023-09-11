import * as React from 'react';
import { styleStringToObject } from '../utils';

export default (props: any) => {
  const { attributes, nodeProps = {}, children, element } = props;
  // 需要重新整理className, nodeProps里面class 属性报错
  const { class: nodePropsClass = '', style: nodePropsStyle = '', ...restNodeProps } = nodeProps;
  const disposalClassName = Array.from(new Set([element.className, nodePropsClass, props.className])).join(' ');

  // 梳理一下这几个属性的关系
  const reactStyle = styleStringToObject(nodePropsStyle);
  return (
    <p style={reactStyle} {...attributes} className={disposalClassName} {...restNodeProps}>
      {children}
    </p>
  );
};
