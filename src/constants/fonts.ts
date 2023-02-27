export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 100;
export const FONT_SIZES = [...Array(MAX_FONT_SIZE - MIN_FONT_SIZE)].map((_, i) => i + MIN_FONT_SIZE);

const MIN_LINE_HEIGHT = 0.8;
const MAX_LINE_HEIGHT = 3;
const LINE_HEIGHT_STEP = 0.1;
export const TEXT_LINE_HEIGHT = [...Array(Math.floor((MAX_LINE_HEIGHT - MIN_LINE_HEIGHT) * 10))].map((_, i) =>
  (MIN_LINE_HEIGHT + LINE_HEIGHT_STEP * i).toFixed(1),
);

export enum TEXT_ALIGNMENT {
  left = 'left',
  center = 'center',
  right = 'right',
}

export enum VERTICAL_ALIGNMENT {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}
