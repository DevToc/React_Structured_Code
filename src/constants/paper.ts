import { PaperType } from '../types/paper.types';

/**
 * Following preset is from Venngage editor 1
 */
const PageSizePreset = {
  [PaperType.LETTER]: {
    widthPx: 816,
    heightPx: 1056,
    widthIn: 8.5,
    heightIn: 11,
    widthCm: 21.59,
    heightCm: 27.94,
  },
  [PaperType.LEGAL]: {
    widthPx: 816,
    heightPx: 1344,
    widthIn: 8.5,
    heightIn: 14,
    widthCm: 21.59,
    heightCm: 35.56,
  },
  [PaperType.TABLOID]: {
    widthPx: 1056,
    heightPx: 1632,
    widthIn: 11,
    heightIn: 17,
    widthCm: 27.94,
    heightCm: 43.18,
  },
  [PaperType.A3]: {
    widthPx: 1122,
    heightPx: 1588,
    widthIn: 11.69,
    heightIn: 16.54,
    widthCm: 29.69,
    heightCm: 42.02,
  },
  [PaperType.A4]: {
    widthPx: 794,
    heightPx: 1122,
    widthIn: 8.27,
    heightIn: 11.69,
    widthCm: 21.01,
    heightCm: 29.69,
  },
  [PaperType.A5]: {
    widthPx: 560,
    heightPx: 794,
    widthIn: 5.83,
    heightIn: 8.27,
    widthCm: 14.82,
    heightCm: 21.01,
  },
};

export { PageSizePreset };
