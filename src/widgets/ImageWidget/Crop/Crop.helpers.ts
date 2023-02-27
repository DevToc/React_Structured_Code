import { isSideHandle } from 'utils/boundingBox';
import { PAGE_CONTAINER_CLASSNAME } from 'modules/Editor/Editor.config';
import { Crop } from '../ImageWidget.types';
import { getTranslateXY } from '../ImageWidget.helpers';
import { ImageDragBounds } from './Crop.types';

export const parseCropToInset = (crop: Crop) => {
  if (!crop) return '';

  const { top, right, bottom, left } = crop;
  return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
};

/**
 * Get element position (left / top) without considering any transformation on the element
 */
export const getOffset = (originalElement: HTMLElement) => {
  let element = originalElement;
  let offsetLeft = 0;
  let offsetTop = 0;

  while (element) {
    offsetLeft += element.offsetLeft;
    offsetTop += element.offsetTop;

    element = element.offsetParent as HTMLElement;
  }

  const offset = {
    top: offsetTop,
    bottom: offsetTop + originalElement.clientHeight,
    right: offsetLeft + originalElement.clientWidth,
    left: offsetLeft,
  };

  return offset;
};

/**
 * Calculates the distance between the crop area sides and the draggable image
 * Returns { top, right, bottom, left } as px number
 */
export const getCrop = (target: HTMLElement, draggableImage: HTMLElement, beforeTranslate: number[]): Crop => {
  const targetRect = getOffset(target);
  const draggableImageRect = getOffset(draggableImage);

  const left = Math.floor(Math.abs(targetRect.left + beforeTranslate[0] - draggableImageRect.left));
  const right = Math.floor(Math.abs(targetRect.right + beforeTranslate[0] - draggableImageRect.right));
  const top = Math.floor(Math.abs(targetRect.top + beforeTranslate[1] - draggableImageRect.top));
  const bottom = Math.floor(Math.abs(targetRect.bottom + beforeTranslate[1] - draggableImageRect.bottom));

  const crop = { top, right, bottom, left };

  return crop;
};

/**
 * Calculates the distance between the draggable image and the canvas / page
 * When the image is dragged -> the position of the widget is updated
 * Returns { topPx, leftPx } as px number
 */
export const getImageDistanceToCanvas = (target: HTMLElement, cropTop: number, cropLeft: number) => {
  const pageContainer = document.querySelector(`.${PAGE_CONTAINER_CLASSNAME}`) as HTMLElement;
  if (!pageContainer) return null;

  const clipTargetRect = getOffset(target);
  const canvasRect = getOffset(pageContainer);

  const topPx = clipTargetRect.top + cropTop - canvasRect.top;
  const leftPx = clipTargetRect.left + cropLeft - canvasRect.left;

  const position = { topPx, leftPx };

  return position;
};

/**
 * Calculates the distance between the widget and the crop area
 * Returns { left, top } as px number
 */
export const getImageDragBounds = (cropEl: HTMLElement, widgetBaseEl: HTMLElement): ImageDragBounds => {
  const cropElOffset = getOffset(cropEl);
  const widgetBaseElOffset = getOffset(widgetBaseEl);
  const translate = getTranslateXY(cropEl);

  const top = cropElOffset.top + translate.translateY - widgetBaseElOffset.top;
  const left = cropElOffset.left + translate.translateX - widgetBaseElOffset.left;

  const imageBounds = { top, left };
  return imageBounds;
};

export const isCornerHandle = (moveableDirection: number[]): boolean => !isSideHandle(moveableDirection);
