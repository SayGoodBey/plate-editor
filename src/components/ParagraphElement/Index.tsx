import * as React from 'react';

export default (props: any) => {
  return <p style={props.style} {...props.attributes}>{props.children}</p>;
};