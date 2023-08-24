/*
 * @Author: jiansheng hao jiansheng.hao@eeoa.com
 * @Date: 2022-07-19 11:39:46
 * @LastEditors: jiansheng hao jiansheng.hao@eeoa.com
 * @LastEditTime: 2022-07-19 15:56:59
 * @FilePath: /qbank/src/assets/js/TinymcePlugin/SplitProblem/autoSplit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 自动划题
const { getSplitQuestionType, getSplitQuestionErrorPromptCallback } = require('./utils.js');
const autoSplit = function (editor) {
  return (content) => {
    const splitQuestionTypeBoolean = getSplitQuestionType(editor);
    const errorPromptCallback = getSplitQuestionErrorPromptCallback(editor);
    if (splitQuestionTypeBoolean && errorPromptCallback) {
      const contentVal = window.richML.toHTML(content);
      Promise.resolve().then(() => {
        errorPromptCallback();
      });
      return contentVal;
    }
  };
};
module.exports = autoSplit;
