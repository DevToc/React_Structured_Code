import { HANDLE } from '../../../constants/bounding-box';

export const DEFAULT_LINK = 'https://venngage.com';
const DEFAULT_FONT_FAMILY = 'Inter';
export const MIN_FONT_SIZE = 8;

export const BOUNDING_BOX_CONFIG = {
  customHandle: HANDLE.LEFT_RIGHT,
};

export const TABLE_BOUNDING_BOX_CONFIG = {
  customHandle: HANDLE.LEFT_RIGHT,
  rotatable: false,
};

export const MARK_ITEM_BOLD = { type: 'bold' };
export const MARK_ITEM_ITALIC = { type: 'italic' };
export const MARK_ITEM_LINK = {
  type: 'link',
  attrs: {
    href: DEFAULT_LINK,
    target: '_blank',
  },
};

// Default styles for each text widget in side menu
export const TEXT_TAG_TO_STYLES_MAP = {
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: false,
    fontSize: 40,
    color: '#2B2B35',
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: false,
    fontSize: 28,
    color: '#717178',
  },
  'heading 1': {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: false,
    fontSize: 36,
    color: '#2B2B35',
  },
  'heading 2': {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: false,
    fontSize: 30,
    color: '#2B2B35',
  },
  'heading 3': {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: false,
    fontSize: 24,
    color: '#2B2B35',
  },
  'heading 4': {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: true,
    fontSize: 20,
    color: '#717178',
  },
  'heading 5': {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: true,
    fontSize: 18,
    color: '#717178',
  },
  'heading 6': {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: true,
    isItalic: true,
    fontSize: 16,
    color: '#717178',
  },
  paragraph: {
    fontFamily: DEFAULT_FONT_FAMILY,
    isBold: false,
    isItalic: false,
    fontSize: 16,
    color: '#2B2B35',
  },
};
