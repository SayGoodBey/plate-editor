import React from 'react';
type ImageElementProps = { element: any; children: any; attributes: any };
const ImageElement: React.FC<ImageElementProps> = (props: ImageElementProps) => {
  const { attributes, children, element } = props;
  console.log('props---', props);
  // 'https://wsevlt001.eeo.im'
  const isInline = attributes['data-slate-inline'];

  const renderImage = isInline ? (
    <span {...attributes}>
      {children}
      <img width={50} src={element.url} alt="图片缺少host" />
    </span>
  ) : (
    <div {...attributes}>
      {children}
      <img width={50} src={element.url} alt="图片缺少host" />
    </div>
  );
  return renderImage;
};

export default ImageElement;
