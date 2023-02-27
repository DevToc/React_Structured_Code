import { THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH, BORDER_WIDTH } from './Slide.config';

export function reOrder<Type>(list: Type[], startIndex: number, endIndex: number): Type[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const getScale = (heightPx: number, widthPx: number): number => {
  const isSmallerThanTumbnail = heightPx <= THUMBNAIL_HEIGHT && widthPx <= THUMBNAIL_WIDTH;
  if (isSmallerThanTumbnail) return 1;

  const hScale = (THUMBNAIL_HEIGHT - BORDER_WIDTH) / heightPx;
  const wScale = (THUMBNAIL_WIDTH - BORDER_WIDTH) / widthPx;

  return Math.min(wScale, hScale);
};

export const focusSlide = (draggableId: string): void => {
  const slideEl = document.querySelector(`[data-rbd-draggable-id="${draggableId}"]`);
  if (slideEl) (slideEl as HTMLElement).focus();
};
