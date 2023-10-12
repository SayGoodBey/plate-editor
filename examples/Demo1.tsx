import PlateEditor from '../src/index';
import React, { useState, useRef } from 'react';
import { Node } from 'slate';

export default () => {
  const [dynamicFontColor, setDynamicFontColor] = useState('red'); // 设置字体颜色
  const [bgColor, setBgColor] = useState('#fff'); // 设置背景颜色
  const [placeholder, setPlaceholder] = useState(''); // 设置背景颜色
  const [maxLength, setMaxLength] = useState(100); // 设置最大输入长度
  const [readOnly, setReadOnly] = useState(false); // 设置是否只读
  const [styleHeight, setStyleHeight] = useState(''); // 设置边框高度
  const [showWordCount, setShowWordCount] = useState(false); // 设置是否显示字数统计
  const editorRef = useRef<any>();
  const [initialValue, setInitialValue] = useState(
    '<span style="color: #232323;">旧版本写的作业001</span><span style="color: #df3b08;">旧版本批阅</span><span style="color: #232323;"><br />旧版本写的作业01313</span><span style="color: #df3b08;">旧版批阅02</span>',
  );
  // '<p>哈哈<span>XX $\\frac{a}{m}\uff1e\\frac{b}{m}$ XXX </span>哈哈哈</p>'
  //     <p style="color:red"><span style="color:blue">aaaa</span></p>
  //  '<p class="qt_default 333">2020-2021学年江西省南昌市红谷滩区凤凰城上海外国语学校七年级(下)期末数学复习试卷(2)</p><p class="qt_default">试题数:20,总分:0</p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-2"><div class="questionWraper"><p class="qt_title"><span class="title">1.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_splite"></p>',,
  // '<p class="qt_default 333">2020-2021学年江西省南昌市红谷滩区凤凰城上海外国语学校七年级(下)期末数学复习试卷(2)</p><p class="qt_default">试题数:20,总分:0</p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-2"><div class="questionWraper"><p class="qt_title"><span class="title">1.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_splite"></p>',
  // '<p ><span >﻿1.﻿(单选题,0分)下列采用的调查方式正确的是(  )﻿</span></p><img src="https://wsevlf001.eeo.im/upload/files/file01/20230912/00_06_7b1db11-2403-43e6-a754-101ea5a45c7.png" alt="undefined" width="undefined" height="undefined" />',
  // '<p ><span > </span><span >1.</span><span > </span><span >(单选题,0分)下列采用的调查方式正确的是(  )</span><span > </span></p>';
  // '<p ><span >﻿1.﻿(单选题,0分)下列采用的调查方式正确的是(  )﻿</span></p><img src="https://wsevlf001.eeo.im/upload/files/file01/20230912/00_06_7b1db11-2403-43e6-a754-101ea5a45c7.png" alt="undefined" width="undefined" height="undefined" />';
  // '<p style="color: red">12<span style="color: blue;font-size: 18px">AAAA</span><span style="color: green">11111</span><span style="color: yellow">11111</span></p><p style="color: red">wowo<span style="color: blue">3456</span></p><div id="delete" style="color:red">我事要删除的元素</div><p>666667777</p><div id="delete" style="color:red">我事要删除的元素2223232322233</div><div data-uuid="1" class="question delete" style="color:yellow">我事要删除的元素2223232322233</div><div data-uuid="1">舒服撒了发撒发啦是的</div><div class="question" style="color:yellow;position:absolute;bottom:20px;">000090909022222我事要删除的元素2223232322233</div><div data-uuid="2">uuid是2啦啦啦啦啦啦</div>'
  // '<p>123<p><p data-uuid="1" class="question delete" style="color:yellow">我事要删除的元素2223232322233</p><p data-uuid="1" class="question" style="color:yellow;position:absolute;bottom:20px;">000090909022222我事要删除的元素2223232322233</p>',
  // '<p>123<p><p data-uuid="1" id="test" class="question delete" style="color:yellow">我事要删除的元素2223232322233</p><p data-uuid="1" class="question" style="color:yellow;position:absolute;bottom:20px;">000090909022222我事要删除的元素2223232322233</p>',
  const onHtmlChange = (html: string, content: string) => {
    // console.log('html :>> ', html);
    // console.log('content :>> ', content);
    // setInitialValue(html);
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

  const handleFindDomPath = (e) => {
    const { value } = e.target;
    if (!value) return;
    let obj = {};
    value.split(',').forEach((item) => {
      const arr = item.split(':');
      obj[arr[0]] = {
        value: arr[1],
        mode: 'contain',
      };
    });
    console.log('obj :>> ', obj);
    const pathArr = editorRef.current?.findDomPath(obj);
    console.log('pathArr---', pathArr);
  };
  const handleHtmlToSlate = (e) => {
    const { value } = e.target;
    const slateData = editorRef.current?.convertHtmlToSlate(value);
    console.log('slateData---', slateData);
  };

  const replaceDom = (e) => {
    const params = { id: { value: 'jack' } };
    editorRef.current?.replaceDom(params, `<p id="jack">我是要被替换的元素${e.target.value || ''}</p>`);
  };

  const handleSetNodes = () => {
    console.log('editorRef.current--', editorRef.current.children);
    const currentNode = editorRef.current?.locateByKey({ id: { value: 'test' } })?.[0];
    const currentPath = editorRef.current.findPath(currentNode);
    const newAttributes = {
      ...currentNode.attributes,
      class: `${currentNode.attributes?.class || ''} set-node-class`,
    };

    editorRef.current?.setNodes({ attributes: newAttributes }, { at: currentPath });
    console.log('editorRef.current--result', editorRef.current.children);
  };
  const handleFindNode = () => {
    const newRef = editorRef.current?.locateByKey({ id: { value: 'id2' } })[0];

    const currentNode = editorRef.current?.locateByKey({ id: { value: 'test2' } }, newRef)[0];
    console.log('currentNode--', currentNode);
  };
  const handleGetNodeDom = () => {
    const currentNode = editorRef.current?.locateByKey({ id: { value: 'test2' } })[0];
    const reactDom = editorRef.current.getNodeDom(currentNode);
    console.log('reactDom--', reactDom);
    console.log('editorRef.current-----', editorRef.current);
    console.log('text--', editorRef.current?.getNodeText(currentNode));
  };

  const handleTestPath = () => {
    console.log('path', editorRef.current.Path.next([0, 1, 2]));
  };

  return (
    <>
      <PlateEditor
        ref={editorRef}
        showWordCount={showWordCount}
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
      <input
        onBlur={handleFindDomPath}
        placeholder="获取元素path，根据attribute获取"
        style={{ marginRight: '25px', marginTop: '10px' }}
      />
      <input
        onBlur={handleHtmlToSlate}
        placeholder="html字符串转slate数据结构"
        style={{ marginRight: '25px', marginTop: '10px' }}
      />
      <input onBlur={replaceDom} placeholder="html 替换" style={{ marginRight: '25px', marginTop: '10px' }} />
      <button onClick={() => editorRef.current.focus()} style={{ marginRight: '25px', marginTop: '10px' }}>
        focus
      </button>
      <button onClick={() => editorRef.current.blur()} style={{ marginRight: '25px', marginTop: '10px' }}>
        blur
      </button>
      <button onClick={handleSetNodes} style={{ marginRight: '25px', marginTop: '10px' }}>
        setNodes
      </button>
      <button onClick={handleFindNode} style={{ marginRight: '25px', marginTop: '10px' }}>
        findNodes
      </button>
      <button onClick={handleGetNodeDom} style={{ marginRight: '25px', marginTop: '10px' }}>
        GetNodeDomes
      </button>
      <button onClick={handleTestPath} style={{ marginRight: '25px', marginTop: '10px' }}>
        测试调用Path 上的一些方法
      </button>
    </>
  );
};
