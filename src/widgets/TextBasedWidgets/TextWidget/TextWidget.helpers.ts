import { JSONContent } from '@tiptap/core';
import { EditorView } from 'prosemirror-view';
import { Mark, Slice } from 'prosemirror-model';
import { WidgetType } from '../../../types/widget.types';
import { DEFAULT_TEXT, DEFAULT_TEXT_WIDGET_DATA } from './TextWidget.config';
import { VERSION } from './TextWidget.upgrade';
import { DefaultTextType, FontStyleFromTextMarks, TextWidgetData } from './TextWidget.types';
import { TextWidgetTag } from '../common/TextBasedWidgets.types';

import { convertStyleToProseMirrorMark, getNearestMarksFromSelection } from '../common/TextBasedWidgets.helpers';

/**
 * Return minimum default text data
 *
 * @returns  default text widget data
 */
export const generateDefaultData = (
  textType: DefaultTextType = 'paragraph',
  text?: string,
  hasLink?: boolean,
  options?: Partial<TextWidgetData>,
) => {
  const defaultWidgetData = DEFAULT_TEXT_WIDGET_DATA[textType];
  const {
    dimension,
    proseMirrorData: { type, attrs },
    style,
  } = defaultWidgetData;

  return {
    widgetType: WidgetType.Text,
    widgetData: {
      version: VERSION,
      topPx: 10,
      leftPx: 20,
      widthPx: dimension.width,
      heightPx: dimension.height,
      rotateDeg: 0,
      textTag: textType === 'subtitle' ? TextWidgetTag.Paragraph : (textType as TextWidgetTag),
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: type,
            attrs,
            content: [
              {
                type: 'text',
                text: text || DEFAULT_TEXT,
                marks: convertStyleToProseMirrorMark(style, hasLink),
              },
            ],
          },
        ],
      },
      ...options,
    },
  };
};

/**
 * Returns the text marks array that stored the font size, style, and color of the first character in proseMirrorData.
 * Used for text data parsing in color contrast checker.
 *
 * @param proseMirrorData {JSONContent}
 * @returns first character's marks array
 */
export const getFirstCharacterTextMarks = (proseMirrorData: JSONContent): JSONContent['marks'] => {
  // Recursive function to get the first content
  const getFirstContent = (content: JSONContent): JSONContent => {
    if (content?.content && content?.content.length) {
      return getFirstContent(content.content[0]);
    }
    return content;
  };

  const firstContent = getFirstContent(proseMirrorData);
  if (firstContent?.marks) {
    return firstContent.marks;
  }
};

/**
 * Returns the font color, size and isBold using the textMarks array
 * Used for text data parsing in color contrast checker.
 *
 * @param textMarks {JSONContent['marks']}
 * @returns object that has fontColor, fontSize and isBold
 */
export const getFontStyleFromTextMarks = (textMarks: JSONContent['marks']): FontStyleFromTextMarks => {
  const textStyle = textMarks?.find((mark) => mark.type === 'textStyle');
  const fontColor = textStyle?.attrs?.color ?? null;
  const fontSize = textStyle?.attrs?.fontSize ?? null;
  const isBold = !!textMarks?.find((mark) => mark.type === 'bold');

  return {
    fontColor,
    fontSize,
    isBold,
  };
};

/**
 * Iterates through the passed data structure to replace any marks with the given ones
 *
 * @param slice Prosemirror slice to replace marks
 * @param marks Styles for overriding
 * @returns node with replaced marks
 */
export const replaceMarks = (slice: Slice, marks: readonly Mark[]): Slice => {
  slice?.content.descendants((child) => {
    if (child.isText) {
      /**
       * TODO: preserve previous assignment logic
       * Note: child.marks is readonly, it needs to fix with proper mutation method
       */
      // @ts-ignore
      child.marks = Mark.setFrom(marks);
    }
  });

  return slice;
};

/**
 * Handles the paste event in the prosemirror editor
 * @param view current editor view
 * @param slice section of data being pasted
 */
export const handlePaste = (view: EditorView, slice: Slice, tag: TextWidgetTag): boolean => {
  const { state, dispatch } = view;
  const { tr } = state;

  let marks: readonly Mark[];

  // if current text content is empty, use stored marks
  if (!state.doc.textContent && state.storedMarks?.length) {
    marks = state.storedMarks;
  } else {
    marks = getNearestMarksFromSelection(state, tag);
  }

  // replace marks in copied text
  const newSlice = replaceMarks(slice, marks);

  // paste copied text
  tr.replaceSelection(newSlice);

  dispatch(tr);

  return true;
};
