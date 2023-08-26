/*
 * @Author: jiansheng hao jiansheng.hao@eeoa.com
 * @Date: 2022-07-12 10:51:33
 * @LastEditors: jiansheng hao jiansheng.hao@eeoa.com
 * @LastEditTime: 2022-07-20 16:25:26
 * @FilePath: /qbank/src/components/mixins/batchAddQuestion/tinymce-text.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 试题编辑行 相关操作
// import { pointBatchEditPageOperation } from '@/assets/js/utils/batch_add_question.sensors';
export default {
  data() {
    return {
      questionOperationsDomMap: {}, // 编辑试题行dom map
      questionIndex: 0, // 除综合题小题外的试题索引
      questionSubtopicIndex: 0, // 综合题小题索引
    };
  },
  methods: {
    // 判断当前元素dom 是否为试题组件树的第一个元素, 如果是返回这个dom
    isFirstDOM(dom) {
      const parentNode = dom.parentNode;
      const targetNode = parentNode?.getAttribute('data-uuid') && parentNode?.className?.includes('question');
      if (!parentNode?.firstChild || parentNode.firstChild !== dom) {
        return false;
      }
      if (targetNode) {
        return targetNode;
      }
      if (parentNode.id === 'tinymce-editor') {
        return false;
      }
      if (!targetNode) {
        return this.isFirstDOM(dom.parentNode);
      }
    },
    // 判断当前dom所属的试题是否为空, 如果为空 删除传入的试题子元素
    emptyQuestionRemoveChild(childDom) {
      const parentNode = childDom.parentNode;
      if (parentNode.id === 'tinymce-editor') {
        return false;
      }
      const targetQuestionDOMDataUUId = parentNode.getAttribute('data-uuid');
      if (!targetQuestionDOMDataUUId) this.emptyQuestionRemoveChild(parentNode);
      const parentNodeText = parentNode.innerText;
      if (!parentNodeText?.trim()) {
        parentNode.removeChild(childDom);
        return true;
      }
    },
    // 生成操作试题行 及 设置操作试题行的位置
    setQuestionOperation() {
      const tinymceEditorDom = document.getElementById('tinymce-editor');
      if (!tinymceEditorDom) return false;
      const tinymceTextWrapperDom = document.getElementById('tinymce-editor-wrapper');
      const questionsDoms = Array.from(document?.getElementsByClassName('question'));
      const questionOperations = Array.from(tinymceTextWrapperDom?.getElementsByClassName('question-operation'));

      this.questionOperationsDomMap = {};
      questionOperations.forEach((questionOperation) => {
        this.questionOperationsDomMap[questionOperation.getAttribute('data-uuid')] = questionOperation;
      });
      // 富文本内全选删除的时候要删除所有的试题操作行
      if (questionsDoms.length === 0) {
        this.removeQuestionOperationsDom('all');
      }
      const questionOperationsDataUUIdArr = Object.keys(this.questionOperationsDomMap);
      questionsDoms.forEach((questionsDom) => {
        const questionDataUUId = questionsDom.getAttribute('data-uuid');
        // 找到多余的编辑试题行，防止删除大综合题时，将综合题小题的编辑试题行遗漏
        const dataUUIdIndex = questionOperationsDataUUIdArr.findIndex((item) => item === questionDataUUId);
        if (dataUUIdIndex > -1) {
          questionOperationsDataUUIdArr.splice(dataUUIdIndex, 1);
        }
        // 将综合题 小题题号与其他试题区分开
        this.setQuestionOperationIndex(questionsDom);
        const isSubtopicQuestionBoolean = this.isCompreSubtopicQuestion(questionsDom);
        let questionNum = isSubtopicQuestionBoolean ? `(${this.questionSubtopicIndex}).` : `${this.questionIndex}.`;
        if (this.questionOperationsDomMap[questionDataUUId]) {
          this.changeQuestionOperationDiv(questionsDom, questionDataUUId, questionNum);
        } else {
          // 新建操作试题行
          this.createQuestionOperationDiv(questionsDom, questionNum);
        }
      });
      this.questionIndex = 0;
      this.questionSubtopicIndex = 0;
      // 删除多余的试题编辑行
      this.removeQuestionOperationsDom(questionOperationsDataUUIdArr);
    },
    // 修改操作试题行 的dom 位置/试题索引/报错信息
    changeQuestionOperationDiv(questionsDom, questionDataUUId, questionNum) {
      // 修改操作试题行的定位
      const firstChildBoolean = this.firstChildisQuestion();
      const questionsDomOffsetTop = firstChildBoolean ? questionsDom.offsetTop : questionsDom.offsetTop - 26;
      this.questionOperationsDomMap[questionDataUUId].setAttribute(
        'style',
        `position:absolute;left:12px;top: ${questionsDomOffsetTop}px;padding: 0 ${questionsDom.offsetLeft}px`,
      );
      // 修改操作试题行 试题索引
      const questionInfoDom =
        this.questionOperationsDomMap[questionDataUUId].getElementsByClassName('question-info')[0];
      const questionTypeDom = questionInfoDom.getElementsByClassName('question-type')[0];
      if (questionTypeDom.firstChild) questionTypeDom.firstChild.innerText = questionNum;
      // 修改操作试题行 报错信息
      const dataError = questionsDom.getAttribute('data-error');
      const questionDataError = questionInfoDom.getElementsByClassName('question-data-error')[0];
      if (questionDataError && dataError) {
        questionDataError.innerText = dataError;
      } else if (dataError) {
        const questionInfoIntervaloDom = document.createElement('div');
        questionInfoIntervaloDom.setAttribute('class', 'question-info-intervalo');
        questionInfoDom.appendChild(questionInfoIntervaloDom);
        const questionDataErrorDom = document.createElement('div');
        questionDataErrorDom.setAttribute('class', 'question-data-error');
        questionDataErrorDom.innerText = dataError;
        questionInfoDom.appendChild(questionDataErrorDom);
        this.questionOperationsDomMap[questionDataUUId].className += ' question-operation-error';
      } else {
        const questionInfoIntervaloDom = questionInfoDom.getElementsByClassName('question-info-intervalo')[0];
        if (questionInfoIntervaloDom) questionInfoDom.removeChild(questionInfoIntervaloDom);
        const questionDataErrorDom = questionInfoDom.getElementsByClassName('question-data-error')[0];
        if (questionDataErrorDom) questionInfoDom.removeChild(questionDataErrorDom);
        this.questionOperationsDomMap[questionDataUUId].className = 'question-operation';
      }
    },
    // 创建操作试题行 的dom
    createQuestionOperationDiv(questionsDom, questionNum) {
      const tinymceTextWrapperDom = document.getElementById('tinymce-editor-wrapper');
      const questionDataUUId = questionsDom.getAttribute('data-uuid');
      const questionOperationDiv = document.createElement('div');
      const questionType = +questionsDom.getAttribute('data-type');
      const firstChildBoolean = this.firstChildisQuestion();
      const questionsDomOffsetTop = firstChildBoolean ? questionsDom.offsetTop : questionsDom.offsetTop - 26;
      questionOperationDiv.setAttribute(
        'style',
        `position:absolute;left:12px;top: ${questionsDomOffsetTop}px;padding: 0 ${questionsDom.offsetLeft}px`,
      );
      questionOperationDiv.setAttribute('data-type', questionType);
      questionOperationDiv.setAttribute('data-uuid', questionDataUUId);
      questionOperationDiv.setAttribute('class', `question-operation`);
      questionOperationDiv.innerHTML = this.createQuestionInfoDiv(questionsDom, questionOperationDiv, questionNum);
      const questionOperationGroupDiv = document.createElement('div');
      questionOperationGroupDiv.setAttribute('class', `question-operation-group`);
      questionOperationGroupDiv.onclick = this.questionOperationGroupClickHandler;
      questionOperationGroupDiv.innerHTML = `
          <div class='question-operation-edit'>
            <i class="iconfont eeo-icon-edit-time"></i><span>${'我是占位文案'}</span>
          </div>
          <div class='question-operation-remove'>
            <i class="iconfont eeo-icon-delete"></i><span>${'我是占位文案'}</span>
          </div>
        `;
      questionOperationDiv.appendChild(questionOperationGroupDiv);
      tinymceTextWrapperDom.insertBefore(questionOperationDiv, null);
    },
    // 创建操作试题行中的试题类型/报错信息的dom
    // questionsDom 相对应的试题dom
    // questionOperationDiv 相对应的父级 操作试题行
    createQuestionInfoDiv(questionsDom, questionOperationDiv, questionNum) {
      const questionDataError = questionsDom.getAttribute('data-error') || '';
      const questionType = +questionsDom.getAttribute('data-type');
      const question_info_html_list = [];
      question_info_html_list.push('<div class="question-info">');
      question_info_html_list.push(
        `<div class='question-type'><span>${questionNum}</span><span>${
          this.initComputed.split_question_type[questionType - 1]
        }</span></div>`,
      );
      question_info_html_list.push('</div>');
      if (questionDataError) {
        question_info_html_list.splice(2, 0, `<div class='question-info-intervalo'></div>`);
        question_info_html_list.splice(3, 0, `<div class='question-data-error'>${questionDataError}</div>`);
        questionOperationDiv.className += ' question-operation-error';
      }
      return question_info_html_list.join('');
    },
    // 修改操作试题行 试题类型
    changeQuestionInfoType(questionDataUUId, questionType) {
      const questionInfoDom =
        this.questionOperationsDomMap[questionDataUUId].getElementsByClassName('question-info')[0];
      const questionTypeDom = questionInfoDom.getElementsByClassName('question-type')[0];
      if (questionTypeDom.lastChild)
        questionTypeDom.lastChild.innerText = this.initComputed.split_question_type[questionType - 1];
    },
    // 修改操作试题行 位置
    changeQuestionPosition() {
      const tinymceTextWrapperDom = document.getElementById('tinymce-editor-wrapper');
      const tinymceEditorDom = tinymceTextWrapperDom && tinymceTextWrapperDom.querySelector('div#tinymce-editor');
      const questionOperationDOMS =
        tinymceEditorDom && tinymceTextWrapperDom.querySelectorAll('div.question-operation');
      if (!questionOperationDOMS) return;
      const firstChildBoolean = this.firstChildisQuestion();
      questionOperationDOMS.forEach((itemQuestionOpe) => {
        const dataUUId = itemQuestionOpe.getAttribute('data-uuid');
        if (dataUUId) {
          const questionsDom = tinymceEditorDom.querySelector(`div.question[data-uuid="${dataUUId}"]`);
          const questionsDomOffsetTop = firstChildBoolean ? questionsDom.offsetTop : questionsDom.offsetTop - 26;
          itemQuestionOpe.setAttribute(
            'style',
            `position:absolute;left:12px;top: ${questionsDomOffsetTop}px;padding: 0 ${questionsDom.offsetLeft}px`,
          );
        }
      });
    },
    // 设置编辑试题行索引
    setQuestionOperationIndex(questionsDom) {
      const isSubtopicQuestionBoolean = this.isCompreSubtopicQuestion(questionsDom);
      if (isSubtopicQuestionBoolean) {
        this.questionSubtopicIndex++;
      } else {
        this.questionSubtopicIndex = 0;
        this.questionIndex++;
      }
    },
    // 点击操作试题行 编辑 or 删除
    questionOperationGroupClickHandler(e) {
      // 点击的数据
      const targetParentNode = e.target.parentNode;
      const targetDataUUId = targetParentNode.parentNode?.parentNode?.getAttribute('data-uuid');
      const parentNodeClass = targetParentNode.getAttribute('class');
      if (!targetDataUUId) return;
      // 点击编辑
      if (parentNodeClass === 'question-operation-edit') {
        this.questionEditClickHandler(targetDataUUId);
        // 点击删除
      } else if (parentNodeClass === 'question-operation-remove') {
        // TODO:埋点移除
        // pointBatchEditPageOperation({ operation_type: '删除' });
        this.removeQuestionsDom(targetDataUUId);
        this.removeQuestionOperationsDom(targetDataUUId);
      }
    },
    // 删除 操作试题行dom
    removeQuestionOperationsDom(domUUId) {
      const tinymceTextWrapperDom = document.getElementById('tinymce-editor-wrapper');
      if (Array.isArray(domUUId)) {
        domUUId.forEach((item) => {
          tinymceTextWrapperDom.removeChild(this.questionOperationsDomMap[item]);
          delete this.questionOperationsDomMap[item];
        });
      } else if (domUUId === 'all') {
        Object.keys(this.questionOperationsDomMap).forEach((questionOperationKey) => {
          tinymceTextWrapperDom.removeChild(this.questionOperationsDomMap[questionOperationKey]);
        });
        this.questionOperationsDomMap = {};
      } else if (domUUId) {
        const targetQuestionOperationsDom = this.questionOperationsDomMap[domUUId];
        if (!targetQuestionOperationsDom) return false;
        tinymceTextWrapperDom.removeChild(targetQuestionOperationsDom);
        delete this.questionOperationsDomMap[domUUId];
      }
    },
    // 删除 富文本内的试题 dom
    removeQuestionsDom(domUUId) {
      if (domUUId) {
        const questionsDomList = window.tinymce.editors['tinymce-editor'].dom.select('div.question');
        const targetQuestionDom = questionsDomList.find((question) => question.getAttribute('data-uuid') === domUUId);
        window.tinymce.editors['tinymce-editor'].dom.remove(targetQuestionDom);
        // 调用一次 让操作试题行 重新定位
        this.setQuestionOperation();
      }
    },
    // 判断富文本内第一个元素是否为试题
    firstChildisQuestion() {
      const tinymceEditorDom = document.getElementById('tinymce-editor');
      const tinymceEditorDomFirstChild = tinymceEditorDom && tinymceEditorDom.firstChild;
      const firstChildisQuestion = tinymceEditorDomFirstChild && tinymceEditorDomFirstChild.getAttribute('data-uuid');
      return !!firstChildisQuestion;
    },
    // 判断是否为综合题小题
    isCompreSubtopicQuestion(questionsDom) {
      const questionsDomParentNode = questionsDom.parentNode.parentNode;
      const questionsDomParentNodeDataType = +questionsDomParentNode.getAttribute('data-type');
      return !!(questionsDomParentNodeDataType === 6);
    },
  },
};
