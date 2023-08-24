/*
 * @Author: jiansheng hao jiansheng.hao@eeoa.com
 * @Date: 2022-07-19 15:27:06
 * @LastEditors: jiansheng hao jiansheng.hao@eeoa.com
 * @LastEditTime: 2022-07-19 15:57:12
 * @FilePath: /qbank/src/assets/js/TinymcePlugin/SplitProblem/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
(function () {
  const init = require('./split.js');
  const autoSplit = require('./autoSplit.js');
  const manualSplit = require('./manualSplit.js');
  let global$2 = window.tinymce.util.Tools.resolve('tinymce.PluginManager');
  window.richML = {};

  // 对外暴露的方法
  const get = function (editor) {
    // 初始化
    init(editor, window.richML);
    return {
      autoSplit: autoSplit(editor), // 触发自动划题
      manualSplit: manualSplit(editor), // 触发手动划题
    };
  };
  function Plugin() {
    global$2.add('splitproblem', (editor) => {
      let api = get(editor);
      return api;
    });
  }
  Plugin();
})();
