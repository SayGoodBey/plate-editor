// 手动划题
const { liftNodes, moveNodes, wrapNodes, insertNodes, removeNodes } = require('@udecode/plate-common');
const {
  isString,
  isObject,
  isArray,
  isBoolean,
  isUndefined,
  getSplitQuestionType,
  getSplitQuestionErrorPromptCallback,
  insertSpliteDOM,
} = require('./utils.js');
const { createFontColorPlugin } = require('@udecode/plate-font');
const getTinymceId = function (editor) {
  return 'tinymce-editor';
  // const tinymceId = editor.getParam('id');
  // const tinymceIdBoolean = isString(tinymceId);
  // if (!tinymceIdBoolean) {
  //   throw new Error('not found id or unexpected type');
  // }
  // return tinymceId;
};
// 判断手动划题第一个/最后一个元素是不是试题
const getManualSplitLastQuestion = (editor, content) => {
  const parseDOM = new DOMParser().parseFromString(content, 'text/html');
  const parseBodyDOM = parseDOM.getElementsByTagName('body')[0];
  const parseBodyChildrenDOM = parseDOM.getElementsByTagName('body')[0].children;
  let firstQuestionsDomsDataUUid,
    lastQuestionsDomsDataUUid,
    firstQuestionsDomsDataType,
    lastQuestionsDomsDataType = '';
  if (parseBodyChildrenDOM?.length) {
    const { firstChild } = parseBodyDOM;
    const { lastChild } = parseBodyDOM;
    firstQuestionsDomsDataUUid = firstChild?.getAttribute ? firstChild.getAttribute('data-uuid') : null;
    lastQuestionsDomsDataUUid = lastChild?.getAttribute ? lastChild.getAttribute('data-uuid') : null;
    firstQuestionsDomsDataType = firstChild?.getAttribute ? firstChild.getAttribute('data-type') : null;
    lastQuestionsDomsDataType = lastChild?.getAttribute ? lastChild.getAttribute('data-type') : null;
  }
  return {
    firstQuestionsDomsDataUUid,
    lastQuestionsDomsDataUUid,
    firstQuestionsDomsDataType,
    lastQuestionsDomsDataType,
  };
};
// 将对应的dom重新解析试题
const transformDOMToHTML = function (targeetDOM) {
  const targeetDOMContent = new XMLSerializer().serializeToString(targeetDOM);
  const html = window.richML.toHTML(targeetDOMContent);
  const parserDOM = new DOMParser().parseFromString(html, 'text/html');
  const parserDOMBody = parserDOM.getElementsByTagName('body')[0]?.children;
  Array.from(parserDOMBody).forEach((itemDOM) => {
    targeetDOM.parentNode.insertBefore(itemDOM, targeetDOM);
  });
  targeetDOM.remove();
};
// 创建受划题影响的试题
const createPassiveQuestion = function (editor, dataUUid) {
  const tinymceId = getTinymceId(editor);
  const tinymceIdDOM = document.getElementById(`${tinymceId}`);
  const targeetDOM = tinymceIdDOM.querySelector(`#${tinymceId} .question[data-uuid="${dataUUid}"]`);
  if (!targeetDOM) return false;
  transformDOMToHTML(targeetDOM);
};
// 将新生成的试题 移到划题试题外 而不是试题内
// 判定新生成的试题父元素 是否为非综合题试题，如果是 需要将它从父元素中抽离出来
const pullAwayQuestion = function (editor, childNode, content) {
  const childQuestionDataUUId = childNode?.getAttribute('data-uuid');
  const parentQuestionWrapperNode = childNode.parentNode;
  // 原parentNode
  const parentQuestionNode = parentQuestionWrapperNode?.parentNode;
  const parentQuestionType = +parentQuestionNode?.getAttribute('data-type');
  const parentQuestionDataUUId = parentQuestionNode?.getAttribute('data-uuid');
  const newParentQuestionNode = parentQuestionNode?.parentNode;
  const { lastQuestionsDomsDataUUid, firstQuestionsDomsDataUUid, firstQuestionsDomsDataType } =
    getManualSplitLastQuestion(editor, content);
  const isPullAwayQuestion = parentQuestionType && parentQuestionType !== 6;
  // 跨组建划题时，最上面的试题为综合题 即 （综合题，其他题型）的形式
  const isPullAwayQuestionFirstMix =
    parentQuestionType && parentQuestionType === 6 && firstQuestionsDomsDataType === '6';
  if (isPullAwayQuestion || isPullAwayQuestionFirstMix) {
    // 划题时 起点终点都为 试题组件时， 终点的组件产生断行，则这个断行会自动合并到第一个试题组件尾部
    if (lastQuestionsDomsDataUUid) {
      newParentQuestionNode.insertBefore(parentQuestionWrapperNode.lastChild, parentQuestionNode.nextSibling);
    }
    const childNodeStationDom = document.createElement('p');
    childNodeStationDom.setAttribute('id', `childNodeStationDom_${childQuestionDataUUId}`);
    parentQuestionWrapperNode.insertBefore(childNodeStationDom, childNode);
    newParentQuestionNode.insertBefore(childNode, parentQuestionNode.nextSibling);
    insertSpliteDOM(parentQuestionNode.nextSibling, newParentQuestionNode);
    // 如果是试题组件内划题
    if (!lastQuestionsDomsDataUUid && !firstQuestionsDomsDataUUid) {
      const childNodeNextSibling = childNode.nextSibling;
      pullAwayQuestionStationAfter(childNodeStationDom, childNodeNextSibling, newParentQuestionNode);
      createPassiveQuestion(editor, parentQuestionDataUUId, childQuestionDataUUId);
    }
    childNodeStationDom.remove();
  }
  pullAwayMixQuestion(parentQuestionNode, childNode);
  changeMixQuestionType(parentQuestionNode, childNode);
};
// 在试题内划题，将被划出试题后面的内容，放到被划出试题之后
const pullAwayQuestionStationAfter = function (childNodeStationDom, childNodeNextSibling, newParentQuestionNode) {
  const stationAfterDom = document.createElement('p');
  while (childNodeStationDom.nextSibling) {
    stationAfterDom.appendChild(childNodeStationDom.nextSibling);
  }
  newParentQuestionNode.insertBefore(stationAfterDom, childNodeNextSibling);
  insertSpliteDOM(stationAfterDom, newParentQuestionNode);
  transformDOMToHTML(stationAfterDom);
};
// 综合题内划综合题
// 将父综合题的其他部分判白，只保留划出来的综合题
const pullAwayMixQuestion = function (parentQuestionNode, childNode) {
  const parentQuestionType = +parentQuestionNode?.getAttribute('data-type');
  if (parentQuestionType !== 6) return;
  const childNodeDataType = childNode?.getAttribute('data-type');
  if (childNodeDataType === '6') {
    // 原parentNode
    const parentQuestionNode = getMixQuestionDom(childNode);
    if (parentQuestionNode) {
      Promise.resolve().then(() => {
        getMixQuestionPrevSibling(childNode, parentQuestionNode);
        getMixQuestionNextSibling(childNode, parentQuestionNode);
        parentQuestionNode.remove();
      });
    }
  }
};
// 将整个综合题划成其他题型
const changeMixQuestionType = function (parentQuestionNode, childNode) {
  const parentQuestionType = +parentQuestionNode?.getAttribute('data-type');
  const childNodeQuestionType = +childNode?.getAttribute('data-type');
  if (parentQuestionType !== 6) return;
  if (childNodeQuestionType === 6) return;
  // 判断综合题内除手动划出的childNode外是否还有其它内容，没有其它内容则说明是将综合题整体划成了其它题型
  const parentQuestionNodeWrapper = parentQuestionNode.firstChild;
  const mixQuestionContent = parentQuestionNodeWrapper?.childNodes;
  const newParentQuestionNode = parentQuestionNode?.parentNode;
  const isSplit =
    mixQuestionContent[0]?.className?.trim() === mixQuestionContent[2]?.className?.trim() &&
    mixQuestionContent[2]?.className?.trim();
  if (mixQuestionContent.length === 3 && childNode === mixQuestionContent[1] && isSplit) {
    mixQuestionContent.forEach((itemContent, index) => {
      if (index === 1) {
        newParentQuestionNode.insertBefore(childNode, parentQuestionNode);
      } else {
        newParentQuestionNode.insertBefore(itemContent, parentQuestionNode);
      }
    });
    parentQuestionNode.remove();
  }
};
// 获取综合题小题的最外层综合题dom
const getMixQuestionDom = (childNode) => {
  let parentQuestionNode = childNode.parentNode;
  let i = 1;
  while (i) {
    const parentQuestionType = +parentQuestionNode?.getAttribute('data-type');
    const parentQuestionID = parentQuestionNode?.getAttribute('id');
    if (parentQuestionType === 6 || parentQuestionID === 'tinymce-editor') {
      i = 0;
    } else {
      parentQuestionNode = parentQuestionNode.parentNode;
    }
  }
  return +parentQuestionNode?.getAttribute('data-type') === 6 ? parentQuestionNode : false;
};
// 获取综合题内综合题 前面的兄弟节点
const getMixQuestionPrevSibling = (childNode, parentQuestion) => {
  let prevSibling = childNode.previousSibling;
  const prevSiblingArr = [];
  while (prevSibling) {
    prevSiblingArr.push(prevSibling);
    prevSibling = prevSibling.previousSibling;
  }
  prevSiblingArr.forEach((itemDom, domIndex) => {
    parentQuestion.parentNode.insertBefore(prevSiblingArr[prevSiblingArr.length - 1 - domIndex], parentQuestion);
  });
};
// 获取综合题内综合题 后面的兄弟节点
const getMixQuestionNextSibling = (childNode, parentQuestion) => {
  let { nextSibling } = childNode;
  const nextSiblingArr = [];
  while (nextSibling) {
    nextSiblingArr.push(nextSibling);
    nextSibling = nextSibling.nextSibling;
  }
  parentQuestion.parentNode.insertBefore(childNode, parentQuestion);
  nextSiblingArr.forEach((itemDom) => {
    parentQuestion.parentNode.insertBefore(itemDom, parentQuestion);
  });
};
// 根据选择的内容生成新试题
const insertNewQuestion = function (editor, content, question_type) {
  let html = window.richML.toHTML(content, question_type);
  const { lastQuestionsDomsDataUUid, firstQuestionsDomsDataUUid } = getManualSplitLastQuestion(editor, content);
  if (!lastQuestionsDomsDataUUid && !firstQuestionsDomsDataUUid) {
    html = `<p class="qt_splite"></p>${html}`;
  }
  console.log('selection :>> ', editor.selection);
  const at = editor.selection;
  const [index] = at.focus.path;
  const [index2] = at.anchor.path;
  const isCrossQuestion = index !== index2; // 如果跨问题，需要把剩余的 wrapper删除

  insertNodes(
    editor,
    {
      type: 'div',
      className: 'question',
      'data-type': question_type,
      'data-uuid': getUniqueValue(),
      children: [{ text: '' }],
    },
    { at: [index] },
  );
  insertNodes(
    editor,
    {
      type: 'p',
      className: 'qt_spite',
      children: [{ text: '' }],
    },
    { at: [index + 1] },
  );
  insertNodes(editor, { type: 'div', className: 'questionWraper', children: [{ text: '' }] }, { at: [index, 0] });
  console.log('selection :>> ', editor.selection);
  moveNodes(editor, {
    to: [index, 0, 0],
  });
  if (isCrossQuestion) {
    removeNodes(editor, { at: [index + 2, 0] });
  }
  // isCrossQuestion &&
  //   removeNodes(editor, {
  //     mode: 'highest',
  //     match: (node, path) => {
  //       if (path[0] > index + 2 && path[0] < index2 + 2) {
  //         console.log(path);
  //         return true;
  //       }
  //       return false;
  //       // console.log(path, index, index2);
  //       // const result = path[0] <= Math.max(index, index2) && path[0] > Math.min(index, index2);
  //       // console.log('result', result);
  //       // if (result) {
  //       //   console.log('node :>> ', node);
  //       // }

  //       // return result;
  //     },
  //   });
  console.log('editor :>> ', editor);

  const newHtmlDataUUId = html.match(/<div(.*?)data-uuid="(.*?)"(.*?)?>/)?.[2];
  Promise.resolve().then(() => {
    const targetNewHtmlDOM = document.querySelector(`div.question[data-uuid='${newHtmlDataUUId}']`);
    if (targetNewHtmlDOM) {
      // pullAwayQuestion(editor, targetNewHtmlDOM, content);
    }
  });
};

