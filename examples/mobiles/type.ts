/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent } from 'react';

export interface RichTextProps {
  plugins?: string[];
  toolbar?: string;
  height?: string | number;
  initialValue?: string | undefined;
  maxLength?: string | number;
  fontColor?: string | never;
  placeholder?: string | never;
  backgroundColor?: string | never;
  isShowFontSize?: boolean;
  ended?: boolean;
  loaded?: boolean;
  className?: string;
  onChange?: (value?: string, e?: MouseEvent<HTMLElement>) => void;
  onLoaded?: (e?: MouseEvent<HTMLElement>) => void;
  onFocus?: (e?: MouseEvent<HTMLElement>) => void;
  onResizeContent?: (e?: any) => void;
}

export interface EditorCursorData {
  editorCursorPosition: number;
  editorCursorPositionLeft: number;
  editorCursorPositionTimer: any;
}
