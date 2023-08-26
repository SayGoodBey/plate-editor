import React from 'react';
type ImageElementProps = { element: any; children: any };
const ImageElement: React.FC<ImageElementProps> = (props: ImageElementProps) => {
  // 'https://wsevlt001.eeo.im'
  return <img src={props.element.url} alt="图片缺少host" />;
};

export default ImageElement;
