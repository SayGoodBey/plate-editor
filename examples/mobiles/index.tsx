/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useCallback, useRef } from 'react';
import RichText from '../../src/index';
import { EditorCursorData, RichTextProps } from './type';
import { decode } from './js-base64';

import { rgbToHex16DomFormatString, textFormat, setRgbTo16 } from './utils';
// import './style/index.module.css';
// import '@/components/RichText/style/index.css';

let whetherEdit = 0; // 判断用户是否编辑过内容 0 表示false 1 表示true
const Textarea: React.FC = () => {
  const info = useRef({
    placeholder: ' ',
    maxLength: 5000,
  } as RichTextProps);
  const [data, setData] = useState(info.current);
  const editorCursorData = useRef({
    editorCursorPosition: -1, // 用于记录当前光标的位置
    editorCursorPositionTimer: null, //
  } as EditorCursorData);

  const handle = useCallback(
    (param: object) => {
      info.current = {
        ...info.current,
        ...param,
      };
      setData(info.current);
    },
    [info],
  );

  const nativeEditorHandle = useCallback(
    (e: any) => {
      const textFilter = (content: string) => {
        content = content
          ?.trim()
          .replace(/[\u200B-\u200D\uFEFF]/g, '')
          .replace(/\n/g, '<br />')
          .trim();
        content = content?.replace(/\n/g, '<p></p>');

        const max = Number(info.current.maxLength); // 不能直接用state值，会存在必包缓存现象，直接取ref中的值即可
        if (content.length > max) {
          // 处理字符串html 标签截取
          const parsedDocument = new DOMParser().parseFromString(content, 'text/html').body;
          let count = 0;
          const deepNode = (dom: any) => {
            const len = dom.length;
            for (let i = 0; i < len; i++) {
              const { childNodes = [], innerHTML = '', nodeName, data } = dom[i];

              if (nodeName === '#text') {
                const node = (innerHTML || data).split(/<[^<>]+>/)[0]?.toString();
                if (node?.length) {
                  count += node?.length;
                }

                if (count >= max) {
                  const temp = max - count;
                  if (node?.length >= Math.abs(temp) && temp !== 0) {
                    if (nodeName === '#text') dom[i].data = dom[i].data.slice(0, temp);
                  }
                  count += temp;
                }
              }
              if (childNodes.length) deepNode(childNodes);
            }
          };
          deepNode(parsedDocument.childNodes);
          content = parsedDocument.innerHTML;
        }

        return content;
      };

      window.quill = {
        markTeacherColor: '', //标记老师颜色，用于复制粘贴功能使用
        pasteBrCount: 0, // 粘贴进来的内容 br 标记统计

        // 自己内部使用
        getTextCount() {
          return textFormat(e.getBody().innerText);
        },

        // 对移动端使用
        getText() {
          return textFormat(e.getBody().innerText).replace(/^\n*|\n*$/g, '');
        },

        getHtmlContent() {
          return rgbToHex16DomFormatString(
            textFormat(e.getBody().innerHTML)
              .replace(/^\n*|\n*$/g, '')
              .replace('<p><br data-mce-bogus="1"></p>', ''),
          );
        },

        getScrollHeight() {
          return e?.getBody()?.parentElement?.scrollHeight || 0;
        },

        getWhetherToEditor() {
          return whetherEdit;
        },

        setEditorBackgroundColor(color: string) {
          if (!color) return;
          return (document.body.style.backgroundColor = color);
        },

        initHtmlContent(content: string) {
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            content = decode(content);
          } else {
            content = decodeURIComponent(content);
          }
          console.log('初始化设置的内容：', content);
          content = textFilter(content);
          e.setContent(content, { format: 'html' });
          whetherEdit = 0;

          // 设置客户端直接设置内容区域后，oldContent 字符统计不更新问题
          e?.plugins?.wordlimit.onAction({
            oldContent: e.getContent(),
          });

          // 重置完内容后给一个统计高度
          window?.lmsWidget?.onEditorHeightChange?.(window?.quill?.getScrollHeight?.());
        },

        setHtmlContent(content: string) {
          if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            content = decode(content);
          } else {
            content = decodeURIComponent(content);
          }

          console.log('重置的内容：', content);

          content = textFilter(content);
          e.setContent(content, { format: 'html' });
          whetherEdit = 1;

          // 设置客户端直接设置内容区域后，oldContent 字符统计不更新问题
          e?.plugins?.wordlimit.onAction({
            oldContent: e.getContent(),
          });

          // 重置完内容后给一个统计高度
          window?.lmsWidget?.onEditorHeightChange?.(window?.quill?.getScrollHeight?.());
        },

        setPlaceholder(placeholder: string) {
          e?.getBody()?.setAttribute('aria-placeholder', placeholder);
          e?.getBody()?.setAttribute('data-mce-placeholder', placeholder);

          const len = textFormat(e?.getBody().innerText).replace(/^\n*|\n*$/g, '').length;
          if (len) e?.getBody().removeAttribute('data-mce-placeholder');

          const divNode = e?.getDoc().createElement('style');
          divNode.innerHTML = `.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before{content:'${placeholder}' !important}`;
          document.head.appendChild(divNode);
          return handle({
            placeholder,
          });
        },

        setFontColor(color: string) {
          if (!color && !e) return;
          e && (e.getBody().style.color = color);
          handle({
            fontColor: color,
          });
        },

        setMaxLength(len: string | number) {
          if (!len) return;
          e?.plugins?.wordlimit.onAction({
            max: len,
          });
          return handle({
            maxLength: len,
          });
        },

        setScrollHeight(value: string | number) {
          if (!value && !e) return;
          e.getBody().style.height = `${value}px`;
          e.getBody().style.overflow = 'auto';
        },

        setEditorMinHeight(value: string | number) {
          if (!value && !e) return;
          e && (e.getBody().style.minHeight = `${value}px`);
        },

        setShowFontSize(value: boolean | number) {
          return handle({
            isShowFontSize: !!value,
          });
        },

        setEnded(value: boolean | number) {
          const ended = !!value;
          if (ended) window.quill.setPlaceholder('');
          return handle({
            ended,
          });
        },

        setPartialFontColor(value: string) {
          console.log('客户端调用setPartialFontColor，色值为：', value);
          if (!value) return;
          e.getBody().blur();

          // 标记颜色，用于粘贴文本使用
          value = value.trim().toLowerCase();
          window.quill.markTeacherColor = value;

          e.on('beforeinput', ({ inputType, data = '' }: any) => {
            console.log(inputType);

            if (inputType === 'insertFromComposition' || inputType === 'insertText') {
              // 联想字符处理
              const value = window.quill.markTeacherColor;
              let range = e.selection.getRng().commonAncestorContainer;
              range = range.nodeName === '#text' ? range.parentNode : range;
              const { color } = range.style;
              const rgb = setRgbTo16(color);
              if (!color || rgb !== value) {
                console.log('进入联想字符增加');
                e.execCommand('mceInsertContent', false, `<span style="color: ${value};">${data}</span>`);
                e?.formatter?.apply('forecolor', { value });
                return false;
              }
            } else if (inputType === 'deleteCompositionText') {
              let range = e?.selection?.getRng()?.commonAncestorContainer; //获取光标当前位置
              range = range.nodeName === '#text' ? range?.parentNode : range;
              const inner = range.innerHTML;
              if (inner.length === 1 && ['\u200B', '\uFEFF'].includes(inner)) {
                console.log('删除零宽字符', range);
                range.remove();

                const node: any = e?.selection?.getRng()?.commonAncestorContainer;
                if (['\u200B', '\uFEFF'].includes(node?.innerHTML)) {
                  node?.remove();
                }

                const prev: any = e?.selection?.getRng()?.commonAncestorContainer?.previousSibling;
                if (['\u200B', '\uFEFF'].includes(prev?.innerHTML)) {
                  prev?.remove();
                }
              }
            }
          });
        },

        setSelectionEnd() {
          if (window.getSelection) {
            e.getBody().focus(); //解决ff不获取焦点无法定位问题
            const range = window.getSelection(); //创建range
            range?.selectAllChildren(e.getBody()); //range 选择obj下所有子内容
            range?.collapseToEnd(); //光标移至最后
          }
        },

        // 针对 ios 进行处理
        setEditorScrollTop() {
          console.log('setEditorScrollTop调用');
          window.scrollTo(0, 0);
          const timer = setTimeout(function () {
            clearTimeout(timer);
            window.scrollTo(0, 0);
          }, 300);
        },

        setEditorFocus() {
          e.getBody().focus();
          window.quill.setSelectionEnd();
        },

        setEditorBlur() {
          console.log('setEditorBlur被调用');
          e.getBody().blur();
        },

        keyBoardDidShow() {
          editorCursorData.current.editorCursorPosition = -1;
          getEditorCursorPosition(e);
        },
      };

      // ios 表示EditorDOM 初始化完成
      handle({ loaded: true });
      window?.lmsWidget?.onEditorDidLoad?.();
      window?.lmsWidget?.onEditorHeightChange?.(window?.quill?.getScrollHeight?.());
      console.log('TinyMCE 初始化完成！默认高度：', window?.quill?.getScrollHeight?.());

      e?.getBody()?.addEventListener(
        'pointerup',
        () => {
          // 非编辑状态下不触发
          if (!info.current?.ended) {
            const height = window?.quill?.getScrollHeight?.();
            window?.lmsWidget?.onEditorBecomeFirstResponder?.();
            window?.lmsWidget?.onEditorHeightChange?.(height);
            getEditorCursorPosition(e);
            console.log('获取焦点事件,已发送给ios，高度：', height);
          }
        },
        false,
      );

      // 针对 ios 用于获取前端输入onFocus 事件
      e?.on(
        'click',
        () => {
          // 非编辑状态下不触发
          if (!info.current?.ended) {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
              window.quill.setEditorScrollTop();
            }

            //发送高度：
            nativeResizeContentHandle();
          }
        },
        false,
      );

      e?.on('input', () => {
        if (info.current?.placeholder && e.getBody().innerText.trim().length === 0) {
          window.quill.setPlaceholder(info.current?.placeholder);
        }
      });

      window.addEventListener('focus', () => {
        console.log('===== window 获取焦点 ========');
        editorCursorData.current.editorCursorPosition = -1;
        getEditorCursorPosition(e);
      });

      //针对 ios 旋转设备,android 默认关闭了旋转操作
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        isPortrait();
      }

      return window;
    },
    [info, whetherEdit],
  );

  const isPortrait = useCallback(() => {
    const onResize = () => {
      console.log('旋转跳跃！！！！！', window.document.body.scrollHeight);
      nativeResizeContentHandle();
    };

    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', onResize, false);
    } else {
      window.addEventListener('resize', onResize, false);
    }
  }, []);

  const getEditorCursorPosition = useCallback((e?: any) => {
    const { editorCursorPosition, editorCursorPositionTimer } = editorCursorData.current;
    editorCursorPositionTimer && clearTimeout(editorCursorPositionTimer);
    // 如果不加延迟的话会导致切换行的时候，第一次获取的行信息不对
    editorCursorData.current.editorCursorPositionTimer = setTimeout(() => {
      const rect = e?.selection?.getBoundingClientRect();
      let rectWin: any = window?.getSelection();
      if (rectWin?.type !== 'None') {
        rectWin = rectWin?.getRangeAt(0)?.getBoundingClientRect();
      }

      // 仅当切换行 && 编辑态的时候才通知客户端
      const bottom = rectWin?.bottom || rect?.bottom;
      if (editorCursorPosition !== bottom && !info.current?.ended) {
        const bottom = rectWin?.bottom || rect?.bottom || -1;
        editorCursorData.current.editorCursorPosition = bottom;
        window?.lmsWidget?.onEditorCursorPositionChange?.(
          JSON.stringify({
            scrollTop: Math.floor(bottom),
            other: {
              ...rectWin,
            },
          }),
        );
        console.log('editorCursorPosition2===========', Math.floor(bottom));
      }
    }, 100);
  }, []);

  const nativeResizeContentHandle = useCallback(() => {
    const timer = setTimeout(() => {
      // 设置ios & android 编辑区域可视高度
      clearTimeout(timer);
      const height = window?.quill?.getScrollHeight?.();
      window?.lmsWidget?.onEditorHeightChange?.(height);
      console.log('onEditorHeightChange发送高度：', height);
    }, 0);
  }, []);

  const nativeChangeHandle = useCallback((value?: string, e?: any) => {
    if (value) whetherEdit = 1;
    const innerHTML = rgbToHex16DomFormatString(
      textFormat(e.getBody().innerHTML).replace('<p><br data-mce-bogus="1"></p>', ''),
    ).trim();
    window?.lmsWidget?.onEditorTextChange?.(
      textFormat(e?.getBody()?.innerText)
        .replace(/^\n*|\n*$/g, '')
        .trim() || '',
      innerHTML || '',
    );
    // 输入内容时，如果光标位置变动，需要通知客户端
    getEditorCursorPosition(e);
  }, []);

  return (
    <RichText
      {...data}
      onChange={(value?: string, e?: any) => nativeChangeHandle(value, e)}
      onLoaded={(e) => nativeEditorHandle(e)}
      onResizeContent={() => nativeResizeContentHandle()}
    />
  );
};

export default React.memo(Textarea);
