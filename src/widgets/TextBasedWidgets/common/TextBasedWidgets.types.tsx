import { JSONContent } from '@tiptap/core';
import { Widget } from '../../../types/widget.types';

export interface TextBasedWidgetData extends Widget {
  proseMirrorData: JSONContent;
}

export type TextTagStyleConfig = {
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  fontSize: number;
  color: string;
};

export enum TextWidgetTag {
  Title = 'title',
  H1 = 'heading 1',
  H2 = 'heading 2',
  H3 = 'heading 3',
  H4 = 'heading 4',
  H5 = 'heading 5',
  H6 = 'heading 6',
  Paragraph = 'paragraph',
}

export enum WidgetState {
  Default = 'default',
  Active = 'active',
  Edit = 'edit',
}
