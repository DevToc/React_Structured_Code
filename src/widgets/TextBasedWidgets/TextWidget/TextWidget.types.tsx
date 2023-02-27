import { JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/react';
import { Widget } from '../../../types/widget.types';
import { TextWidgetTag, WidgetState } from '../common/TextBasedWidgets.types';

interface TextWidgetData extends Widget {
  textTag: TextWidgetTag;
  proseMirrorData: JSONContent;
}

export type TextTagStyleConfig = {
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  fontSize: number;
  color: string;
};

// Default text types on side menu
export type DefaultTextType =
  | 'paragraph'
  | 'subtitle'
  | 'title'
  | 'heading 1'
  | 'heading 2'
  | 'heading 3'
  | 'heading 4'
  | 'heading 5'
  | 'heading 6';

interface TextEditorProps {
  widgetState: WidgetState;
  isWidgetSelected: boolean;
  setWidgetState: (arg: WidgetState) => void;
  dispatchUpdateWidget: (options?: Partial<TextWidgetData>) => void;
  editor: Editor | null;
}

export interface TextWidgetToolbarUIControl {
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isOrderedList?: boolean;
  isUnOrderedList?: boolean;
  isLink?: boolean;
  fontFamily?: string;
  fontSize?: string;
  textAlign?: string;
  lineHeight?: string | number;
  color?: string;
  link?: string;
  textTag?: TextWidgetTag;

  toggleBold?: () => void;
  toggleItalic?: () => void;
  toggleUnderline?: () => void;
  setFontFamily?: (fontFamily: string) => void;
  setFontColor?: (color: string) => void;
  setFontSize?: (fontSize: string) => void;
  setTextAlign?: (alignText: string) => void;
  setLineHeight?: (lineHeight: string) => void;
  setOrderedList?: () => void;
  setUnorderedList?: () => void;
  setLink?: (url: string) => void;
  setTextTag?: (textTag: TextWidgetTag) => void;
}

export interface TextWidgetControlKeyboardShortcutsProps {
  setWidgetState: (arg: WidgetState) => void;
  widgetState: WidgetState;
  focusEditor: () => void;
}

export interface UseTextBoundingBoxProps {
  setWidgetState: (arg: WidgetState) => void;
  editor: Editor | null;
  isWidgetSelected: boolean;
}

export interface FontStyleFromTextMarks {
  fontSize: number;
  fontColor: string;
  isBold: boolean;
}

export type { TextWidgetData, TextEditorProps };
