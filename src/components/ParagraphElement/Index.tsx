import * as React from 'react';

export default (props: any) => {
  return (
    <p style={props.style} {...props.attributes} className={props.element.className}>
      {props.children}
    </p>
  );
};