// 处理受划题影响的试题
const passiveQuestionHandle = function (editor, content) {
  const { firstQuestionsDomsDataUUid, lastQuestionsDomsDataUUid } = getManualSplitLastQuestion(editor, content);
  console.log('firstQuestionsDomsDataUUid :>> ', firstQuestionsDomsDataUUid);
  console.log('lastQuestionsDomsDataUUid :>> ', lastQuestionsDomsDataUUid);
  if (lastQuestionsDomsDataUUid && lastQuestionsDomsDataUUid !== firstQuestionsDomsDataUUid) {
    createPassiveQuestion(editor, lastQuestionsDomsDataUUid);
  }
  if (firstQuestionsDomsDataUUid) {
    createPassiveQuestion(editor, firstQuestionsDomsDataUUid);
  }
};

// 点击上下文toolbar按钮后的处理程序
const contextToolbarClickHandler = (editor, question_type, getContent) => {
  window.eeoSensors &&
    window.eeoSensors.track('BatchEditPageOperation', { operation_type: '完成划题' }, 'EnterBatchUploadPage');
  const errorPromptCallback = () => { };
  // const errorPromptCallback = getSplitQuestionErrorPromptCallback(editor);
  if (getContent && errorPromptCallback) {
    // 1.根据选择的内容生成新试题
    // 2.处理受划题影响的试题
    // 3. 试题报错提示
    Promise.resolve()
      .then(() => {
        insertNewQuestion(editor, getContent, question_type);
      })
      .then(() => {
        // TODO:需要处理 通过原生dom方法操作的适配
        // passiveQuestionHandle(editor, getContent);
      })
      .then(() => {
        errorPromptCallback();
      });
  }
};

module.exports = { contextToolbarClickHandler };

function getUniqueValue() {
  return `${(Math.random() + Math.random()).toString().slice(2)}-${new Date().getTime()}`;
}
