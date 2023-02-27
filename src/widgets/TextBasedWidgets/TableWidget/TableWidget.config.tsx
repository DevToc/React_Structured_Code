import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import TableRow from '@tiptap/extension-table-row';

import { FontSize, LineHeight, CustomListItem, CustomLink } from '../common/extensions';
import { Document, CustomTableCell, CustomTableHeader, CustomTable, ColumnResizing, CellSelection } from './extensions';
import { ValidateMovement } from './extensions/validateMovement';

export const CELL_MIN_WIDTH = 25;

export const extensions = [
  Document,
  CustomLink,
  StarterKit.configure({
    document: false,
    heading: false,
    listItem: false,
    codeBlock: false,
  }),
  CustomTable,
  CustomTableHeader,
  CustomTableCell,
  TableRow,
  ColumnResizing.configure({ lastColumnResizable: true, cellMinWidth: CELL_MIN_WIDTH }),
  CellSelection,
  CustomListItem,
  TextStyle,
  FontFamily,
  FontSize,
  Underline,
  Color,
  ...[LineHeight, TextAlign].map((extension) =>
    extension.configure({
      types: ['heading', 'paragraph', 'title'],
    }),
  ),
  ValidateMovement,
];
