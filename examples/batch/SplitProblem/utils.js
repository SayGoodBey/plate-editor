/*
 * @Author: jiansheng hao jiansheng.hao@eeoa.com
 * @Date: 2022-07-19 15:38:45
 * @LastEditors: jiansheng hao jiansheng.hao@eeoa.com
 * @LastEditTime: 2022-07-19 16:22:38
 * @FilePath: /qbank/src/assets/js/TinymcePlugin/SplitProblem/utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const typeOf = function (x) {
  if (x === null) return 'null';
  let t = typeof x;
  if (t === 'object' && Object.prototype.toString.call([x]) === '[object Array]') return 'array';
  // if (t === 'object' && String.prototype.isPrototypeOf(x))
  //   return 'string';
  // if (t === 'function' && Function.prototype.isPrototypeOf(x))
  //   return 'function';
  return t;
};
const isType$1 = function (type) {
  return function (value) {
    return typeOf(value) === type;
  };
};
const isString = isType$1('string');
const isObject = isType$1('object');
const isArray = isType$1('array');
const isBoolean = isType$1('boolean');
const isUndefined = isType$1('undefined');
const isFunction = isType$1('function');

// 获取试题类型参数
const getSplitQuestionType = function (editor) {
  const splitQuestionTypeParams = editor.getParam('split_question_type');
  const splitQuestionTypeBoolean = splitQuestionTypeParams?.length > 0 && isArray(splitQuestionTypeParams);
  if (!splitQuestionTypeBoolean) {
    throw new Error('not found split_question_type or unexpected type');
  }
  return splitQuestionTypeParams;
};
// 获取试题报错函数
const getSplitQuestionErrorPromptCallback = function (editor) {
  const splitQuestionErrorPromptCallback = editor.getParam('split_question_error_prompt_callback');
  const errorPromptCallbackBoolean = splitQuestionErrorPromptCallback && isFunction(splitQuestionErrorPromptCallback);
  if (!errorPromptCallbackBoolean) {
    throw new Error('not found split_question_error_prompt_callback or unexpected type');
  }
  return splitQuestionErrorPromptCallback;
};
// 全角字符转为半角字符
const all2b = (str) => {
  // '＜'65308  '＞'65310
  let excludeCode = [65308, 65310];
  let result = '';
  if (!str?.length) return '';
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    // #全角空格直接转换
    if (code === 12288) {
      code = 32;
      result += String.fromCharCode(code);
    } else if (code >= 65281 && code < 65373) {
      // #全角字符（除空格）根据关系转化 “65248”是转换码距
      if (excludeCode.includes(code)) {
        // 那些全角不转半角
        result += String.fromCharCode(code);
      } else {
        result += String.fromCharCode(code - 65248);
      }
    } else result += str.charAt(i);
  }
  return result;
};

const insertSpliteDOM = (childNode, parentNode) => {
  const splitDom = document.createElement('p');
  splitDom.setAttribute('class', 'qt_splite');
  splitDom.innerHTML = '<br>';
  parentNode.insertBefore(splitDom, childNode);
};
module.exports = {
  isString,
  isObject,
  isArray,
  isBoolean,
  isUndefined,
  isFunction,
  getSplitQuestionType,
  getSplitQuestionErrorPromptCallback,
  all2b,
  insertSpliteDOM,
};
