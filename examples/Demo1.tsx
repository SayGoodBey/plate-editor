import PlateEditor from '../src/index';
import React, { useState, useRef } from 'react';

export default () => {
  const [dynamicFontColor, setDynamicFontColor] = useState('red'); // 设置字体颜色
  const [bgColor, setBgColor] = useState('#fff'); // 设置背景颜色
  const [placeholder, setPlaceholder] = useState(''); // 设置背景颜色
  const [maxLength, setMaxLength] = useState(100); // 设置最大输入长度
  const [readOnly, setReadOnly] = useState(false); // 设置是否只读
  const [styleHeight, setStyleHeight] = useState(''); // 设置边框高度
  const [showWordCount, setShowWordCount] = useState(false); // 设置是否显示字数统计
  const editorRef = useRef<any>();

  const onHtmlChange1 = (a: any) => {
    // console.log(a, '我返回了HTML的数据结构');
  };

  const onChangeValue = (b: any) => {
    // console.log(b, '我返回了JSON的数据结构');
  };

  const clickColor = (e: any) => {
    setDynamicFontColor(e.target.value);
  };

  const clickPlaceholder = (e: any) => {
    setPlaceholder(e.target.value);
  };

  const clickMaxLength = (e: any) => {
    setMaxLength(Number(e.target.value));
  };

  const clickReadByOnly = () => {
    setReadOnly(!readOnly);
  };

  const clickBgColor = (e: any) => {
    setBgColor(e.target.value);
  };

  const clickStyleHeight = (e: any) => {
    setStyleHeight(e.target.value);
  };

  const clickWordCount = () => {
    setShowWordCount(!showWordCount);
  };
  const onLoaded = (element) => {
    // console.log(element);
    console.log('e.getBody', element.getBody);
    console.log('e.setContent', element.setContent);
    console.log('e.getContent', element.getContent);
    // element.blur();
    console.log('editorRef');
    console.log(editorRef.current);
  };
  const onResizeContent = () => {};

  const handleWordCountLength = () => {
    const length = editorRef.current?.getWordCount?.();
    console.log('length----', length);
  };

  return (
    <>
      <PlateEditor
        ref={editorRef}
        showWordCount={showWordCount}
        dynamicFontColor={dynamicFontColor}
        placeholder={placeholder}
        autoFocus
        maxLength={maxLength}
        readOnly={readOnly}
        onHtmlChange={onHtmlChange1}
        onChange={onChangeValue}
        onLoaded={onLoaded}
        onResizeContent={onResizeContent}
        initialValue={
          '<p style="color: red">12<span style="color: blue">AAAA</span><span style="color: green">11111</span><span style="color: yellow">11111</span></p><p style="color: red">wowo<span style="color: blue">3456</span></p>'
        }
      />
      <input onChange={clickColor} placeholder="改变字体颜色" style={{ marginRight: '25px', marginTop: '10px' }} />
      <input onChange={clickPlaceholder} placeholder="设置占位符" style={{ marginRight: '25px', marginTop: '10px' }} />
      <input
        onBlur={clickMaxLength}
        placeholder="设置最大输入长度"
        style={{ marginRight: '25px', marginTop: '10px' }}
      />
      <input onChange={clickBgColor} placeholder="设置背景色" style={{ marginRight: '25px', marginTop: '10px' }} />
      <input
        onChange={clickStyleHeight}
        placeholder="设置编辑器高度"
        style={{ marginRight: '25px', marginTop: '10px' }}
      />
      <button onClick={clickWordCount} style={{ marginRight: '25px', marginTop: '10px' }}>
        设置是否显示字数统计
      </button>
      <button onClick={clickReadByOnly} style={{ marginRight: '25px', marginTop: '10px' }}>
        设置是否只读
      </button>
      <button onClick={handleWordCountLength}>获取当前wordCountLength</button>
    </>
  );
};
