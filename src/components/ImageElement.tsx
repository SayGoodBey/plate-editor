import { usePlateEditorState } from '@udecode/plate-common';
import React from 'react';
import { getImageCount } from '../utils';
type ImageElementProps = { element: any; children: any; attributes: any };
const ImageElement: React.FC<ImageElementProps> = (props: ImageElementProps) => {
  const { attributes, children, element } = props;
  // 'https://wsevlt001.eeo.im'
  const isInline = attributes['data-slate-inline'];

  // 对外抛出获取图片的个数
  const editor = usePlateEditorState();
  editor.getImageCount = () => getImageCount(editor.children);

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
