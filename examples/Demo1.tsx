import PlateEditor from '../src/index';
import React, { useState, useRef } from 'react';

export default () => {
  const [dynamicFontColor, setDynamicFontColor] = useState(''); // 设置字体颜色
  const [bgColor, setBgColor] = useState('#fff'); // 设置背景颜色
  const [placeholder, setPlaceholder] = useState(''); // 设置背景颜色
  const [maxLength, setMaxLength] = useState(100); // 设置最大输入长度
  const [readOnly, setReadOnly] = useState(false); // 设置是否只读
  const [styleHeight, setStyleHeight] = useState(''); // 设置边框高度
  const [showWordCount, setShowWordCount] = useState(false); // 设置是否显示字数统计
  const editorRef = useRef<any>();
  const [initialValue, setInitialValue] = useState(
    '<p style="color: red">12<span style="color: blue;font-size: 18px">AAAA</span><span style="color: green">11111</span><span style="color: yellow">11111</span></p><p style="color: red">wowo<span style="color: blue">3456</span></p><div id="delete" style="color:red">我事要删除的元素</div><p>666667777</p><div id="delete" style="color:red">我事要删除的元素2223232322233</div><div data-uuid="1" class="question delete" style="color:yellow">我事要删除的元素2223232322233</div><div data-uuid="1" class="question" style="color:yellow">0000909090我事要删除的元素2223232322233</div><div data-uuid="2">uuid是2啦啦啦啦啦啦</div>',
  );

  const onHtmlChange = (html: string, content: string) => {
    console.log('html :>> ', html);
    console.log('content :>> ', content);
  };

  const onChangeValue = (b: any) => {
    // console.log(b, '我返回了JSON的数据结构');
    // const length = editorRef.current?.getWordCount?.();
    // console.log('onChangeValue--', length);
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
    // console.log('length----', length);
  };
  const handleImageCountLength = () => {
    const length = editorRef.current?.getImageCount?.();
    console.log('image--length----', length);
  };

  // 业务手动插入图片
  const handleInput = (e) => {
    editorRef.current?.insertImage?.(e.target.value);
  };
  const uploadImage = (v, files) => {
    return Promise.resolve(
      'https://img0.baidu.com/it/u=3021883569,1259262591&fm=253&fmt=auto&app=120&f=JPEG?w=1140&h=641',
    );
  };

  const handleChangeInitial = () => {
    setInitialValue('<p>哈哈哈哈</p>');
  };

  const handleClear = () => {
    editorRef.current?.clear();
  };

  const handleDeleteDom = () => {
    editorRef.current?.deleteDom({ id: { value: 'delete' } });
  };
  const handleDeleteDom2 = () => {
    editorRef.current?.deleteDom({ 'data-uuid': { value: '1' }, class: { value: 'question', mode: 'contain' } });
  };

  return (
    <>
      <PlateEditor
        ref={editorRef}
        showWordCount
        dynamicFontColor={dynamicFontColor}
        placeholder={placeholder}
        uploadImage={uploadImage}
        autoFocus
        maxLength={maxLength}
        readOnly={readOnly}
        onHtmlChange={onHtmlChange}
        onChange={onChangeValue}
        onLoaded={onLoaded}
        onResizeContent={onResizeContent}
        initialValue={initialValue}
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
      <button onClick={handleImageCountLength}>获取当前ImageCountLength</button>
      <input onBlur={handleInput} placeholder="向编辑器插入图片" style={{ marginRight: '25px', marginTop: '10px' }} />
      <button onClick={handleChangeInitial} style={{ marginRight: '25px', marginTop: '10px' }}>
        change initialValue
      </button>
      <button onClick={handleClear} style={{ marginRight: '25px', marginTop: '10px' }}>
        清空编辑器内容
      </button>
      <button onClick={handleDeleteDom} style={{ marginRight: '25px', marginTop: '10px' }}>
        删除指定dom元素
      </button>
      <button onClick={handleDeleteDom2} style={{ marginRight: '25px', marginTop: '10px' }}>
        删除指定dom元素2
      </button>
    </>
  );
};
