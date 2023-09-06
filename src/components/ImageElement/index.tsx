import React, { useEffect, useState } from 'react';
import { useSelected, useFocused } from 'slate-react';
import { ResizeControls } from './ResizeControls';
type ImageElementProps = { element: any; children: any; attributes: any };
const ImageElement: React.FC<ImageElementProps> = (props: ImageElementProps) => {
  const { attributes, children, element } = props;
  // 'https://wsevlt001.eeo.im'
  const isInline = attributes?.['data-slate-inline'];

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: element.width || 200,
    height: element.height || 100,
  });
  useEffect(() => {
    element.width && setSize({ width: element.width, height: element.height });
  }, [element.width, element.height]);
  const selected = useSelected();
  const focused = useFocused();
  console.log('size :>> ', size);

  const Wrap = isInline ? 'span' : 'div';

  return (
    <Wrap
      {...attributes}
      style={{ position: 'relative', display: 'inline-block', userSelect: 'none', verticalAlign: 'top' }}
    >
      <img width={size.width} height={size.height} src={element.url} alt="图片缺少host" />
      {selected && focused && <ResizeControls element={element} size={size} setSize={setSize} />}
      {children}
    </Wrap>
  );
};

export default ImageElement;
