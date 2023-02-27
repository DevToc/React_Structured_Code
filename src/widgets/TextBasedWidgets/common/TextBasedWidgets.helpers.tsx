import { JSONContent } from '@tiptap/core';
import cloneDeep from 'lodash.clonedeep';
import { EditorState, TextSelection } from 'prosemirror-state';
import { CellSelection } from '@_ueberdosis/prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { Mark } from 'prosemirror-model';

import {
  MIN_FONT_SIZE,
  TEXT_TAG_TO_STYLES_MAP,
  MARK_ITEM_BOLD,
  MARK_ITEM_ITALIC,
  MARK_ITEM_LINK,
} from './TextBasedWidgets.config';
import { TextWidgetTag, TextTagStyleConfig } from './TextBasedWidgets.types';

/**
 * Converts text style config to array of prosemirror mark data
 *
 * @param style TextTagStyleConfig - style config
 * @returns Prosemirror mark array
 */
export const convertStyleToProseMirrorMark = (style: TextTagStyleConfig, hasLink: boolean = false) => {
  const { fontFamily, isBold, isItalic, fontSize, color } = style;

  const mark = [
    {
      type: 'textStyle',
      attrs: {
        fontFamily,
        fontSize: `${fontSize}px`,
        color,
      },
    },
  ] as { type: string; attrs?: { [key: string]: any } }[];

  if (isBold) mark.push(MARK_ITEM_BOLD);
  if (isItalic) mark.push(MARK_ITEM_ITALIC);
  if (hasLink) mark.push(MARK_ITEM_LINK);

  return mark;
};

/**
 * Searches text nodes for the nearest previous marks in the editor
 *
 * @param state Prosemirror editor state
 * @param tag type of text DOM tag
 * @returns marks[]
 */
export const getNearestMarksFromSelection = (state: EditorState, tag?: TextWidgetTag) => {
  if (!tag) tag = TextWidgetTag.Paragraph;
  const { selection, doc } = state;
  const { $from } = selection;
  const $node = doc.resolve($from.pos);

  const pos = $node.pos;

  return getNearestMarks(state, pos, tag);
};

export const getNearestMarks = (state: EditorState, position: number, tag?: TextWidgetTag) => {
  const { schema, doc } = state;
  let marks: readonly Mark[] = [];
  if (!tag) tag = TextWidgetTag.Paragraph;

  // iterate back through text widget until styles are found
  for (let i = position; !marks.length && i >= 0; i--) {
    const node = doc.nodeAt(i);
    if (node) marks = node.marks;
  }

  // use default styles for specific text tag
  if (!marks.length) {
    const textStyle = TEXT_TAG_TO_STYLES_MAP[tag];
    marks = [
      schema.marks.textStyle.create({
        fontSize: `${textStyle.fontSize}px`,
        color: textStyle.color,
        fontFamily: textStyle.fontFamily,
      }),
    ];
  }

  return marks;
};

/**
 * Searches previous nodes in the editor for styles to apply to the current transaction
 *
 * @param view Prosemirror editor view
 * @param tag type of text DOM tag
 */
export const ensurePreviousMarks = (
  view: EditorView,
  tag: TextWidgetTag,
  from: number,
  to: number,
  text: string,
): boolean => {
  const { state, dispatch } = view;
  const { selection, tr } = state;

  const $node = view.state.doc.resolve(from);
  const node = view.state.doc.nodeAt($node.pos - 1);

  const { handleTextInput } = state.plugins[0].props;

  let result;

  // @ts-ignore -> TODO: update this for plugins
  if (handleTextInput) result = handleTextInput(view, from, to, text);
  if (!result) tr.insertText(text).scrollIntoView();
  else return result;

  const storedMarks = state.storedMarks || selection.$from.marks();

  const isCellSelection = selection instanceof CellSelection;
  const isTextSelection = selection instanceof TextSelection;
  const isEmpty = !node?.textContent.length;
  const hasStoredMarks = storedMarks?.length;

  if (isCellSelection && isEmpty) {
    const marks = getNearestMarksFromSelection(state, tag);

    marks.forEach((mark) => {
      tr.addMark($node.pos, $node.pos + 1 + text.length, mark);
    });
  } else if (isCellSelection && !isEmpty) {
    const paragraphNode = $node.nodeAfter;
    const textNode = paragraphNode?.lastChild;
    const marks = textNode?.marks || [];

    marks.forEach((mark: Mark) => {
      tr.addMark($node.pos, $node.pos + 1 + text.length, mark);
    });
    tr.setNodeMarkup($node.pos, null, paragraphNode?.attrs);
  } else if (isTextSelection && isEmpty && !hasStoredMarks) {
    const marks = getNearestMarksFromSelection(state, tag);

    marks.forEach((mark: Mark) => {
      tr.addMark($node.pos, $node.pos + 1 + text.length, mark);
    });
  }

  dispatch(tr);

  return true;
};

type ModifyAllFontSizeOptions = {
  round?: boolean;
};

/**
 * Modifies all font sizes by the specified ratio
 * @param node prosemirror node
 * @param ratio value by which to increase each font size
 * @returns updated data
 */
export const modifyAllFontSizes = (
  node: JSONContent,
  ratio: number,
  options?: ModifyAllFontSizeOptions,
): JSONContent => {
  const newNode = cloneDeep(node);
  if (newNode.content) {
    newNode.content = newNode.content.map((subNode) => modifyAllFontSizes(subNode, ratio, options));
  } else if (newNode.marks) {
    const textStyle = newNode.marks.find((x) => x.type === 'textStyle') as JSONContent;
    if (textStyle.attrs) {
      const scaledFontSize = parseFloat(textStyle.attrs.fontSize) * ratio;
      const newFontSize = `${Math.max(MIN_FONT_SIZE, options?.round ? Math.round(scaledFontSize) : scaledFontSize)}px`;
      textStyle.attrs.fontSize = newFontSize;
    }
  }

  return newNode;
};
