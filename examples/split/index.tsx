import React, { useRef, useState } from 'react';

import { Path, Node } from 'slate';
import PlateEditor from '../../src/index';
import { isMinPoint, isEqual } from './utils';
import './index.less';

const EeoEditor = () => {
  const [initialValue, setInitialValue] = useState(
    '<p class="qt_default 333">2020-2021学年江西省南昌市红谷滩区凤凰城上海外国语学校七年级(下)期末数学复习试卷(2)</p><p class="qt_default">试题数:20,总分:0</p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-2"><div class="questionWraper"><p class="qt_title"><span class="title">1.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_split"></p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-3"><div class="questionWraper"><p class="qt_title"><span class="title">2.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_split"></p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-4"><div class="questionWraper"><p class="qt_title"><span class="title">3.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_split"></p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-8"><div class="questionWraper"><p class="qt_title"><span class="title">4.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是444444(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div>',
  );
  const changeToSimpleQuestion = () => {
    setInitialValue(
      '<p class="qt_default 333">2020-2021学年江西省南昌市红谷滩区凤凰城上海外国语学校七年级(下)期末数学复习试卷(2)</p><p class="qt_default">试题数:20,总分:0</p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-2"><div class="questionWraper"><p class="qt_title"><span class="title">1.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_split"></p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-3"><div class="questionWraper"><p class="qt_title"><span class="title">2.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_split"></p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-4"><div class="questionWraper"><p class="qt_title"><span class="title">3.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div><p class="qt_split"></p><div class="question" data-type="1"data-uuid="9087800690433707-1694501106343-8"><div class="questionWraper"><p class="qt_title"><span class="title">4.</span><span class="content">(单选题,0分)下列采用的调查方式正确的是444444(  )</span></p><p class="key key_A"><span class="title">A.</span><span class="content">某企业招聘,对应聘人员的面试,适合采用抽样调查</span></p><p class="key key_B"><span class="title">B.</span><span class="content">为了解全班同学每周体育锻炼的时间,适合采用抽样调查</span></p><p class="key key_C"><span class="title">C.</span><span class="content">为了解某市初二年级学生每天完成作业的用时量,适合采用普查</span></p><p class="key key_D"><span class="title">D.</span><span class="content">神舟十二号飞船发射前,工作人员对其各个零部件安全情况的检查,适合采用普查</span></p></div></div>',
    );
  };
  const changeToCompQuestion = () => {
    setInitialValue(
      '<p class="qt_default">一道综合体</p><p class="qt_default">试题数:2,满分:8</p><div  class="question" data-type="6" data-uuid="7152449211906071-1697454277799-2"><div class="questionWraper"><p class="qt_title"><span class="title">1.</span><span class="content">(问答题,4分)用如图1所示的电路测量一个量程为100μA,内阻约为2000Ω的微安表头的内阻,所用电源的电动势约为12V,有两个电阻箱可选,R<sub>1</sub>(0∼9999.9Ω),R<sub>2</sub>(0∼99999.9Ω)<br class="markdown_return" /></span></p><div class="question" data-type="4" data-uuid="5333575589514932-1697454277799-3"><div class="questionWraper"><p class="qt_title"><span class="title">(1).</span><span class="content">R<sub>M</sub>应选 ___ ,R<sub>N</sub>应选 ___ ;</span></p></div></div><p class="qt_split"></p><div class="question" data-type="5" data-uuid="816433743187433-1697454277799-4"><div class="questionWraper"><p class="qt_title"><span class="title">(2).</span><span class="content">根据电路图,请把实物连线补充完整;<br class="markdown_return" /></span></p></div></div><p class="qt_split"></p><div class="question" data-type="4" data-uuid="7396491214031753-1697454277799-5"><div class="questionWraper"><p class="qt_title"><span class="title">(3).</span><span class="content">下列操作顺序合理排列是:___ 。<br class="markdown_return" /> ① 将变阻器滑动头P移至最左端,将R<sub>N</sub>调至最大值;<br class="markdown_return" /> ② 闭合开关S<sub>2</sub>,调节R<sub>M</sub>,使微安表半偏,并读出R<sub>M</sub>阻值;<br class="markdown_return" /> ③ 断开S<sub>2</sub>,闭合S<sub>1</sub>,调节滑动头P至某位置再调节R<sub>N</sub>使表头满偏;<br class="markdown_return" /> ④ 断开S<sub>1</sub>、S<sub>2</sub>,拆除导线,整理好器材。</span></p></div></div><p class="qt_split"></p><div class="question" data-type="4" data-uuid="7505147051505234-1697454277799-6"><div class="questionWraper"><p class="qt_title"><span class="title">(4).</span><span class="content">如图2是R<sub>M</sub>调节后面板,则待测表头的内阻为 ___ ,该测量值 ___ (大于、小于、等于)真实值。<br class="markdown_return" /></span></p></div></div><p class="qt_split"></p><div class="question" data-type="4" data-uuid="44917625613271217-1697454277799-7"><div class="questionWraper"><p class="qt_title"><span class="title">(5).</span><span class="content">将该微安表改装成量程为2V的电压表后,某次测量指针指在图示位置,则待测电压为 ___ V(保留三位有效数字)。<br class="markdown_return" /></span></p></div></div><p class="qt_split"></p><div class="question" data-type="4" data-uuid="9007489547916627-1697454277799-8"><div class="questionWraper"><p class="qt_title"><span class="title">(6).</span><span class="content">某次半偏法测量表头内阻的实验中,S<sub>2</sub>断开,电表满偏时读出R<sub>N</sub>值,在滑动头P不变,S<sub>2</sub>闭合后调节电阻箱R<sub>M</sub>,使电表半偏时读出R<sub>M</sub>,若认为OP间电压不变,则微安表内阻为:___ 。(用R<sub>M</sub>、R<sub>N</sub>表示)</span></p></div></div><p class="qt_split"></p></div></div><p class="qt_split"></p>',
    );
  };
  const editorRef = useRef();

  const isNewOperate = useRef(false);
  const minMaxPoint = useRef([]);
  const handleSplitMovePatch = () => {
    minMaxPoint.current = getMinMaxPoint();
    isNewOperate.current = true;
    // 第一步 拆分
    splitBySection();
    // 第二步 插入新节点
    insertNewQuestionWrap();

    // // 第四步 移动之前先删除掉空question元素
    deleteEmptyQuestion();
    // return;
    // 第三步 移除newQuestion 里面的split元素
    removeSplitInQuestion();

    // 第五步 判断是否移动 移动新试题到正确位置 minPoint + 1

    handleMove();
    // 第六步 后面指针没有选择完剩余部分处理
    handleSplitResidue();

    // 第七步 判断新试题前后如果是试题插入分割元素
    handleQuestionSplitNodes();
  };
  const getStartEndPoint = () => {
    const [minPoint, maxPoint] = minMaxPoint.current;
    // 判断除选区外，前后受影响的试题是否还有内容， 比较锚点跟各自试题最后锚点位置，min start>split |  max:split<end 证明还有剩余试题内容
    const firstChild = editorRef.current.first([minPoint.path[0]]);
    const startMinPoint = {
      path: firstChild[1],
      offset: 0,
    };
    // 获取大的锚点最后一个子节点path
    const lastChild = editorRef.current.last([maxPoint.path[0]]);
    const lastChildOffset = lastChild[0].text.length;
    const endMaxPoint = {
      path: lastChild[1],
      offset: lastChildOffset,
    };
    console.log(123, isExistPath(endMaxPoint.path));
    console.log(editorRef.current.node(endMaxPoint));
    return [startMinPoint, endMaxPoint];
  };

  const handleQuestionSplitNodes = () => {
    const insertPathArr = [];
    editorRef.current.children.forEach((node, index) => {
      // console.log('node.path---', node.path);
      const currentIsQuestion = node.className?.split(' ')?.includes('question');
      const nextNodeIsQuestion = editorRef.current.children[index + 1]?.className?.split(' ')?.includes('question');
      if (currentIsQuestion && nextNodeIsQuestion) {
        insertPathArr.push([index]);
      }
    });
    insertPathArr.reverse().forEach((insertPath) => {
      editorRef.current.insertNodes(
        {
          type: 'p',
          className: 'qt_split',
          children: [{ text: '' }],
        },
        { at: [+insertPath + 1] },
      );
    });
  };

  // 有剩余部分，处理后面剩余部分
  const handleSplitResidue = () => {
    const {
      isCrossQuestion,
      nextHasContentWithoutSection,
      prevHasContentWithoutSection,
      newAnchor,
      endMaxPoint,
      minPoint,
    } = getDataCache();
    console.log(
      'nextHasContentWithoutSection--',
      nextHasContentWithoutSection,
      'prevHasContentWithoutSection--',
      prevHasContentWithoutSection,
    );
    if (isCrossQuestion) {
      // 跨问题
      if (nextHasContentWithoutSection) {
        const maxQuestionPath = [minPoint.path[0] + 2];
        unwrapQuestion(maxQuestionPath);
      }
    } else {
      // 没有跨问题 后面还有内容的 把后面内容移出去
      if (nextHasContentWithoutSection && prevHasContentWithoutSection) {
        editorRef.current.setSelection({
          anchor: newAnchor,
          focus: endMaxPoint,
        });
        editorRef.current.moveNodes({
          to: [+minPoint.path[0] + 2],
        });
      }

      if (nextHasContentWithoutSection && !prevHasContentWithoutSection) {
        editorRef.current.setSelection({
          anchor: newAnchor,
          focus: endMaxPoint,
        });
        editorRef.current.moveNodes({
          to: [+minPoint.path[0] + 1],
        });
      }
    }
  };

  const removeSplitInQuestion = () => {
    // 综合题此处需要传试题路径
    // 跟据path 获取选区的node 1. remove掉split元素节点
    const { isCrossQuestion } = getDataCache();
    if (isCrossQuestion) {
      editorRef.current.removeNodes({
        at: [],
        match: (n, path) => {
          return (
            path.length >= 3 &&
            isElementNodeByClass(n, 'qt_split') &&
            isElementNodeByClass(getParentNode(path), 'questionWraper')
          );
        },
        mode: 'all',
      });
    }
  };

  // 处理新的试题到正确位置
  const handleMove = () => {
    const { minPoint, prevHasContentWithoutSection, nextHasContentWithoutSection, isCrossQuestion } = getDataCache();

    // 选区后有剩余部分，并且是跨题的需要移动
    if (prevHasContentWithoutSection && nextHasContentWithoutSection && isCrossQuestion) {
      editorRef.current.moveNodes({
        at: [+minPoint.path[0] + 1],
        to: [+minPoint.path[0] + 2],
      });
      return;
    }
    if (!prevHasContentWithoutSection && nextHasContentWithoutSection && isCrossQuestion) {
      editorRef.current.moveNodes({
        at: [+minPoint.path[0]],
        to: [+minPoint.path[0] + 1],
      });
    }
  };

  const getDataCache = (() => {
    let res;
    return () => {
      console.log('isNewOperate.current---', isNewOperate.current);
      if (isNewOperate.current) {
        res = getData();
        isNewOperate.current = false;
      }
      return { ...res };
    };
  })();
  const getMinMaxPoint = () => {
    const { selection } = editorRef.current;
    const { anchor, focus } = selection;
    console.log('anchor---focus', anchor, focus);
    let [minPoint, maxPoint] = [anchor, focus].sort((a, b) => (isMinPoint(a, b) ? -1 : 1));

    // 调整用户选择锚点位置，锚点位置在split 元素上 前后锚点位置不一样，前后锚点可能落在split元素上了，修正到最近的question上
    const minNode = editorRef.current.node(getQuestionWrapPath(minPoint.path));
    // getQuestionWrapPath(minPoint.path, false);
    const maxNode = editorRef.current.node(getQuestionWrapPath(maxPoint.path));

    let a = {
      0: {
        0: 'split',
        1: 'question',
        2: 'split',
        3: 'question',
      },
      1: 'split',
      2: {
        0: {
          0: 'num',
          1: 'title',
        },
        1: 'desc',
        2: 'A',
        3: 'B',
      },
      3: 'split',
      4: {
        0: {
          0: 'num',
          1: 'title',
        },
        1: 'desc',
        2: 'A',
        3: 'B',
      },
    };
    // [1,2] [1,3]
    // [2] [3]

    // min point 在元素上 ++
    if (isElementNodeByClass(minNode, 'qt_split')) {
      minPoint = {
        path: nextPath(getQuestionWrapPath(minPoint.path), 1),
        offset: 0,
      };
    }

    if (isElementNodeByClass(maxNode, 'qt_split')) {
      const lastChild = editorRef.current.last(prevPath(getQuestionWrapPath(maxPoint.path), 1));
      const lastChildOffset = lastChild[0].text.length;
      maxPoint = {
        path: lastChild[1],
        offset: lastChildOffset,
      };
    }
    return [minPoint, maxPoint];
  };
  // 选区前还有内容
  const getData = () => {
    const [minPoint, maxPoint] = minMaxPoint.current;
    // 不在同一个题内
    const isCrossQuestion = !isEqual(getQuestionWrapPath(minPoint.path), getQuestionWrapPath(maxPoint.path));

    // 判断除选区外，前后受影响的试题是否还有内容， 比较锚点跟各自试题最后锚点位置，min start>split |  max:split<end 证明还有剩余试题内容

    const minPointQuestionPath = getQuestionWrapPath(minPoint.path);
    const minPointQuestionNode = editorRef.current.node(minPointQuestionPath);
    const startMinPath = minPointQuestionNode.children.filter((item) => item.text !== '')[0];

    const firstChild = editorRef.current.first([minPoint.path[0]]);
    const startMinPoint = {
      path: firstChild[1],
      offset: 0,
    };
    // 获取大的锚点最后一个子节点path
    const lastChild = editorRef.current.last([maxPoint.path[0]]);
    const lastChildOffset = lastChild[0].text.length;
    const endMaxPoint = {
      path: lastChild[1],
      offset: lastChildOffset,
    };
    const prevHasContentWithoutSection = isMinPoint(startMinPoint, minPoint); // 选区前还有内容，没截全
    const nextHasContentWithoutSection = isMinPoint(maxPoint, endMaxPoint); // 选区后还有内容，没截全
    console.log('maxPoint-----', maxPoint, 'endMaxPoint----', endMaxPoint);
    // split拆分后 选择的选区
    const newMinSelectPath = minPoint.offset > 0 ? getNextPath(minPoint.path) : minPoint;
    // 开始节点text 切割后，结束锚点位置也要+1
    const newMaxSelectPath =
      minPoint.offset > 0 && !isCrossQuestion && isExistPath(getNextPath(maxPoint.path))
        ? getNextPath(maxPoint.path)
        : maxPoint;
    // 拆分后开始锚点
    const newAnchor = editorRef.current.start(newMinSelectPath);
    // 拆分后结束锚点
    const newFocus = editorRef.current.end(newMaxSelectPath);

    return {
      minPoint,
      maxPoint,
      prevHasContentWithoutSection,
      nextHasContentWithoutSection,
      newAnchor,
      newFocus,
      isCrossQuestion,
      endMaxPoint,
    };
  };

  // 是否是指定元素
  const isElementNodeByClass = (node: any, className: string) => {
    return Boolean(node?.['className']?.split(' ')?.includes(className));
  };

  // 新增一个空的question wrap,并把选中的内容移入新增容器，为了不影响path操作,新增的容器在maxPath +1 位置
  const insertNewQuestionWrap = () => {
    const { newAnchor, newFocus, maxPoint } = getDataCache();
    editorRef.current.insertNodes(
      {
        type: 'div',
        className: 'split_wrap question',
        children: [{ type: 'div', className: 'questionWraper', children: [{ text: '' }] }],
      },
      { at: [+maxPoint.path[0] + 1] },
    );
    editorRef.current.setSelection({
      anchor: newAnchor,
      focus: newFocus,
    });
    console.log('newAnchor--', newAnchor, 'newFocus==', newFocus, 'maxPoint====', maxPoint);
    // 移动的时候先移动到maxPoint 保证path 不变
    console.log('+maxPoint.path[0] + 1, 0, 0]---', [+maxPoint.path[0] + 1, 0, 0]);
    editorRef.current.moveNodes({
      to: [+maxPoint.path[0] + 1, 0, 0],
    });
  };

  // 删除空的question
  const deleteEmptyQuestion = () => {
    // console.log('deleteEmptyQuestion');
    const match = (n) => {
      const result =
        n.className?.split(' ')?.includes('question') &&
        n.children?.[0]?.className?.split(' ')?.includes('questionWraper') &&
        Node.string(n).length <= 0;

      if (result) {
        console.log(`%c:n-----${n}`, 'color:red');
      }
      return result;
    };
    editorRef.current.removeNodes({
      at: [],
      match: match,
      mode: 'all',
    });
  };

  // 按照选区两个端点拆分节点
  const splitBySection = () => {
    console.log(' editorRef.current.children---before', editorRef.current.children);
    const [minPoint, maxPoint] = minMaxPoint.current;
    console.log('sectionIsOverallOneQuestion()---', sectionIsOverallOneQuestion());
    if (sectionIsOverallOneQuestion()) {
      return;
    }
    editorRef.current.splitNodes({ at: maxPoint });
    editorRef.current.splitNodes({ at: minPoint });
    console.log(' editorRef.current.children---after', editorRef.current.children);
  };
  // 选区选的是一道题，不用走拆分，切割会导致之后判断是不是剩余有问题
  const sectionIsOverallOneQuestion = () => {
    const [minPoint, maxPoint] = minMaxPoint.current;
    const [startMinPoint, endMaxPoint] = getStartEndPoint();
    const isCrossQuestion = minPoint.path[0] !== maxPoint.path[0];
    console.log('minPoint', minPoint, 'maxPoint', maxPoint, 'startMinPoint', startMinPoint, 'endMaxPoint', endMaxPoint);
    if (!isCrossQuestion && !isMinPoint(startMinPoint, minPoint) && !isMinPoint(maxPoint, endMaxPoint)) {
      return true;
    }
    return false;
  };
  // 获取下一个有效试题子元素path
  const getNextPath = (path: Path) => {
    return Path.next(Path.parent(Path.parent(path)));
  };

  // 判断path 是否存在
  const isExistPath = (path: Path) => {
    console.log('editorRef.current.hasPath(path)---', editorRef.current.hasPath(path));
    return editorRef.current.hasPath(path);
  };

  // 把一个question的children 全部提到指定位置
  const unwrapQuestion = (insertPath) => {
    const questionNode = editorRef.current.node(insertPath);
    console.log('questionNode-', questionNode);
    const handleNodes = questionNode[0].children[0].children?.reverse();

    // 移除试题
    editorRef.current.removeNodes({ at: insertPath });

    handleNodes?.forEach((node) => {
      editorRef.current.insertNodes(node, { at: insertPath });
    });
  };

  // 根据node 节点 获取父节点
  const getParentNode = (path) => {
    const parentPath = path.slice(0, -1);
    return editorRef.current.node(parentPath)[0];
  };

  //= ==========================================================================================================
  // 获取path前n项函数
  const getPathFirstN = (path, n) => {
    if (n < 0) {
      return [];
    }
    return path.slice(0, n);
  };

  // 获取path的后n项path
  const nextPath = (path, n) => {
    const clonePath = [...path];
    const last = clonePath.pop();
    return [...clonePath, last + n];
  };

  // 获取path的前n项
  const prevPath = (path, n) => {
    const clonePath = [...path];
    const last = clonePath.pop();
    return [...clonePath, last - n];
  };

  // 获取question 层级的path
  const getQuestionWrapPath = (path, isRoot = false) => {
    console.log('editorRef.current.children---------', editorRef.current);
    const node = editorRef.current.getNodeByPath([path[0]]);
    console.log('node--------', node);
    const questionType = node?.attributes?.['data-type'] || 0;
    const [first, second] = path;
    if (isRoot) {
      return [first];
    }
    if (Number(questionType) === 6) {
      // 综合题
      return [first, second];
    } else {
      return [first];
    }
  };

  return (
    <div className="app">
      <PlateEditor ref={editorRef} initialValue={initialValue} />
      {/* <PlateProvider onChange={onChangeData} plugins={plugins}>
        <Plate editableProps={editableProps} />
        <ResetPluginsEffect initialValue={initialValue} plugins={plugins} />
      </PlateProvider> */}
      <button onClick={handleSplitMovePatch}>split move 拆分</button>
      <button onClick={changeToCompQuestion}>切换综合题1个</button>
      <button onClick={changeToSimpleQuestion}>切换普通题</button>
    </div>
  );
};

export default EeoEditor;
