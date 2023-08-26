const { all2b } = require('./utils.js');
const questionKeyMap = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
  K: 'K',
  L: 'L',
  M: 'M',
  N: 'N',
  O: 'O',
  P: 'P',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  U: 'U',
  V: 'V',
  W: 'W',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
};
// 获取唯一随机数
function getUniqueValue() {
  return `${(Math.random() + Math.random()).toString().slice(2)}-${new Date().getTime()}`;
}
function init(editor, expose) {
  const RichML = (expose.RichML = function (dialect) {
    switch (typeof dialect) {
      case 'undefined':
        this.dialect = RichML.dialects.Gruber;
        break;
      case 'object':
        this.dialect = dialect;
        break;
      default:
        if (dialect in RichML.dialects) {
          this.dialect = RichML.dialects[dialect];
        } else {
          throw new Error(`Unknown RichML dialect  "${String(dialect)}"`);
        }
        break;
    }
    // 输入方式（input/paste）
    this.input_method = 'input';
    // 题型(默认0) 1 单选 2 多选 4填空
    this.question_type = 0;
  });
  expose.parse = function (source, questionTypeProp) {
    const md = new RichML();
    return md.toTree(source, undefined, questionTypeProp);
  };
  RichML.dialects = {};
  RichML.splitQuestionType = editor.getParam('split_question_type');
  const mk_block = (RichML.mk_block = function (block, trail, line) {
    // Be helpful for default case in tests.
    if (arguments.length === 1) trail = '\n\n';
    // //去掉粘贴到的首尾空格
    // block = block.replace(/(^(&nbsp;\s*)*)|((&nbsp;\s*)*$)/g, "");

    let s = new String(block);
    s.trailing = trail;
    // To make it clear its not just a string
    // s.inspect = mk_block_inspect;
    // s.toSource = mk_block_toSource;

    if (line !== undefined) {
      s.lineNumber = line;
    }
    // 这里是将每个块域的首字母大写
    // 字母前可能有空格
    if (/^\s*([a-h])(\s+|[、|．|.])/i.test(s)) {
      s = s.trim().substr(0, 1).toUpperCase() + s.trim().substr(1, s.trim().length - 1);
    }
    // 这里将中文的顿号自动替换为英文状态下的点
    return s.replace(/^\s*([A-Z]|\d+)[、|．|.]/, '$1.');
  });
  function questionKeysHandler(m, html_tag) {
    const n = m.match(/^\s*[A-Z]/);
    let type = '';
    type = questionKeyMap[n[0].trim()] || 'error';
    const key = [{ tag: `key_${type}`, type: this.question_type, html_tag }];
    Array.prototype.push.apply(key, this.processInline(m));
    return key;
  }
  // 每题的题干、选项、答案和解析匹配
  RichML.dialects.Gruber = {
    block: {
      // 这是题干部分
      qtTitle: function qtTitle(block, next) {
        this.question_type = 0;
        // let m = block.match(/^\s*([0-9]+(\.|\s)+)\s*(.*?)\s*(?:\n|$)/);
        let m = block.match(/^(<img.*?>)?\s*([0-9]+(\.|\s)+)\s*(.*?)\s*(?:\n|$)/);
        // 综合题 小题题干
        const mixM = block.match(/^\s*(\([0-9]+\)(\.|\s)*)\s*(.*?)\s*(?:\n|$)/);
        if (mixM) {
          m = mixM;
          // this.question_type = 6
        }
        if (!m) return undefined;

        const ms = block.replace(/^\s*([0-9]+(\.|\s)+)\s*/, '');

        // let fillInBlankQuestionReg = /([\{]\s*[\}])|(_{3,})/g
        const fillInBlankQuestionReg = /_{3,}/g;
        if (ms.match(fillInBlankQuestionReg)) {
          this.question_type = 4;
        }

        const title = [{ tag: 'title', type: this.question_type }];
        Array.prototype.push.apply(title, this.processInline(m[0]));

        if (m[0].length < block.length)
          next.unshift(mk_block(block.substr(m[0].length), block.trailing, block.lineNumber + 2));
        return [title];
      },
      // 这是选项部分
      qtKey: function qtKey(block, next) {
        this.question_type = 0;
        if (block.match(/_{3,}/g)) return undefined;
        const m = block.match(/^\s*([A-Z])(\.|\s)+\s*(.*?)\s*(?:\n|$)/);
        if (!m) return undefined;
        // 选项单排/横排
        const splitRowKey = /(?=[A-Z]\.\s*\S+)/;
        const singleRowKeys = m[0].split(splitRowKey).filter(Boolean);
        if (singleRowKeys?.length > 1) {
          this.question_type = 1;
          return singleRowKeys.map((item) => {
            return questionKeysHandler.call(this, item, 'p');
          });
        }
        // 有选项，单选or多选，默认为单选
        this.question_type = 1;
        const key = questionKeysHandler.call(this, m[0]);
        if (m[0].length < block.length)
          next.unshift(mk_block(block.substr(m[0].length), block.trailing, block.lineNumber + 2));
        return [key];
      },
      // 这是答案部分
      qtAnswer: function qtAnswer(block, next) {
        this.question_type = 0;
        // block = block.replace(/^\s*【\s*答案\s*】\s*/, ' 答案：');
        const m = block.match(/^\s*【?(答案|Answer)】?\s*[:：]\s*(.*?)\s*(?:\n|$)/);
        if (!m) return undefined;

        if (m[2].match(/^\s*[a-z]\s*(?:\n|$)/i)) {
          // 单选
          this.question_type = 1;
        } else if (m[2].match(/^\s*(正确|错误|T|F)\s*(?:\n|$)/)) {
          // 判断
          this.question_type = 3;
        } else {
          const reg = /^\s*[a-z]{2,8}\s*(?:\n|$)/i;
          if (m[2].match(reg)) {
            // 多选
            this.question_type = 2;
          }
        }
        const answer = [{ tag: 'answer', type: this.question_type }];

        Array.prototype.push.apply(answer, this.processInline(m[0]));

        if (m[0].length < block.length)
          next.unshift(mk_block(block.substr(m[0].length), block.trailing, block.lineNumber + 2));

        return [answer];
      },
      // 这是解析部分
      qtAnalysis: function qtAnalysis(block, next) {
        this.question_type = 0;
        // block = block.replace(/^\s*【\s*解析\s*】\s*/, '解析：');

        const m = block.match(/^\s*((【?(解析|Analysis|Explanation)】?)[:：])\s*(.*?)\s*(?:\n|$)/);

        if (!m) return undefined;

        const analysis = [{ tag: 'analysis', type: this.question_type }];
        Array.prototype.push.apply(analysis, this.processInline(m[0]));

        if (m[0].length < block.length)
          next.unshift(mk_block(block.substr(m[0].length), block.trailing, block.lineNumber + 2));

        return [analysis];
      },
      para: function para(block) {
        this.question_type = 0;
        // everything's a para!
        const paraArr = [[{ tag: 'p', type: this.question_type }].concat(this.processInline(block))];
        return paraArr;
      },
    },
  };
  // 每题的题干、选项、答案和解析 的具体内容
  RichML.dialects.Gruber.inline = {
    __oneElement__: function oneElement(text, patterns_or_re, previous_nodes) {
      let m,
        res,
        lastIndex = 0;
      patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
      let re = new RegExp(`([\\s\\S]*?)(${patterns_or_re.source || patterns_or_re})`);

      m = re.exec(text);
      if (!m) {
        return [text.length, text];
      } else if (m[1]) {
        return [m[1].length, m[1]];
      }
      if (m[2] in this.dialect.inline) {
        res = this.dialect.inline[m[2]].call(this, text.substr(m.index), m, previous_nodes || []);
      }
      // Default for now to make dev easier. just slurp special and output it.
      res = res || [m[1].length, m[2]];
      return res;
    },
    __call__: function inline(text, patterns) {
      let out = [],
        res;

      function add(x) {
        if (typeof x === 'string' && typeof out[out.length - 1] === 'string') out[out.length - 1] += x;
        else out.push(x);
      }

      while (text.length > 0) {
        res = this.dialect.inline.__oneElement__.call(this, text, patterns, out);
        text = text.substr(res.shift());
        res.forEach(add);
      }
      return out;
    },
    '  \n': function lineBreak(text) {
      return [3, ['linebreak']];
    },
  };
  // 根据__order__ 解析顺序依次匹配block
  RichML.prototype.processBlock = function processBlock(block, next, questionTypeProp) {
    const cbs = this.dialect.block;
    let ord = cbs.__order__;
    if (questionTypeProp) ord = this.questionOrder(questionTypeProp);
    if ('__call__' in cbs) {
      return cbs.__call__.call(this, block, next);
    }

    for (let i = 0; i < ord.length; i++) {
      const res = cbs[ord[i]].call(this, block, next);
      if (res) {
        return res;
      }
    }
    return [];
  };
  // 手动划题 单独判定试题的每一部分
  RichML.prototype.questionOrder = function questionOrder(questionTypeProp) {
    const questionOrderMap = {
      1: ['qtTitle', 'qtKey', 'qtAnswer', 'qtAnalysis', 'para'],
      2: ['qtTitle', 'qtKey', 'qtAnswer', 'qtAnalysis', 'para'],
      3: ['qtTitle', 'qtAnswer', 'qtAnalysis', 'para'],
      4: ['qtTitle', 'qtAnswer', 'qtAnalysis', 'para'],
      5: ['qtTitle', 'qtAnswer', 'qtAnalysis', 'para'],
    };
    return questionOrderMap[`${questionTypeProp}`] || questionOrderMap['1'];
  };
  RichML.prototype.processInline = function processInline(block) {
    return this.dialect.inline.__call__.call(this, String(block));
  };
  // 生成解析顺序__order__
  RichML.buildBlockOrder = function (d) {
    let ord = [];
    for (let i in d) {
      if (i === '__order__' || i === '__call__') continue;
      ord.push(i);
    }
    d.__order__ = ord;
  };
  RichML.buildInlinePatterns = function (d) {
    let patterns = [];

    for (let i in d) {
      if (i.match(/^__.*__$/)) continue;
      let l = i.replace(/([\\.*+?|()[\]{}])/g, '\\$1').replace(/\n/, '\\n');

      patterns.push(i.length === 1 ? l : `(?:${l})`);
    }

    patterns = patterns.join('|');
    d.__patterns__ = patterns;
    // print("patterns:", uneval( patterns ) );

    let fn = d.__call__;
    d.__call__ = function (text, pattern) {
      if (pattern !== undefined) {
        return fn.call(this, text, pattern);
      } else {
        return fn.call(this, text, patterns);
      }
    };
  };
  RichML.buildBlockOrder(RichML.dialects.Gruber.block);
  RichML.buildInlinePatterns(RichML.dialects.Gruber.inline);

  // 将输入的内容html转换成对应的数组结构
  RichML.prototype.toTree = function toTree(source, custom_root, questionTypeProp) {
    const blocks = source instanceof Array ? source : this.split_blocks(source);
    const old_tree = this.tree;
    try {
      this.tree = custom_root || this.tree || ['markdown'];

      while (blocks.length) {
        const b = this.processBlock(blocks.shift(), blocks, questionTypeProp);
        if (!b.length) continue;
        this.tree = [...this.tree, ...b];
      }
      return this.tree;
    } finally {
      if (custom_root) {
        this.tree = old_tree;
      }
    }
  };
  // 空行
  function count_lines(str) {
    let n = 0,
      i = -1;
    while ((i = str.indexOf('\n', i + 1)) !== -1) n++;
    // 连续两次或以上换行，视为两道题的分割线
    // if (n>1) blocks.push("-------分割线-------");
    return n;
  }

  // 将输入内容切割成块
  RichML.prototype.split_blocks = function splitBlocks(input) {
    const replaceInput = input.replace(/(\r\n|\n|\r)/g, '\n');
    const re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)*)/g,
      blocks = [];
    let m;

    let line_no = 1;
    // 匹配空行
    if ((m = /^(\s*\n)/.exec(replaceInput)) !== null) {
      // skip (but count) leading blank lines
      line_no += count_lines(m[0]);
      re.lastIndex = m[0].length;
    }

    while ((m = re.exec(replaceInput)) !== null) {
      if (m[2] === '\n#') {
        m[2] = '\n';
        re.lastIndex--;
      }
      blocks.push(mk_block(m[1], m[2], line_no));
      line_no += count_lines(m[0]);
    }
    return blocks;
  };
  const isArray =
    Array.isArray ||
    function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  function extract_attr(jsonml) {
    return isArray(jsonml) && jsonml.length > 1 && typeof jsonml[1] === 'object' && !isArray(jsonml[1])
      ? jsonml[1]
      : undefined;
  }
  // 将输入的内容html转换成对应的数组结构
  expose.toHTMLTree = function toHTMLTree(input, options, questionTypeProp) {
    if (typeof input === 'string') input = this.parse(input, questionTypeProp);
    let attrs = extract_attr(input),
      refs = {};
    // remove references from the tree
    if (attrs && attrs.references) {
      refs = attrs.references;
    }
    let html = convert_tree_to_html(input, refs, options);
    merge_text_nodes(html);
    return html;
  };
  // 将输入的数据转换成特定包裹的html
  expose.toHTML = function toHTML(source, questionTypeProp) {
    // if (this.input_method == 'input') {
    //   source = expose.removeHTMLTag(source);
    // }
    source = all2b(source);
    source = expose.removeHTMLTag(source);
    const input = expose.toHTMLTree(source, undefined, questionTypeProp);
    const toHtml = expose.renderJsonML(input, {}, questionTypeProp);
    return toHtml;
  };
  // 去除标签
  expose.removeHTMLTag = function removeHTMLTag(source, removeImg = false) {
    let res = '';
    // 替换换行
    // .replace(/\<\/?(p|div|h[1-6]|ul|li|ol|hr|table|pre|dd|dl|blockquote|address|article|aside|fieldset|footer|form|head|section|tfoot|span)\s?\S*>/gi, '\r\n')
    res = source
      .replace(
        /<\/?(p|div|h[1-6]|ul|li|ol|hr|table|pre|dd|dl|blockquote|address|article|aside|fieldset|footer|form|head|section|tfoot|br|body).*?>/gi,
        '\r\n',
      )
      .replace(/<\/?(span).*?>/gi, '')
      .replace(/<br.*?>/gi, '\r\n')
      .replace(/&lt;br.*?&gt;/gi, '\r\n')
      .replace(/&nbsp;/gi, ' ');
    return res;
  };
  // 将原数据转化好的数组，生成新的html
  expose.renderJsonML = function (jsonml, options, questionTypeProp) {
    options = options || {};
    options.root = options.root || false;
    let content = [];

    if (options.root) {
      content.push(render_tree(jsonml));
    } else {
      jsonml.shift(); // get rid of the tag
      if (jsonml.length && typeof jsonml[0] === 'object' && !(jsonml[0] instanceof Array)) {
        jsonml.shift(); // get rid of the attributes
      }

      while (jsonml.length) {
        content.push(render_tree(jsonml.shift()));
      }
    }
    // 拼装并还原
    return contentToQuestionList(content, questionTypeProp).join('');
  };
  // content 转换成试题列表
  function contentToQuestionList(content, questionTypeProp) {
    let question_list = [],
      question = [];
    for (let i = 0; i < content.length; i++) {
      // 题干
      if (content[i].tag === 'title' && !questionTypeProp) {
        if (question.length > 0) {
          question_list.push(questionDeal(question, questionTypeProp));
          question = [];
        }
      }

      // 手动划题不根据title切割试题，综合题内的小题除外
      if (content[i].tag === 'title' && questionTypeProp === 6) {
        const isMixQusetionItemTitleBoolean = isMixQusetionItemTitle(content[i].html);
        if (isMixQusetionItemTitleBoolean && i !== 0 && question.length > 0) {
          // 手动划题时选择综合题， 具有大题题干，且具有小题的综合题， 当中的小题，通过自动划题判定试题类型，而不是通过手动指定
          const isMixQusetionItem = isMixQusetionItemTitle(question[0].html) && isQusetionTitle(content[0].html);
          question_list.push(questionDeal(question, questionTypeProp, isMixQusetionItem));
          question = [];
        }
      }
      question.push(content[i]);

      if (i === content.length - 1 && question.length > 0) {
        // 最后一次
        // 手动划题时选择综合题， 具有大题题干，且具有小题的综合题， 当中的小题，通过自动划题判定试题类型，而不是通过手动指定
        const isMixQusetionItem = isMixQusetionItemTitle(question[0].html) && isQusetionTitle(content[0].html);
        question_list.push(questionDeal(question, questionTypeProp, isMixQusetionItem));
        question = [];
      }
    }
    // 处理综合题
    createMixQuestion(question_list);
    return question_list;
  }
  // 判断是否是综合题小题题干
  function isMixQusetionItemTitle(str) {
    const block = expose.removeHTMLTag(str);
    const mixM = block.match(/^\s*(\([0-9]+\)(\.|\s)*)\s*(.*?)\s*(?:\n|$)/);
    return !!mixM;
  }
  // 判断是否是题干
  function isQusetionTitle(str) {
    const block = expose.removeHTMLTag(str);
    const mixM = block.match(/^(<img.*?>)?\s*([0-9]+(\.|\s)+)\s*(.*?)\s*(?:\n|$)/);
    return !!mixM;
  }
  // 处理试题
  let contentNum = 0;
  function questionDeal(content, questionTypeProp, isMixQusetionItem) {
    contentNum += 1;
    let type_list = [],
      html_list = [],
      question_type,
      title_html_list = [],
      outer_html_list = []; // 不合并进question的元素
    // 记录必填项信息
    let tagCount = {
      title: 0,
      key: 0,
      answer: 0,
    };
    let isAnalysisAfter = false;
    const tagArr = content.map((item) => item.tag);
    const lastAnswerIndex = tagArr.lastIndexOf('answer'); // 最后一个答案的位置
    const lastAnswer = content[lastAnswerIndex]; // 最后一个答案
    let contentAnswer; // 最后一个答案的内容
    if (lastAnswer) {
      const parserAnswerDOM = new DOMParser().parseFromString(lastAnswer.html, 'text/html');
      const contentAnswerDOM = parserAnswerDOM?.getElementsByClassName('content')[0];
      contentAnswer = contentAnswerDOM?.textContent?.trim();
    }
    const lastAnswerAfterArr = tagArr.slice(lastAnswerIndex + 1);
    let lastAnswerAfterP = false; // 最后一个答案后是否全为p标签 且答案的格式为 答案:字母  判白
    // 最后一个答案之后全为p标签
    if (new Set(lastAnswerAfterArr).size === 1 && lastAnswerAfterArr[0] === 'p') {
      // 答案的格式为 答案:字母
      if (contentAnswer && contentAnswer.match(/^[a-zA-Z]+$/)?.length > 0) {
        lastAnswerAfterP = true;
      }
    }

    for (let i = 0; i < content.length; i++) {
      type_list.push(content[i].type);
      // 答案之后的非试题内标签 放到试题外面
      if (tagCount.title && lastAnswerAfterP && i > lastAnswerIndex && !questionTypeProp) {
        outer_html_list.push(content[i].html);
        continue;
      } else {
        html_list.push(content[i].html);
      }
      if (content[i].tag.match('title')) {
        tagCount.title++;
        isAnalysisAfter = false;
      } else if (content[i].tag.match('key')) {
        //  解析后面的选项要判定为解析的一部分即使选项换行 格式 解析：A 换行 B
        if (isAnalysisAfter) {
          const ketTagRegExp = new RegExp(`<p class="key ${content[i].tag}">`);
          mergePrevHTML(html_list, i, ketTagRegExp);
        } else {
          tagCount.key++;
        }
      } else if (content[i].tag.match('answer')) {
        if (isAnalysisAfter) {
          const regExpKey = new RegExp('<p class="qt_answer">');
          mergePrevHTML(html_list, i, regExpKey);
        } else {
          tagCount.answer++;
        }
      } else if (content[i].tag.match('analysis')) {
        isAnalysisAfter = true;
      } else if (content[i].tag.match('p')) {
        if (i > 0) {
          // 合并p到上一项
          if (html_list[i - 1].match(/<\/span><\/p>$/)) {
            html_list[i - 1] = html_list[i - 1].replace(/<\/span><\/p>$/, '<br class="markdown_return">');
            html_list[i] = html_list[i].replace(/^<p class="qt_default">/, '').replace(/<\/p>$/, '</span></p>');
          } else if (html_list[i - 1].match(/<\/span><\/span>$/)) {
            // 选项横排的情况 合并p到上一项span
            html_list[i - 1] = html_list[i - 1].replace(/<\/span><\/span>$/, '<br class="markdown_return">');
            html_list[i] = html_list[i].replace(/^<p class="qt_default">/, '').replace(/<\/p>$/, '</span></span>');
          }
        }
      }
    }
    // 试题类型为其中最大值
    question_type = Math.max.apply(null, type_list);
    // 问答题默认为0
    if (question_type === 0) {
      question_type = 5;
    }
    // 答案是 T F 并且没有选项 则是  判断题
    if (question_type === 3 && tagCount.key !== 0 && tagCount.answer === 1) {
      const { html } = content.find((item) => {
        return item.tag === 'answer';
      });
      const parserDOM = new DOMParser().parseFromString(html, 'text/html');
      const contentDOM = parserDOM?.getElementsByClassName('content')[0];
      let answer = contentDOM?.textContent.trim();
      if (answer === 'F' || answer === 'T') {
        question_type = 1;
      }
    }
    // 答案是 T/F 并且没有选项 则是  判断题
    if (question_type === 1 && tagCount.key === 0 && tagCount.answer === 1) {
      const { html } = content.find((item) => {
        return item.tag === 'answer';
      });
      const parserDOM = new DOMParser().parseFromString(html, 'text/html');
      const contentDOM = parserDOM?.getElementsByClassName('content')[0];
      const answer = contentDOM.textContent.trim();
      if (answer === 'F' || answer === 'T') {
        question_type = 3;
      }
    }
    // 没有选项则不是判断题
    if (question_type === 1 || question_type === 2) {
      if (tagCount.key === 0) {
        question_type = 5;
      }
    }
    // 在检查下题干 有没有空格 是不是 填空题
    // let fillInBlankQuestionReg = /([\{]\s*[\}])|(_{3,})/g;
    let fillInBlankQuestionReg = /_{3,}/g;
    let titleStart = false;
    for (let j = 0; j < content.length; j++) {
      const contentTag = content[j].tag;
      if (contentTag.match('title')) {
        titleStart = true;
        title_html_list.push(content[j].html);
      } else if (contentTag.match('key|answer|analysis')) {
        titleStart = false;
      } else if (contentTag.match('p')) {
        if (titleStart) {
          title_html_list.push(content[j].html);
        }
      }
    }
    if (title_html_list.join('').match(fillInBlankQuestionReg)) {
      question_type = 4;
    }
    // 试题有选项，并且答案是选项的填空题 优先判定为多选题/单选题
    if (question_type === 4 && tagCount.key !== 0 && tagCount.answer === 1) {
      const { html } = content.find((item) => {
        return item.tag === 'answer';
      });
      const parserDOM = new DOMParser().parseFromString(html, 'text/html');
      const contentDOM = parserDOM?.getElementsByClassName('content')[0];
      const answer = contentDOM?.textContent.trim();
      const regSingle = /^\s*[a-z]{1,26}\.?\s*(?:\n|$)/i;
      const regMultiple = /^\s*[a-z]{2,8}\s*(?:\n|$)/i;
      if (answer.match(regMultiple)) {
        question_type = 2;
      } else if (answer.match(regSingle)) {
        question_type = 1;
      }
    }
    // 当不存在题干时 不把它判定为题目，及不使用 绿框/红框 包裹 即白题
    if (!tagCount.title && !questionTypeProp) {
      return html_list.join('');
    }
    let questionType = questionTypeProp || question_type;
    if (isMixQusetionItem && `${questionTypeProp}` === '6') questionType = question_type;
    html_list.splice(
      0,
      0,
      `<div class="question" data-type="${questionType}"` + `data-uuid="${getUniqueValue()}-${contentNum}">`,
    );
    html_list.splice(1, 0, '<div class="questionWraper">');
    html_list.push('</div>');
    html_list.push('</div>');
    html_list.push('<p class="qt_splite"></p>');
    html_list.push(outer_html_list.join(''));
    return html_list.join('');
  }
  function escapeHTML(text) {
    return text || '';
  }
  function mergePrevHTML(html_list, index, regExpKey) {
    if (html_list[index - 1].match(/<\/span><\/p>$/)) {
      html_list[index - 1] = html_list[index - 1].replace(/<\/span><\/p>$/, '<br class="markdown_return">');
      html_list[index] = html_list[index].replace(regExpKey, '').replace(/<\/p>$/, '</span></p>');
    }
  }
  // 给试题各个部分添加相应的class及标签
  function render_tree(jsonml) {
    if (typeof jsonml === 'string') {
      return escapeHTML(jsonml);
    }

    let { tag } = jsonml[0],
      html_tag = jsonml[0].html_tag || 'p',
      question_type = jsonml[0].type,
      html_piece = '';

    jsonml.shift();

    let content = [];

    while (jsonml.length) {
      content.push(render_tree(jsonml.shift()));
    }

    let tag_attrs = '';
    let keyReg = /^\s*([A-Z])(\.|\s)+\s*/;

    // be careful about adding whitespace here for inline elements
    // 给试题各个部分添加相应的class
    switch (tag) {
      case 'title':
        tag_attrs = ' class="qt_title"';
        if (content.join('').match(/^\s*([0-9]+)(\.|\s)+/)) {
          html_piece = `<p${tag_attrs}>${content
            .join('')
            .replace(/^\s*([0-9]+)(\.|\s)+/, '<span class="title">$1.</span><span class="content">')}</span></p>`;
        } else {
          // 综合体 小题title
          html_piece = `<p${tag_attrs}>${content
            .join('')
            .replace(/^\s*(\([0-9]+\))(\.|\s)*/, '<span class="title">$1.</span><span class="content">')}</span></p>`;
        }
        break;
      case `key_${questionKeyMap[tag.split('key_')?.[1]]}`:
        tag_attrs = ` class="key ${tag}"`;
        html_piece = `<${html_tag}${tag_attrs}>${content
          .join('')
          .replace(keyReg, '<span class="title">$1.</span><span class="content">')}</span></${html_tag}>`;
        break;
      case 'answer':
        tag_attrs = ' class="qt_answer"';
        html_piece = `<p${tag_attrs}>${content
          .join('')
          .replace(/[｜]/g, '|')
          .replace(
            /^\s*(【?(答案|Answer)】?)\s*[:：]/,
            '<span class="title">$1：</span><span class="content">',
          )}</span></p>`;
        break;
      case 'analysis':
        tag_attrs = ' class="qt_analysis"';
        html_piece = `<p${tag_attrs}>${content
          .join('')
          .replace(
            /^\s*(【?(解析|Analysis|Explanation)】?)[:：]/,
            '<span class="title">$1：</span><span class="content">',
          )}</span></p>`;
        break;
      // case 'answers_order':
      //     tag_attrs = ' class=\'qt_answers_order\'';
      //     html_piece = '<p' + tag_attrs + '>' + content.join('').replace(/(&nbsp;)*答案顺序[:：]/, '<span class=\'title\'>答案顺序：</span><span class=\'content\'>') + '</span></p>';
      //     break;
      // case 'answers_sensitive':
      //   tag_attrs = ' class=\'qt_answers_sensitive\'';
      //   html_piece = '<p' + tag_attrs + '>' + content.join('').replace(/(&nbsp;)*答案大小写[:：]/, '<span class=\'title\'>答案大小写：</span><span class=\'content\'>') + '</span></p>';
      //   break;
      default:
        html_piece = `<${tag} class="qt_default">${content.join('')}</${tag}>`;
    }
    return { html: html_piece, tag: tag, type: question_type };
  }
  function convert_tree_to_html(tree, references, options) {
    let i;
    options = options || {};

    // shallow clone
    let jsonml = tree.slice(0);

    if (typeof options.preprocessTreeNode === 'function') {
      jsonml = options.preprocessTreeNode(jsonml, references);
    }

    // Clone attributes if they exist
    let attrs = extract_attr(jsonml);
    if (attrs) {
      jsonml[1] = {};
      for (i in attrs) {
        jsonml[1][i] = attrs[i];
      }
      attrs = jsonml[1];
    }

    // 这是需要的部分，最基础的
    // basic case
    if (typeof jsonml === 'string') {
      return jsonml;
    }

    // convert this node

    // convert all the children
    i = 1;

    // deal with the attribute node, if it exists
    if (attrs) {
      // if there are keys, skip over it
      for (let key in jsonml[1]) {
        i = 2;
        break;
      }
      // if there aren't, remove it
      if (i === 1) {
        jsonml.splice(i, 1);
      }
    }

    for (; i < jsonml.length; ++i) {
      jsonml[i] = convert_tree_to_html(jsonml[i], references, options);
    }

    return jsonml;
  }
  // merges adjacent text nodes into a single node
  function merge_text_nodes(jsonml) {
    // skip the tag name and attribute hash
    let i = extract_attr(jsonml) ? 2 : 1;

    while (i < jsonml.length) {
      // if it's a string check the next item too
      if (typeof jsonml[i] === 'string') {
        if (i + 1 < jsonml.length && typeof jsonml[i + 1] === 'string') {
          // merge the second string into the first and remove it
          jsonml[i] += jsonml.splice(i + 1, 1)[0];
        } else {
          ++i;
        }
      }
      // if it's not a string recurse
      else {
        merge_text_nodes(jsonml[i]);
        ++i;
      }
    }
  }
  // 生成综合题
  // question_list 试题dom列表
  function createMixQuestion(question_list) {
    // 综合题列表 [[题干索引，小题索引，小题索引，...,综合题html], [题干索引，小题索引，小题索引，...,综合题html]]
    let mixQusetionList = [];
    // 获取综合题索引
    question_list.forEach((html, index) => {
      const parseDOM = new DOMParser().parseFromString(html, 'text/html');
      const questionDOM = parseDOM?.getElementsByClassName('question')[0];
      if (!questionDOM) return;
      const questionWraperDOM = questionDOM?.getElementsByClassName('questionWraper')[0];
      // 获取题干是(1)的形式的试题的索引
      const qtTitleDOM = questionWraperDOM?.getElementsByClassName('qt_title')[0];
      const titleDOM = qtTitleDOM?.getElementsByClassName('title')[0];
      if (titleDOM && titleDOM.textContent.match(/^\s*(\([0-9]+\))(\.|\s)*/)) {
        const isOnlyTitleBoolean = isOnlyTitle(question_list[index - 1]);
        // 当前一项为综合题题干时
        if (isOnlyTitleBoolean) {
          mixQusetionList.push([index - 1, index]);
        } else {
          // 最后一个综合题
          const lastMixQusetion = mixQusetionList[mixQusetionList.length - 1];
          // 综合题内最后一个小题
          const lastMixQusetionItem = lastMixQusetion && lastMixQusetion[lastMixQusetion.length - 1];
          if (lastMixQusetionItem && +lastMixQusetionItem + 1 === +index) {
            lastMixQusetion.push(index);
          }
        }
      }
    });
    appendMixQuestion(question_list, mixQusetionList);
    mixQusetionList.forEach((item) => {
      if (item.length > 0) {
        const delNum = item.length - 1;
        let fillContent = [];
        if (delNum === 2) {
          fillContent = [item[item.length - 1], '<p class="qt_splite"></p>'];
        } else if (delNum > 2) {
          fillContent = [item[item.length - 1], '<p class="qt_splite"></p>', ...Array(delNum - 2).fill('')];
        }
        question_list.splice(item[0], item.length - 1, ...fillContent);
      }
    });
  }
  // 判断是否为只有题干且题干不是(1)的形式 的试题
  function isOnlyTitle(html) {
    const parseDOM = new DOMParser().parseFromString(html, 'text/html');
    const questionDOM = parseDOM?.getElementsByClassName('question')[0];
    if (!questionDOM) return false;
    const questionWraperDOM = questionDOM?.getElementsByClassName('questionWraper')[0];
    const questionWraperChildDOM = questionWraperDOM?.children;
    if (!questionWraperChildDOM.length || questionWraperChildDOM.length > 2) return false;
    // 只有题干且题干不是(1)的形式 的试题
    if (questionWraperChildDOM.length === 1 && isTitle(questionWraperChildDOM[0])) {
      return true;
    }
    // 只有题干和一个选项的试题且题干不是(1)的形式
    if (
      questionWraperChildDOM.length === 2 &&
      isTitle(questionWraperChildDOM[0]) &&
      questionWraperChildDOM[1].className.match(/^key key_/)
    ) {
      return true;
    }
    return false;
  }
  // 不是(1)的形式 的试题题干
  function isTitle(domTitle) {
    if (domTitle.className === 'qt_title') {
      const titleDOM = domTitle?.getElementsByClassName('title')[0];
      if (titleDOM && titleDOM.textContent.match(/^\s*([0-9]+)(\.|\s)+/)) {
        return true;
      }
    }
    return false;
  }
  // 组合综合题
  // question_list 试题列表
  // mixQusetionList 综合题在试题列表内的索引
  function appendMixQuestion(question_list, mixQusetionList) {
    mixQusetionList.forEach((item) => {
      const mixTitle = question_list[item[0]];
      const parseDOM = new DOMParser().parseFromString(mixTitle, 'text/html');
      const questionDOM = parseDOM?.getElementsByClassName('question')[0];
      // data-type改为综合题
      questionDOM && questionDOM.setAttribute('data-type', '6');
      const questionWraperDOM = questionDOM?.getElementsByClassName('questionWraper')[0];
      if (questionWraperDOM) {
        for (let i = 1; i < item.length; i++) {
          questionWraperDOM.innerHTML += question_list[item[i]];
        }
      }
      const questionDOMString = new XMLSerializer().serializeToString(questionDOM);
      item.push(questionDOMString);
    });
  }
}
module.exports = init;
