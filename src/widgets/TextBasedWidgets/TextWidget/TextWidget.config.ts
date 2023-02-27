import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, LineHeight, CustomLink, CustomListItem } from '../common/extensions';

import { Title, CustomKeyboardShortcuts, EmptyTextStyle } from './extensions';

import { TEXT_TAG_TO_STYLES_MAP } from '../common/TextBasedWidgets.config';

import { Key } from '../../../constants/keyboard';

export const KEYBOARD_CONFIG = {
  excludeSpecific: [Key.Enter],
};

export const DEFAULT_TEXT = 'Click to edit text';

const DEFAULT_PM_NODE_ATTRS = {
  lineHeight: '1.2',
  textAlign: 'left',
};

// Default text widget data for each widget in the side menu
export const DEFAULT_TEXT_WIDGET_DATA = {
  title: {
    dimension: {
      width: 433,
      height: 48,
    },
    proseMirrorData: {
      type: 'title',
      attrs: DEFAULT_PM_NODE_ATTRS,
    },
    style: TEXT_TAG_TO_STYLES_MAP.title,
  },
  subtitle: {
    dimension: {
      width: 300,
      height: 34,
    },
    proseMirrorData: {
      type: 'paragraph',
      attrs: DEFAULT_PM_NODE_ATTRS,
    },
    style: TEXT_TAG_TO_STYLES_MAP.subtitle,
  },
  'heading 1': {
    dimension: {
      width: 380,
      height: 43.5,
    },
    proseMirrorData: {
      type: 'heading',
      attrs: {
        ...DEFAULT_PM_NODE_ATTRS,
        level: 1,
      },
    },
    style: TEXT_TAG_TO_STYLES_MAP['heading 1'],
  },
  'heading 2': {
    dimension: {
      width: 315,
      height: 36,
    },
    proseMirrorData: {
      type: 'heading',
      attrs: {
        ...DEFAULT_PM_NODE_ATTRS,
        level: 2,
      },
    },
    style: TEXT_TAG_TO_STYLES_MAP['heading 2'],
  },
  'heading 3': {
    dimension: {
      width: 250,
      height: 29.5,
    },
    proseMirrorData: {
      type: 'heading',
      attrs: {
        ...DEFAULT_PM_NODE_ATTRS,
        level: 3,
      },
    },
    style: TEXT_TAG_TO_STYLES_MAP['heading 3'],
  },
  'heading 4': {
    dimension: {
      width: 215,
      height: 24.5,
    },
    proseMirrorData: {
      type: 'heading',
      attrs: {
        ...DEFAULT_PM_NODE_ATTRS,
        level: 4,
      },
    },
    style: TEXT_TAG_TO_STYLES_MAP['heading 4'],
  },
  'heading 5': {
    dimension: {
      width: 195,
      height: 22,
    },
    proseMirrorData: {
      type: 'heading',
      attrs: {
        ...DEFAULT_PM_NODE_ATTRS,
        level: 5,
      },
    },
    style: TEXT_TAG_TO_STYLES_MAP['heading 5'],
  },
  'heading 6': {
    dimension: {
      width: 170,
      height: 19.5,
    },
    proseMirrorData: {
      type: 'heading',
      attrs: {
        ...DEFAULT_PM_NODE_ATTRS,
        level: 6,
      },
    },
    style: TEXT_TAG_TO_STYLES_MAP['heading 6'],
  },
  paragraph: {
    dimension: {
      width: 164,
      height: 19.5,
    },
    proseMirrorData: {
      type: 'paragraph',
      attrs: DEFAULT_PM_NODE_ATTRS,
    },
    style: TEXT_TAG_TO_STYLES_MAP.paragraph,
  },
};

export const extensions = [
  CustomLink,
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    listItem: false,
  }),
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
  Title,
  CustomKeyboardShortcuts,
  EmptyTextStyle,
];
