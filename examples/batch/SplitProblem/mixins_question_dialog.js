/*
 * @Author: jiansheng hao jiansheng.hao@eeoa.com
 * @Date: 2022-07-12 14:15:57
 * @LastEditors: jiansheng hao jiansheng.hao@eeoa.com
 * @LastEditTime: 2022-07-20 19:03:03
 * @FilePath: /qbank/src/components/mixins/batchAddQuestion/question-dialog.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 批量添加试题 编辑试题弹窗 html->数据->html
import cloneDeep from 'lodash/cloneDeep';
// import { QUESTIONTYPEARR } from '@/store/enum/index';
// import { pointBatchEditPageOperation } from '@/assets/js/utils/batch_add_question.sensors';

export default {
  data() {
    return {
      // 要渲染的题目信息
      question: {}, // 试题数据结构
      compreQuestion: {}, //综合题数据结构
      htmlList: [], // 根据弹窗数据转换成的html列表
      targetDataUUId: '', // 点击的试题Id
      questionNum: 0, //单次编辑产生的试题数量
      // 单选题
      singleSelectQuestion: {
        questionId: null,
        isResources: true,
        questionOrigin: '', // 试题从哪个入口创建的  questionsResource 试题资源  试卷
        questionType: 1, // topicType
        isShowDetail: false, // 是否展示详情
        isFavorite: false, // 是否收藏
        parentInfo: {
          parentId: '',
          parentPath: '',
        },
        questionName: '', // topicName
        questionInfo: {
          // topicInfo
          questionTitle: {
            // topicDry
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          optionInfo: [
            {
              optionId: 1,
              optionKey: 'A',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 2,
              optionKey: 'B',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 3,
              optionKey: 'C',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 4,
              optionKey: 'D',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
          ],
          rightAnswer: [1], // '3'
          analysisEnable: false,
          analysis: {
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          examinationSite: {
            // 考点
            html: '',
          },
          record: {
            // 收录
            html: '',
          },
          pastExamPaper: {
            // 真题
            html: '',
          },
          difficulty: {
            // 难度
            html: '',
          },
        },
      },
      // 多选题
      multipleSelectQuestion: {
        questionId: null,
        isResources: true,
        questionOrigin: '',
        questionType: 2, // topicType
        isShowDetail: false, // 是否展示详情
        isFavorite: false, // 是否收藏
        parentInfo: {
          parentId: '',
          parentPath: '',
        },
        questionName: '', // topicName
        questionInfo: {
          // topicInfo
          questionTitle: {
            // topicDry
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          optionInfo: [
            {
              optionId: 1,
              optionKey: 'A',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 2,
              optionKey: 'B',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 3,
              optionKey: 'C',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 4,
              optionKey: 'D',
              optionContent: {
                // 'optionValue: '请输入选项内容'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
          ],
          rightAnswer: [1], // '3'
          analysisEnable: false,
          analysis: {
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          examinationSite: {
            // 考点
            html: '',
          },
          record: {
            // 收录
            html: '',
          },
          pastExamPaper: {
            // 真题
            html: '',
          },
          difficulty: {
            // 难度
            html: '',
          },
        },
      },
      // 判断题
      trueFalseQuestion: {
        questionId: null,
        isResources: true,
        questionOrigin: '',
        questionType: 3, // topicType
        isShowDetail: false, // 是否展示详情
        isFavorite: false, // 是否收藏
        parentInfo: {
          parentId: '',
          parentPath: '',
        },
        questionName: '', // topicName
        questionInfo: {
          // topicInfo
          questionTitle: {
            // topicDry
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          optionInfo: [
            {
              optionId: 1,
              optionKey: 'R',
              optionContent: {
                // //'optionValue: '正确'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              optionId: 2,
              optionKey: 'W',
              optionContent: {
                // //'optionValue: '错误'
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
          ],
          rightAnswer: [1], // '3'
          analysisEnable: false,
          analysis: {
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          examinationSite: {
            // 考点
            html: '',
          },
          record: {
            // 收录
            html: '',
          },
          pastExamPaper: {
            // 真题
            html: '',
          },
          difficulty: {
            // 难度
            html: '',
          },
        },
      },
      // 填空题
      fillInBlankQuestion: {
        questionId: null,
        isResources: true,
        questionOrigin: '',
        questionType: 4, // topicType
        isShowDetail: false, // 是否展示详情
        isFavorite: false, // 是否收藏
        parentInfo: {
          parentId: '',
          parentPath: '',
        },
        questionName: '', // topicName
        questionInfo: {
          // topicInfo
          questionTitle: {
            // topicDry
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          rightAnswer: [
            //填空题答案数组形式，默认为有一个选型
            {
              answerOptionId: 1,
              answerOptionKey: 1,
              answerOptionContent: {
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
            {
              answerOptionId: 2,
              answerOptionKey: 2,
              answerOptionContent: {
                html: '',
                text: '',
                textLen: 0,
                imgLen: 0,
              },
            },
          ],
          analysisEnable: false,
          analysis: {
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          judgeSet: {
            // 评判设置 （topicType=4 必须参数）
            sensitive: true, //大小写不同：0-不允许,1-允许（默认））
            order: false, // 答案顺序(多空格)：0-不允许（默认）,1-允许
          },
          examinationSite: {
            // 考点
            html: '',
          },
          record: {
            // 收录
            html: '',
          },
          pastExamPaper: {
            // 真题
            html: '',
          },
          difficulty: {
            // 难度
            html: '',
          },
        },
      },
      // 问答题
      shortAnswerQuestion: {
        questionId: null,
        isResources: true,
        questionOrigin: '',
        questionType: 5, // topicType
        isShowDetail: false, // 是否展示详情
        isFavorite: false, // 是否收藏
        parentInfo: {
          parentId: '',
          parentPath: '',
        },
        questionName: '', // topicName
        questionInfo: {
          // topicInfo
          questionTitle: {
            // topicDry
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          rightAnswer: {
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          analysisEnable: false,
          analysis: {
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          examinationSite: {
            // 考点
            html: '',
          },
          record: {
            // 收录
            html: '',
          },
          pastExamPaper: {
            // 真题
            html: '',
          },
          difficulty: {
            // 难度
            html: '',
          },
        },
      },
      //综合题
      comprehensiveQuestion: {
        questionId: null,
        isResources: true,
        questionOrigin: '',
        questionType: 6, // topicType
        isShowDetail: false, // 是否展示详情
        isFavorite: false, // 是否收藏
        parentInfo: {
          parentId: '',
          parentPath: '',
        },
        questionName: '', // topicName
        questionInfo: {
          questionTitle: {
            // topicDry
            html: '',
            text: '',
            textLen: 0,
            imgLen: 0,
          },
          subQuestions: [
            //默认有一个单选题
          ], //小题列表
          examinationSite: {
            // 考点
            html: '',
          },
          record: {
            // 收录
            html: '',
          },
          pastExamPaper: {
            // 真题
            html: '',
          },
          difficulty: {
            // 难度
            html: '',
          },
        },
      },
    };
  },
  methods: {
    // 点击编辑按钮
    questionEditClickHandler(targetDataUUId) {
      if (!targetDataUUId) return false;
      this.targetDataUUId = targetDataUUId;
      let targetQuestionDom = document.querySelector(`div#tinymce-editor div.question[data-uuid='${targetDataUUId}']`);
      if (!targetQuestionDom) return false;
      let questionType = +targetQuestionDom.getAttribute('data-type') ?? 1;
      const subtopicQuestionObj = this.isSubtopicQuestion(targetQuestionDom);
      let targetSubtopicIndex = 0;
      if (subtopicQuestionObj) {
        questionType = 6;
        targetQuestionDom = subtopicQuestionObj.targetParentCompre;
        targetSubtopicIndex = subtopicQuestionObj.targetSubtopicIndex;
      }
      this.initQuestion(questionType);
      if (questionType === 6) {
        this.generateCompreEditData(targetQuestionDom);
        this.generateCompreDefaultQuestion();
        this.openQuestionEditorDrawer(questionType, this.compreQuestion, targetSubtopicIndex);
      } else {
        this.generateEditData(targetQuestionDom, questionType);
        this.openQuestionEditorDrawer(questionType, this.question, targetSubtopicIndex);
      }
    },
    // 编辑试题弹窗点击确定
    questionEditorDrawerOnOk(args) {
      if (!this.targetDataUUId) return false;
      if (!args[2]) return false;
      // 初始化 htmlList
      this.htmlList = [];
      this.initQuestion(questionType);
      this.question = args[2];
      const { questionType } = args[2];
      if (+questionType === 6) {
        let targetQuestionDom = document.querySelector(
          `div#tinymce-editor div.question[data-uuid='${this.targetDataUUId}']`,
        );
        const compreQuestionDom = targetQuestionDom?.parentNode?.parentNode;
        const compreQuestionDomDataUUId = compreQuestionDom && compreQuestionDom.getAttribute('data-uuid');
        if (compreQuestionDomDataUUId) {
          targetQuestionDom = compreQuestionDom;
        }
        if (!targetQuestionDom) return false;
        this.generateCompreQuestionHtml(targetQuestionDom, args[2].questionInfo, questionType);
      } else {
        this.generateQuestionHtml(args[2].questionInfo, +questionType);
        let targetQuestionDom = document.querySelector(
          `div#tinymce-editor div.question[data-uuid='${this.targetDataUUId}']`,
        );
        if (!targetQuestionDom) return false;
        this.replaceQuestionHtml(targetQuestionDom, +questionType);
        // 判断试题是否有误 矫正编辑试题行的位置
        this.renderQuestion();
      }
    },
    // 打开编辑试题弹窗
    openQuestionEditorDrawer(questionType, paramsQuestionData, targetSubtopicIndex) {
      // TODO:埋点移除
      // pointBatchEditPageOperation({ operation_type: '编辑', question_type_list: [QUESTIONTYPEARR[questionType - 1]] });
      this.$refs.QuestionEditorDrawer.run({
        questionType,
        paramsQuestionData,
        targetSubtopicIndex,
        pathOrigin: 'batchAddQuestion',
        buttonOpts: { continueAdd: false },
      })
        .then((questionInfo) => {
          // this.mixin_questionUpdate(questionItem, questionInfo.questionId);
        })
        .catch(() => {});
    },
    // 初始化 this.question
    initQuestion(questionType) {
      switch (questionType) {
        case 2: // 多选
          this.question = cloneDeep(this.multipleSelectQuestion);
          break;
        case 3: // 判断
          this.question = cloneDeep(this.trueFalseQuestion);
          break;
        case 4: // 填空题
          this.question = cloneDeep(this.fillInBlankQuestion);
          break;
        case 5: // 简答题
          this.question = cloneDeep(this.shortAnswerQuestion);
          break;
        case 6: // 综合题
          this.compreQuestion = cloneDeep(this.comprehensiveQuestion);
          break;
        default: // 单选
          this.question = cloneDeep(this.singleSelectQuestion);
          break;
      }
    },
    // 生成综合题数据
    generateCompreEditData(targetQuestionDom) {
      const targetQuestionWrapperDom = targetQuestionDom.firstChild;
      const compreQuestionTitle = targetQuestionWrapperDom.firstChild;
      if (compreQuestionTitle.className.includes('qt_title')) {
        const compreQuestionTitleContent = this.generateContent(compreQuestionTitle);
        Object.assign(this.compreQuestion.questionInfo.questionTitle, compreQuestionTitleContent);
      }
      const subtopicQuestions = targetQuestionWrapperDom?.getElementsByClassName('question');
      subtopicQuestions.forEach((item) => {
        const subtopicUUId = item.getAttribute('data-uuid');
        if (!subtopicUUId) return;
        const targetQuestionDom = document.querySelector(
          `div#tinymce-editor div.question[data-uuid='${subtopicUUId}']`,
        );
        const subtopicDataType = +item.getAttribute('data-type') ?? 1;
        this.generateEditData(targetQuestionDom, subtopicDataType);
        this.compreQuestion.questionInfo.subQuestions.push(cloneDeep(this.question));
        this.initQuestion(subtopicDataType);
      });
    },
    // 当综合题 没有小题时，生成一个默认综合题小题
    generateCompreDefaultQuestion() {
      const subQuestions = this.compreQuestion?.questionInfo?.subQuestions;
      if (subQuestions?.length === 0) {
        subQuestions.push(cloneDeep(this.singleSelectQuestion));
      }
    },
    // 生成题目数据 单选题/多选题/判断题/填空题/问答题
    generateEditData(targetQuestionDom, questionType) {
      this.initQuestion(questionType);
      const targetQuestionWrapperDom = targetQuestionDom.firstChild;
      targetQuestionWrapperDom.children.forEach((item) => {
        const content = this.generateContent(item, questionType);
        if (item.className.includes('qt_title')) {
          Object.assign(this.question.questionInfo.questionTitle, content);
        } else if (item.className.includes('key')) {
          this.generateEditOptionData(item, content, questionType);
        } else if (item.className.includes('qt_answer')) {
          this.generateEditOAnswerData(item, content, questionType);
        } else if (item.className.includes('qt_analysis')) {
          Object.assign(this.question.questionInfo, { analysisEnable: true, analysis: content });
        }
      });
    },
    // 生成选项数据
    generateEditOptionData(dom, content, questionType) {
      // 单选 多选
      if (questionType === 1 || questionType === 2) {
        const keyArr = ['A', 'B', 'C', 'D'];
        const key = dom.className.match(/key_([A-Z])/);
        if (!key) return false;
        const keyIndex = keyArr.indexOf(key[1]);
        if (keyIndex !== -1) {
          Object.assign(this.question.questionInfo.optionInfo[keyIndex], { optionContent: content });
        } else {
          keyArr.push(key[1]);
          this.question.questionInfo.optionInfo.push({
            optionId: this.question.questionInfo.optionInfo.length + 1,
            optionKey: key[1],
            optionContent: content,
          });
        }
      }
    },
    // 生成答案数据
    generateEditOAnswerData(dom, content, questionType) {
      const answerContent = dom?.getElementsByClassName('content')[0]?.innerText;
      if (!answerContent) return false;
      if (questionType === 1 || questionType === 2) {
        let answerContentArr = answerContent.match(/([A-Z])/gi);
        if (answerContentArr) answerContentArr = answerContentArr.map((item) => item.toUpperCase() || item);
        const filterOptionInfo = this.question.questionInfo.optionInfo.filter((item) =>
          answerContentArr?.includes(item.optionKey),
        );
        const answerContentIdArr = filterOptionInfo?.map((item) => item.optionId) || [1];
        Object.assign(this.question.questionInfo, { rightAnswer: answerContentIdArr });
      } else if (questionType === 3) {
        let answerContentIdArr = [2];
        if (answerContent === 'T' || answerContent === '正确') {
          answerContentIdArr = [1];
        }
        Object.assign(this.question.questionInfo, { rightAnswer: answerContentIdArr });
      } else if (questionType === 4) {
        content.forEach((item, index) => {
          if (index > this.question.questionInfo.rightAnswer.length - 1) {
            this.question.questionInfo.rightAnswer.push(item);
          } else {
            Object.assign(this.question.questionInfo.rightAnswer[index], item);
          }
        });
      } else if (questionType === 5) {
        Object.assign(this.question.questionInfo, { rightAnswer: content });
      }
    },
    // 根据每一部分html生成content对象
    generateContent(dom, questionType) {
      let domText = dom?.getElementsByClassName('content')?.[0]?.innerText ?? '';
      let domInnerHtml = dom?.getElementsByClassName('content')?.[0]?.innerHTML ?? '';
      // 如果是题干 则需要携带题号
      if (dom.className?.includes('qt_title')) {
        domText = '';
        domInnerHtml = '';
        dom.children.forEach((itemDom) => {
          domText += itemDom.innerText;
          domInnerHtml += itemDom.innerHTML;
        });
      }
      const imgNum = this.getHtmlImgNum(dom);
      //填空题的答案 取得是 纯文本 不要 富文本， 因为 填空题的 答案  作答对比时候 有富文本对比不出学生的 正确答案
      if (questionType === 4 && dom.className.includes('qt_answer')) {
        return domText.split('|').map((item, index) => {
          return {
            answerOptionId: index + 1,
            answerOptionKey: index + 1,
            answerOptionContent: {
              html: item,
              text: item,
              textLen: item.length,
              imgLen: imgNum,
            },
          };
        });
      }
      const content = {
        html: domInnerHtml,
        text: domText,
        textLen: domText ? domText.length : 0,
        imgLen: imgNum,
      };
      return content;
    },
    // 获取节点中 图片的数量
    getHtmlImgNum(dom) {
      const domInnerHtml = dom.innerHTML;
      if (!domInnerHtml) return 0;
      return domInnerHtml.match(/<img.*?src=.*?>/)?.length ?? 0;
    },
    // 判断点击的是否是综合题小题，如果是返回综合题DOM，以及综合题小题索引
    isSubtopicQuestion(targetQuestionDom) {
      const targetQuestionDomUUId = targetQuestionDom.getAttribute('data-uuid');
      const targetQuestionWrapperDom = targetQuestionDom.firstChild;
      const qtTitleDOM = targetQuestionWrapperDom?.getElementsByClassName('qt_title')[0];
      const titleDOM = qtTitleDOM?.getElementsByClassName('title')[0];
      const targetParentCompre = targetQuestionDom.parentElement?.parentElement;
      const compreUUId = targetParentCompre?.getAttribute('data-uuid');
      const compreDataType = +targetParentCompre?.getAttribute('data-type');
      if (!compreUUId) return false;
      if (compreDataType !== 6) return false;
      const compreChildrenQuestions = targetParentCompre?.getElementsByClassName('question');
      let targetSubtopicIndex = 0;
      compreChildrenQuestions.forEach((item, index) => {
        if (item.getAttribute('data-uuid') === targetQuestionDomUUId) {
          targetSubtopicIndex = index;
        }
      });
      if (titleDOM) {
        return {
          targetParentCompreUUId: compreUUId,
          targetParentCompre,
          targetSubtopicIndex,
        };
      } else {
        return false;
      }
    },
    // 根据弹窗数据生成html
    generateQuestionHtml(questionInfo, questionType) {
      Object.keys(questionInfo).forEach((itemInfoKey) => {
        if (itemInfoKey === 'questionTitle') {
          const titleObj = questionInfo['questionTitle'];
          this.generateQuestionHtmlTitle(titleObj);
          // questionType 3 表示判断题
        } else if (itemInfoKey === 'optionInfo' && itemInfoKey?.length > 0 && questionType !== 3) {
          const optionArr = questionInfo['optionInfo'];
          this.generateQuestionHtmlOption(optionArr);
        } else if (itemInfoKey === 'rightAnswer') {
          const questionRightAnswer = questionInfo['rightAnswer'];
          this.generateQuestionHtmlAnswer(questionRightAnswer, questionType);
        } else if (itemInfoKey === 'analysis') {
          const analysisObj = questionInfo['analysis'];
          this.generateQuestionHtmlAnalysis(analysisObj);
        }
      });
    },
    // 根据弹窗数据生成 题干 html
    generateQuestionHtmlTitle(titleObj) {
      let questionTitle = titleObj.html?.match(/^\s*([0-9]+)(\.|\s)+/)?.[0];
      let isSubQuestion = false; // 是否是综合题小题
      let subQuestionNum = ''; //综合题小题序号 不带括号
      // 综合题小题
      if (!questionTitle) {
        questionTitle = titleObj.html?.match(/^\s*(\([0-9]+\))(\.|\s)*/)?.[0] ?? '';
        subQuestionNum = titleObj.html?.match(/^\s*(\(([0-9]+)\))(\.|\s)*/)?.[3] ?? '';
        isSubQuestion = true;
      }
      let reg = new RegExp('^' + questionTitle + '');
      if (isSubQuestion && subQuestionNum) reg = new RegExp('^\\(' + subQuestionNum + '\\).');
      const titleObjHtml = titleObj.html.replace(reg, '');
      this.createQuestionHtml('qt_title', questionTitle, titleObjHtml);
    },
    // 根据弹窗数据生成 选项 html
    generateQuestionHtmlOption(optionArr) {
      optionArr.forEach((itemKey) => {
        this.createQuestionHtml(
          `key key_${itemKey.optionKey}`,
          itemKey.optionKey?.trim() + ' ',
          itemKey.optionContent.html + ' ',
        );
      });
    },
    // 根据弹窗数据生成 答案 html
    generateQuestionHtmlAnswer(questionRightAnswer, questionType) {
      if (questionType === 1 || questionType === 2) {
        const charList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        let rightAnswerLetterArr = [];
        // 将[1,2]的数据格式转换成['A','B']的格式
        rightAnswerLetterArr = questionRightAnswer.map((item) => charList[item - 1] ?? '');
        this.createQuestionHtml(
          'qt_answer',
          this.$t('batchSelectQuestion.questionAnswer'),
          rightAnswerLetterArr.join(''),
        );
      } else if (questionType === 3) {
        const charList = ['T', 'F'];
        let rightAnswerLetterArr = [];
        rightAnswerLetterArr = questionRightAnswer.map((item) => charList[item - 1] ?? '');
        this.createQuestionHtml(
          'qt_answer',
          this.$t('batchSelectQuestion.questionAnswer'),
          rightAnswerLetterArr.join(''),
        );
      } else if (questionType === 4) {
        let rightAnswerLetterArr = [];
        rightAnswerLetterArr = questionRightAnswer.map((item) => this.removeHTMLTag(item.answerOptionContent.html));
        this.createQuestionHtml(
          'qt_answer',
          this.$t('batchSelectQuestion.questionAnswer'),
          rightAnswerLetterArr.join('|'),
        );
      } else if (questionType === 5) {
        this.createQuestionHtml('qt_answer', this.$t('batchSelectQuestion.questionAnswer'), questionRightAnswer.html);
      }
    },
    // 根据弹窗数据生成 解析 html
    generateQuestionHtmlAnalysis(analysisObj) {
      this.createQuestionHtml('qt_analysis', this.$t('batchSelectQuestion.questionAnalysis'), analysisObj.html);
    },
    // 根据弹窗数据生成综合题目html
    generateCompreQuestionHtml(targetQuestionDom, questionInfo, questionType) {
      const newTargetCompreQuestionDom = document.createElement('div');
      newTargetCompreQuestionDom.setAttribute('class', 'question');
      newTargetCompreQuestionDom.setAttribute('data-type', questionType);
      const targetQuestionDomUUId = targetQuestionDom.getAttribute('data-uuid');
      newTargetCompreQuestionDom.setAttribute('data-uuid', targetQuestionDomUUId);
      const newTargetCompreQuestionWrapperDom = document.createElement('div');
      newTargetCompreQuestionWrapperDom.setAttribute('class', 'questionWraper');
      newTargetCompreQuestionWrapperDom.appendChild(this.generateCompreTitleHtml(questionInfo));
      const targetQuestionChildrensDom = targetQuestionDom?.getElementsByClassName('question');
      questionInfo.subQuestions.forEach((itemQuestion, index) => {
        this.generateQuestionHtml(itemQuestion.questionInfo, +itemQuestion.questionType);
        newTargetCompreQuestionWrapperDom.appendChild(
          this.replaceQuestionHtml(targetQuestionChildrensDom[index], +itemQuestion.questionType, false),
        );
        newTargetCompreQuestionWrapperDom.appendChild(this.createSplitDom());
      });
      newTargetCompreQuestionDom.appendChild(newTargetCompreQuestionWrapperDom);
      targetQuestionDom.parentElement.replaceChild(newTargetCompreQuestionDom, targetQuestionDom);
      if (targetQuestionDomUUId && +questionType === 6) {
        // 修改综合题大题操作试题行 试题类型
        this.changeQuestionInfoType(targetQuestionDomUUId, +questionType);
      }
      // 矫正编辑试题行的位置
      this.renderQuestion();
    },
    // 根据弹窗数据生成 综合题题干 html
    generateCompreTitleHtml(questionInfo) {
      const targetCompreTitleDom = document.createElement('p');
      targetCompreTitleDom.setAttribute('class', 'qt_title');
      const compreQuestionTitleContent = this.removeHTMLTag(questionInfo.questionTitle.html);
      let questionTitle = compreQuestionTitleContent?.match(/^\s*([0-9]+)(\.|\s)+/)?.[0];
      let isSubQuestion = false; // 是否是综合题小题
      let subQuestionNum = ''; //综合题小题序号 不带括号
      // 综合题小题
      if (!questionTitle) {
        questionTitle = compreQuestionTitleContent?.match(/^\s*(\([0-9]+\))(\.|\s)*/)?.[0] ?? '';
        subQuestionNum = compreQuestionTitleContent?.match(/^\s*(\(([0-9]+)\))(\.|\s)*/)?.[3] ?? '';
        isSubQuestion = true;
      }
      let reg = new RegExp('^' + questionTitle + '');
      if (isSubQuestion && subQuestionNum) reg = new RegExp('^\\(' + subQuestionNum + '\\).');
      const titleObjHtml = compreQuestionTitleContent?.replace(reg, '');
      const compreTitleHtml = `<span class="title"></span><span class="content">${questionTitle}${titleObjHtml}</span>`;
      targetCompreTitleDom.innerHTML = compreTitleHtml;
      return targetCompreTitleDom;
    },
    // 生成试题html
    createQuestionHtml(wrapperHtml, title, content) {
      if (content === '') return '';
      content = this.removeHTMLTag(content);
      const htmlListItem = `<p class="${wrapperHtml}"><span class="title">${title}</span><span class="content">${content}</span></p>`;
      this.htmlList.push(htmlListItem);
    },
    // 替换/返回 指定试题的内容
    replaceQuestionHtml(targetQuestionDom, questionType, isReplace = true) {
      this.htmlList.splice(0, 0, '<div class="questionWraper">');
      this.htmlList.push('</div>');
      const newTargetQuestionDom = document.createElement('div');
      newTargetQuestionDom.setAttribute('data-type', questionType);
      const targetQuestionDomUUId = targetQuestionDom?.getAttribute('data-uuid');
      if (!targetQuestionDomUUId) {
        this.questionNum++;
        newTargetQuestionDom.setAttribute('data-uuid', this.getUniqueValue() + '-' + this.questionNum);
      } else {
        newTargetQuestionDom.setAttribute('data-uuid', targetQuestionDomUUId);
      }
      newTargetQuestionDom.setAttribute('class', 'question');
      newTargetQuestionDom.innerHTML = this.htmlList.join('');
      this.htmlList = [];
      if (targetQuestionDomUUId) {
        this.changeQuestionInfoType(targetQuestionDomUUId, +questionType);
      }
      if (!isReplace) return newTargetQuestionDom;
      targetQuestionDom.parentElement.replaceChild(newTargetQuestionDom, targetQuestionDom);
    },
    // 移除标签
    removeHTMLTag(source) {
      let res = '';
      res = source
        .replace(
          /<\/?(p|div|h[1-6]|ul|li|ol|hr|table|pre|dd|dl|blockquote|address|article|aside|fieldset|footer|form|head|section|tfoot|br|body).*?>/gi,
          '',
        )
        .replace(/<\/?(span).*?>/gi, '')
        // .replace(/<br.*?>/gi, '\r\n')
        .replace(/&lt;br.*?&gt;/gi, '\r\n')
        .replace(/&nbsp;/gi, ' ');
      return res;
    },
    // 获取唯一随机数
    getUniqueValue() {
      // const randomString1 = Math.random().toString(36).substring(2)
      // const randomString2 = Math.random().toString(36).substring(2)
      // randomString1 + randomString2 + '-' + new Date().getTime()
      return (Math.random() + Math.random()).toString().slice(2) + '-' + new Date().getTime();
    },
    // 创建间隔dom
    createSplitDom() {
      const splitDom = document.createElement('p');
      splitDom.setAttribute('class', 'qt_splite');
      splitDom.innerHTML = '<br>';
      return splitDom;
    },
  },
};
