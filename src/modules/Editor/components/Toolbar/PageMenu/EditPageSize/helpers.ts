import { PaperType, PageSizeUnit } from 'types/paper.types';
import { PageSizePreset } from 'constants/paper';
import { MAX_NUMBER_INPUT, MIN_NUMBER_INPUT, PIXEL_TO_CM_RATIO, PIXEL_TO_INCHES_RATIO } from './config';

/**
 * Precisely round a giving numeric value to specific number of deciaml place
 *
 * @param value - numeric value
 * @param decimalPlaces - round to number of decimal places
 * @returns
 */
const roundNumber = (value: number, decimalPlaces = 2) => {
  const division = Math.pow(10, decimalPlaces);
  return Math.round((value + Number.EPSILON) * division) / division;
};

/**
 * Convert pixel value to inch
 *
 * @param value - numeric value
 * @returns
 */
const pixelToInch = (value: number): number => roundNumber(value / PIXEL_TO_INCHES_RATIO);

/**
 * Convert pixel value to cm
 *
 * @param value - numeric value
 * @returns
 */
const pixelToCm = (value: number): number => roundNumber(value / PIXEL_TO_CM_RATIO);

/**
 * Convert inch value to pixel
 *
 * @param value - numeric value
 * @returns
 */
const inchToPixel = (value: number): number => Math.round(roundNumber(value * PIXEL_TO_INCHES_RATIO));

/**
 * Convert cm value to pixel
 *
 * @param value - numeric vlaue
 * @returns
 */
const cmToPixel = (value: number): number => Math.round(roundNumber(value * PIXEL_TO_CM_RATIO));

/**
 * Convert giving value to pixel
 *
 * @param value - numeric value
 * @param unit - giving value's unit in [px, in, cm]
 * @returns
 */
const toPixels = (value: number, unit = PageSizeUnit.px) => {
  switch (unit) {
    case PageSizeUnit.cm:
      return cmToPixel(value);
    case PageSizeUnit.in:
      return inchToPixel(value);
    default:
      break;
  }

  return value;
};

/**
 * Match preset paper size base on giving width and height
 *
 * @param pageSize
 * @returns  The paper type if size matches
 */
const getPaperType = ({ widthPx, heightPx }: { widthPx: number; heightPx: number }): PaperType | undefined => {
  for (const [type, preset] of Object.entries(PageSizePreset)) {
    if (
      preset.widthPx === Math.min(widthPx as number, heightPx as number) &&
      preset.heightPx === Math.max(widthPx as number, heightPx as number)
    ) {
      return type as PaperType;
    }
  }
};

/**
 * Format and convert giving pixel value to specific unit value
 *
 * @param value - Value in pixels
 * @param unit - Conversion unit
 * @returns  A value with specific unit
 */
const format = (value: string | number, unit: PageSizeUnit): string => {
  switch (unit) {
    case PageSizeUnit.px:
      return value.toString();
    case PageSizeUnit.in:
      return pixelToInch(Number(value)).toString();
    case PageSizeUnit.cm:
      return pixelToCm(Number(value)).toString();
    default:
      break;
  }

  return '';
};

/**
 * Check whether the value is whithin the min and max input range
 *
 * @param value - A numeric value
 * @returns
 */
const validateSizeInput = (value: unknown): boolean => {
  const checkValue = Number(value);
  return !isNaN(checkValue) && checkValue > MIN_NUMBER_INPUT && checkValue < MAX_NUMBER_INPUT;
};

export { pixelToInch, inchToPixel, pixelToCm, cmToPixel, toPixels, getPaperType, format, validateSizeInput };
