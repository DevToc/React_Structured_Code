import { PageSizeUnit } from 'types/paper.types';

const PAGE_SIZE_CONTENT_WIDTH = 254;

enum Orientation {
  portrait = 'portrait',
  landscape = 'landscape',
}

const initPageSizeMenuState = {
  unit: PageSizeUnit.px,
  orientation: Orientation.portrait,
};

/**
 * Note: this ratio is matching with Venngage editor 1
 */
const PIXEL_TO_INCHES_RATIO: number = 96;

/**
 * Note: this ratio is matching with Venngage editor 1
 */
const PIXEL_TO_CM_RATIO: number = PIXEL_TO_INCHES_RATIO / 2.54;

const MIN_NUMBER_INPUT = 0;
const MAX_NUMBER_INPUT = 10000;

export {
  MIN_NUMBER_INPUT,
  MAX_NUMBER_INPUT,
  PAGE_SIZE_CONTENT_WIDTH,
  Orientation,
  initPageSizeMenuState,
  PIXEL_TO_INCHES_RATIO,
  PIXEL_TO_CM_RATIO,
};
