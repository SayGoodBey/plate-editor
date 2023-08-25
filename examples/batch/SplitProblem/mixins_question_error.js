import $ from './jquery';
export default {
  // questionNum: 0,
  // errorNum: 0,
  methods: {
    renderQuestion() {
      let self = this;
      // 选项列表
      let charList = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ];
      // 排除选项列表 选择题选项只支持8项 从A-H
      // var charExludeList = ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      let questions = $('#tinymce-editor .question');
      // 试题数量
      let questionNum = questions.length;

      // 错误提示语

      // 题干不能为空
      let stemNotBeEmptyValidate = '题干不能为空';
      // 题干字数不能大于5000
      let stemWordsValidate = '题干字数不能大于5000';
      // 答案需要唯一
      let answerNeedUniqueValidate = '答案需要唯一';
      // 答案不能为空
      let answerNotEmptyValidate = '答案不能为空';
      // 答案不正确
      let answerNotRightValidate = '答案不正确';
      // 答案字数不能大于2000
      let answerWordsValidate = '答案字数不能大于2000';
      // 答案字数不能大于200
      let answerWords200Validate = '答案字数不能大于200';
      // 至少输入两个选项
      let enterAtLeastTwoOptionsValidate = '至少输入两个选项';
      // 选项重复
      let duplicateOptionsValidate = '选项重复';
      // 选项缺失,请检查
      let optionIsMissingValidate = '选项缺失,请检查';
      // 选项内容字数不能为空
      let optionWordsEmptyValidate = '选项内容字数不能为空';
      // 选项内容字数不能大于200
      let optionWordsValidate = '选项内容字数不能大于200';
      // 答案与选项不匹配
      let answerNotMatchOptionsValidate = '答案与选项不匹配';
      // 答案与选项不匹配
      let answerCanNotContainPicturesValidate = '答案与选项不匹配';
      // 存在空白答案，请检查答案或“|”数量
      let blankAnswerValidate = '存在空白答案，请检查答案或“|”数量';
      // 答案与空格数量不匹配
      let answerNotMatchTheNumberOfSpacesValidate = '答案与空格数量不匹配';
      // 解析只能唯一
      let parsingNeedUniqueValidate = '解析只能唯一';
      // 解析内容字数不能大于2000
      let parsingWordsValidate = '解析内容字数不能大于2000';

      // 答案不能为公式 (主要是 单选题,du)
      let answerNotBeAFormula = '答案不能为公式 (主要是 单选题,du)';
      // 校验错误
      $('#tinymce-editor .question').each((index, element) => {
        // 题型
        let question_type = Number($(element).attr('data-type'));
        // 综合题报错报道小题内，综合题外层不会报错
        if (question_type === 6) {
          return true;
        }
        // 题干
        if ($(element).find('.qt_title').length === 0) {
          $(element).attr('data-error', stemNotBeEmptyValidate).addClass('check_error');
          $(element).find('.questionWraper').attr('data-error', stemNotBeEmptyValidate);
          return true;
        }
        const qtTitleContent = $(element).find('.qt_title .content');
        const qtTitleContentIsNull = qtTitleContent.html()?.trim().length === 0 || !qtTitleContent.html();
        if ($(element).find('.qt_title').length !== 0 && qtTitleContentIsNull) {
          $(element).attr('data-error', stemNotBeEmptyValidate).addClass('check_error');
          $(element).find('.questionWraper').attr('data-error', stemNotBeEmptyValidate);
          return true;
        }
        if ($(element).find('.qt_title .content').text()?.trim().length > 5000) {
          $(element).attr('data-error', stemWordsValidate).addClass('check_error');
          $(element).find('.questionWraper').attr('data-error', stemWordsValidate);
          return true;
        }

        // 答案(取html，答案中可能带图片)
        let answer = ''; // 纯文本答案
        let answerHtml = ''; // 带标签的答案
        let answerDomList = $(element).find('.qt_answer');

        if (answerDomList.length > 1) {
          // 不止一个答案
          $(element).attr('data-error', answerNeedUniqueValidate).addClass('check_error');
          $(element).find('.questionWraper').attr('data-error', answerNeedUniqueValidate);
          return true;
        } else if (answerDomList.length === 1) {
          let answerDom = answerDomList.find('.content');
          answer = answerDom.text()?.trim();
          answerHtml = answerDom.html()?.trim();
          answerHtml = answerHtml ?? '';
          // 答案为空
          if (answerHtml === '' && answer === '') {
            if (question_type !== 5) {
              $(element).attr('data-error', answerNotEmptyValidate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', answerNotEmptyValidate);
              return true;
            }
          } else {
            if (question_type === 1 || question_type === 2) {
              // var reg = /^\s*[a-z]{1,8}\s*(?:\n|$)/i
              // 兼容答案为 C. 格式的情况
              let reg = /^\s*[a-z]{1,26}\.?\s*(?:\n|$)/i;
              if (!reg.test(answer)) {
                $(element).attr('data-error', answerNotMatchOptionsValidate).addClass('check_error');
                $(element).find('.questionWraper').attr('data-error', answerNotMatchOptionsValidate);
                return true;
              }
              // 单选题答案不能出现多个 如 答案:ABC
              if (question_type === 1) {
                const isOnlyKeyReg = /^\s*[a-z]{1}\.?\s*(?:\n|$)/i;
                if (!isOnlyKeyReg.test(answer)) {
                  $(element).attr('data-error', answerNeedUniqueValidate).addClass('check_error');
                  $(element).find('.questionWraper').attr('data-error', answerNeedUniqueValidate);
                  return true;
                }
              }
              // 判断是不是公式
              if (answerHtml?.indexOf('MathJax') > -1) {
                $(element).attr('data-error', answerNotBeAFormula).addClass('check_error');
                $(element).find('.questionWraper').attr('data-error', answerNotBeAFormula);
                return true;
              }
            } else if (question_type === 3) {
              if (!/^\s*(正确|错误|T|F)\s*(?:\n|$)/.test(answer)) {
                $(element).attr('data-error', answerNotRightValidate).addClass('check_error');
                $(element).find('.questionWraper').attr('data-error', answerNotRightValidate);
                return true;
              }
            } else if (question_type === 4) {
              // 判断是不是公式
              if (answerHtml?.indexOf('MathJax') > -1) {
                $(element).attr('data-error', answerNotBeAFormula).addClass('check_error');
                $(element).find('.questionWraper').attr('data-error', answerNotBeAFormula);
                return true;
              }
            } else if (question_type === 5 && answer?.length > 2000) {
              $(element).attr('data-error', answerWordsValidate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', answerWordsValidate);
              return true;
            }
            if (question_type !== 5) {
              // if (/markdown_return/.test(answerHtml)){
              //   $(element).attr('data-error', answerNotRightValidate).addClass('check_error');
              //   $(element).find('.questionWraper').attr('data-error', answerNotRightValidate);
              //   return true;
              // }
            }
          }
        } else {
          // 答案为空
          if (answerHtml === '' || answer === '') {
            if (question_type !== 5) {
              $(element).attr('data-error', answerNotEmptyValidate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', answerNotEmptyValidate);
              return true;
            }
          }
        }
        // 选项与 选择题答案
        if (question_type === 1 || question_type === 2) {
          // 选择题

          if ($(element).find('.key').length < 2) {
            $(element).attr('data-error', enterAtLeastTwoOptionsValidate).addClass('check_error');
            $(element).find('.questionWraper').attr('data-error', enterAtLeastTwoOptionsValidate);
            return true;
          }

          answer = answer?.toUpperCase();

          // for中 有重复选项跳出时的标志
          let breakFlag = false;
          for (let i = 0; i < charList.length; i++) {
            let charDomLength = $(element).find(`.key_${charList[i]}`).length;

            if (charDomLength > 1) {
              // 有重复选项
              $(element).attr('data-error', duplicateOptionsValidate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', duplicateOptionsValidate);
              breakFlag = true;
              break;
            } else if (charDomLength === 1) {
              if (answer?.indexOf(charList[i]) !== -1) {
                $(element).find(`.key_${charList[i]}`).addClass('active');
                // 已匹配的答案删除
                answer = answer?.replace(charList[i], '');
              }
            }
          }
          if (breakFlag) {
            return true;
          }

          // 判断选项是否跳序了
          let outOfOrderFlag = false;
          // 所有选项
          let charDomList = $(element).find('.key');
          for (let j = 0; j < charDomList?.length; j++) {
            let title = $(charDomList[j]).find('.title').text()?.trim();
            // let n = title.match(/^[A-H]\.?/);
            let n = title.match(/^[A-H]/);
            if (n && n[0]) {
              if (n[0] !== charList[j]) {
                // 有选项跳序了
                $(element).attr('data-error', optionIsMissingValidate).addClass('check_error');
                $(element).find('.questionWraper').attr('data-error', optionIsMissingValidate);
                outOfOrderFlag = true;
                break;
              }
            }
          }
          if (outOfOrderFlag) {
            return true;
          }
          // 判断选项内容是否超过200个字了
          let outOfFontFlag = false;
          // 判断选项内容是否为空
          let emptyFlag = false;
          for (let k = 0; k < charDomList?.length; k++) {
            let content = $(charDomList[k]).find('.content').text()?.trim();
            let contentHtml = $(charDomList[k]).find('.content').html()?.trim();
            if (!contentHtml) {
              emptyFlag = true;
              $(element).attr('data-error', optionWordsEmptyValidate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', optionWordsEmptyValidate);
              break;
            }
            if (content && content.length > 200) {
              outOfFontFlag = true;
              $(element).attr('data-error', optionWordsValidate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', optionWordsValidate);
              break;
            }
          }
          if (emptyFlag) {
            return true;
          }
          if (outOfFontFlag) {
            return true;
          }
          // 有多余答案(或图片)
          let answerNotMatch = answer !== '';
          // 兼容答案为 C. 格式的情况
          if (answer === '.') {
            answerNotMatch = false;
          }
          if (answerNotMatch) {
            // if(answer.match(/^[A-H]/)){
            //   $(element).attr('data-error', '答案重复').addClass('check_error');
            //   return true
            // }
            $(element).attr('data-error', answerNotMatchOptionsValidate).addClass('check_error');
            $(element).find('.questionWraper').attr('data-error', answerNotMatchOptionsValidate);
            return true;
          }
        } else if (question_type === 3) {
          // 待校验
        } else if (question_type === 4) {
          // 填空题答案不能包含图片
          if (answerHtml.match(/<img.*?>/)) {
            $(element).attr('data-error', answerCanNotContainPicturesValidate).addClass('check_error');
            $(element).find('.questionWraper').attr('data-error', answerCanNotContainPicturesValidate);
            return true;
          }

          // 填空题（匹配答案和填空数）
          let title = $(element).find('.qt_title .content').text();
          // let fillInBlankQuestionReg = /([{]\s*[}])|(_{3,})/g
          let fillInBlankQuestionReg = /_{3,}/g;
          let blanks = title.match(fillInBlankQuestionReg),
            blankNum = 0;
          if (blanks) {
            blankNum = blanks.length;
          }
          // 填空题是空白答案标志
          let blankAnswerFlag = false;
          // 剔除所有空答案

          answer = answer
            .replace(/\s/g, '')
            .split('|')
            .filter((i) => {
              if (i === '') {
                blankAnswerFlag = true;
              }
              return i !== '';
            });
          if (blankAnswerFlag) {
            $(element).attr('data-error', blankAnswerValidate).addClass('check_error');
            $(element).find('.questionWraper').attr('data-error', blankAnswerValidate);
            return true;
          }
          let answerNum = answer.length;

          if (blankNum !== answerNum) {
            $(element).attr('data-error', answerNotMatchTheNumberOfSpacesValidate).addClass('check_error');
            $(element).find('.questionWraper').attr('data-error', answerNotMatchTheNumberOfSpacesValidate);
            return true;
          }

          // 填空题答案内容是否超过200个字了
          let outOfFontFlag2 = false;
          for (let l = 0; l < answer.length; l++) {
            let content = answer[l];
            if (content.length > 200) {
              $(element).attr('data-error', answerWords200Validate).addClass('check_error');
              $(element).find('.questionWraper').attr('data-error', answerWords200Validate);
              break;
            }
          }
          if (outOfFontFlag2) {
            return true;
          }
        }

        // 解析
        let analysisDomList = $(element).find('.qt_analysis');
        if (analysisDomList.length > 1) {
          $(element).attr('data-error', parsingNeedUniqueValidate).addClass('check_error');
          $(element).find('.questionWraper').attr('data-error', parsingNeedUniqueValidate);
          return true;
        } else if (analysisDomList.length === 1) {
          let content = analysisDomList.find('.content').text()?.trim();
          // var contentHtml = analysisDomList.find('.content').html().trim();
          if (content && content.length > 2000) {
            $(element).attr('data-error', parsingWordsValidate).addClass('check_error');
            $(element).find('.questionWraper').attr('data-error', parsingWordsValidate);
            return true;
          }
        }
      });
      // 处理综合题报错信息
      self.renderCompreErrorMessage();
      // 默认状态
      // $('#nextError').attr('data-index', 0);
      // 统计试题数和错误数量
      self.questionNum = questionNum;
      self.errorNum = $('.question.check_error').length;
      // TODO: 需要解决
      // self.setQuestionOperation();
      const tinymceEditorContent = window.tinymce.editors['tinymce-editor']?.getContent();
      if (tinymceEditorContent) {
        this.$emit('changeTinyContent', tinymceEditorContent, true);
      }
    },
    renderCompreErrorMessage() {
      // 综合题内存在错误
      const compreSubtopicHasError = this.$t('batchSelectQuestion.compreSubtopicHasError');
      // 综合题 大题 需至少添加一个小题
      const compreSubtopicNoQuestion = this.$t('batchSelectQuestion.compreSubtopicNoQuestion');
      // 综合题不存在题干
      const compreSubtopicNoTitle = this.$t('batchSelectQuestion.compreSubtopicNoTitle');
      // 综合题小题数量不能超过50
      const compreSubtopicNumOverStep = this.$t('batchSelectQuestion.compreSubtopicNumOverStep');
      const compreQuestionDoms = document.querySelectorAll(
        '#tinymce-editor-wrapper #tinymce-editor .question[data-type="6"]',
      );
      compreQuestionDoms.forEach((itemSubtopic) => {
        const itemSubtopicWrapper = itemSubtopic.firstChild;
        const itemSubtopicTitleDOMArr = $(itemSubtopicWrapper).children('.qt_title');
        const compreSubtopicQuestionErrDoms = itemSubtopic.getElementsByClassName('question check_error');
        const compreSubtopicQuestionDoms = itemSubtopic.getElementsByClassName('question');
        if (compreSubtopicQuestionErrDoms?.length > 0) {
          $(itemSubtopic).attr('data-error', compreSubtopicHasError).addClass('check_error');
          $(itemSubtopic).find('.questionWraper').attr('data-error', compreSubtopicHasError);
          return false;
        } else {
          if (itemSubtopicTitleDOMArr?.length === 0) {
            $(itemSubtopic).attr('data-error', compreSubtopicNoTitle).addClass('check_error');
            $(itemSubtopic).find('.questionWraper').attr('data-error', compreSubtopicNoTitle);
            return false;
          }
          if (compreSubtopicQuestionDoms?.length === 0) {
            $(itemSubtopic).attr('data-error', compreSubtopicNoQuestion).addClass('check_error');
            $(itemSubtopic).find('.questionWraper').attr('data-error', compreSubtopicNoQuestion);
            return false;
          }
          if (compreSubtopicQuestionDoms?.length > 50) {
            $(itemSubtopic).attr('data-error', compreSubtopicNumOverStep).addClass('check_error');
            $(itemSubtopic).find('.questionWraper').attr('data-error', compreSubtopicNumOverStep);
            return false;
          }
        }
      });
    },
  },
};
