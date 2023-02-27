import { useCallback, RefObject } from 'react';
import { OnResize } from 'react-moveable';

import { calculateAspectRatioFit } from 'utils/calculateAspectRatioFit';
import { parseStrictNumber } from 'utils/number';

import { BoundingBoxRef } from 'modules/Editor/components/BoundingBox/useBoundingBox';
import { CustomOnResize, CustomOnResizeEnd } from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { parseElementAbsPosition, getTranslateXY } from './ImageWidget.helpers';
import { isSideHandle, getSideHandle, ResizeDirection } from 'utils/boundingBox';

import { FrameShape } from './Frame/frame.types';
import { isSquareFrame } from './Frame/frame';

interface ImageResize {
  rotateDeg: number;
  widgetId: string;
  imageRectRef: RefObject<HTMLDivElement>;
  imageRef: RefObject<HTMLImageElement>;
  frame: FrameShape;
  boundingBox: BoundingBoxRef;
}

/**
 * If the image widget size is decreased from a side handle => crop from the side and update the left | top positioning
 */
const cropFromSide = (
  event: OnResize,
  imageRectRef: RefObject<HTMLDivElement>,
  imageRef: RefObject<HTMLImageElement>,
  onResize: (e: OnResize) => void,
) => {
  if (!imageRectRef.current) return;
  if (!imageRef.current) return;

  const handle = getSideHandle(event.direction);
  const [top, right, bottom, left] = parseElementAbsPosition(imageRectRef.current);
  const imageWidth = parseStrictNumber(imageRectRef.current.style.width);
  const imageHeight = parseStrictNumber(imageRectRef.current.style.height);

  const newLeft = imageWidth - event.width;
  const newTop = imageHeight - event.height;

  if (handle === ResizeDirection.Right) {
    imageRectRef.current.style.right = newLeft - left + 'px';
  }
  if (handle === ResizeDirection.Left) {
    imageRectRef.current.style.left = -(newLeft - right) + 'px';
  }
  if (handle === ResizeDirection.Bottom) {
    imageRectRef.current.style.bottom = newTop - top + 'px';
  }
  if (handle === ResizeDirection.Top) {
    imageRectRef.current.style.top = -(newTop - bottom) + 'px';
  }
  onResize(event);
};

/**
 * If the image widget size is increased from a side handle =>
 * 1. scale the image size
 * 2. Center the crop area
 * 3. Update the widget top/left position
 */
const scaleFromSide = (
  event: OnResize,
  rotateDeg: number,
  imageRectRef: RefObject<HTMLDivElement>,
  imageRef: RefObject<HTMLImageElement>,
  onResize: (e: OnResize) => void,
) => {
  if (!imageRectRef.current) return;
  if (!imageRef.current) return;

  onResize(event);

  const handle = getSideHandle(event.direction);
  const [top, right, bottom, left] = parseElementAbsPosition(imageRectRef.current);
  const target = event.target;
  const imageWidth = parseStrictNumber(imageRectRef.current.style.width);
  const imageHeight = parseStrictNumber(imageRectRef.current.style.height);

  if (handle === ResizeDirection.Left || handle === ResizeDirection.Right) {
    target.style.width = `${event.width}px`;

    const { width: widthPx, height: heightPx } = calculateAspectRatioFit(
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight,
      event.width + left + right,
      Infinity,
    );

    const newTop = top + (heightPx - imageHeight) / 2;
    const newBottom = bottom + (heightPx - imageHeight) / 2;

    // center the crop area
    imageRectRef.current.style.top = -newTop + 'px';
    imageRectRef.current.style.bottom = newBottom + 'px';

    imageRectRef.current.style.width = widthPx + 'px';
    imageRectRef.current.style.height = heightPx + 'px';
  } else {
    const { width: widthPx, height: heightPx } = calculateAspectRatioFit(
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight,
      Infinity,
      event.height + top + bottom,
    );

    const newLeft = left + (widthPx - imageWidth) / 2;
    const newRight = right + (widthPx - imageWidth) / 2;

    // center the crop area
    imageRectRef.current.style.left = -newLeft + 'px';
    imageRectRef.current.style.right = newRight + 'px';

    imageRectRef.current.style.width = widthPx + 'px';
    imageRectRef.current.style.height = heightPx + 'px';
  }
};

/**
 * If the image widget size is changed from a corner handle
 * Re-size the image while keeping the aspect ratio to fit with the widget size (crop area)
 */
const scaleImageWithCropArea = (
  event: OnResize,
  imageRectRef: RefObject<HTMLDivElement>,
  imageRef: RefObject<HTMLImageElement>,
  onResize: (e: OnResize) => void,
) => {
  if (!imageRectRef.current) return;
  if (!imageRef.current) return;

  const target = event.target;
  const [top, right, bottom, left] = parseElementAbsPosition(imageRectRef.current);
  const boundingBoxWidthBefore = parseStrictNumber(target.style.width);
  const boundingBoxHeightBefore = parseStrictNumber(target.style.height);

  const MIN_CROP_SIZE = 1;

  if (event.height <= MIN_CROP_SIZE || event.width <= MIN_CROP_SIZE) return;

  onResize(event);
  // we should get the style sizes after the resize because it'll use the bounding box size changed above.
  const boundingBoxHeight = parseStrictNumber(target.style.height);
  const boundingBoxWidth = parseStrictNumber(target.style.width);

  const hasNoCrop = top === 0 && right === 0 && bottom === 0 && left === 0;
  if (hasNoCrop) {
    imageRectRef.current.style.width = boundingBoxWidth + 'px';
    imageRectRef.current.style.height = boundingBoxHeight + 'px';
    return;
  }

  const totalAreaBefore = boundingBoxWidthBefore + boundingBoxHeightBefore;
  const totalAreaAfter = boundingBoxWidth + boundingBoxHeight;
  const resizeImageChangeRatio = totalAreaAfter / totalAreaBefore;

  const imageWidth = parseStrictNumber(imageRectRef.current.style.width);
  const imageHeight = parseStrictNumber(imageRectRef.current.style.height);

  const { width: widthPx, height: heightPx } = calculateAspectRatioFit(
    imageRef.current.naturalWidth,
    imageRef.current.naturalHeight,
    imageWidth * resizeImageChangeRatio,
    imageHeight * resizeImageChangeRatio,
  );

  imageRectRef.current.style.width = widthPx + 'px';
  imageRectRef.current.style.height = heightPx + 'px';

  if (left || right) {
    const totalWidthCrop = left + right;
    const leftRatio = left / totalWidthCrop;
    const rightRatio = right / totalWidthCrop;

    const distanceLeft = (widthPx - boundingBoxWidth) * leftRatio;
    const distanceRight = (widthPx - boundingBoxWidth) * rightRatio;

    imageRectRef.current.style.left = -distanceLeft + 'px';
    imageRectRef.current.style.right = distanceRight + 'px';
  }

  if (top || bottom) {
    const totalHeightCrop = top + bottom;
    const topRatio = top / totalHeightCrop;
    const bottomRatio = bottom / totalHeightCrop;

    const distanceTop = (heightPx - boundingBoxHeight) * topRatio;
    const distanceBottom = (heightPx - boundingBoxHeight) * bottomRatio;

    imageRectRef.current.style.top = -distanceTop + 'px';
    imageRectRef.current.style.bottom = distanceBottom + 'px';
  }
};

export const useImageResize = ({ rotateDeg, widgetId, imageRectRef, imageRef, frame, boundingBox }: ImageResize) => {
  // When the side handle (n, e, w, s) is used to resize the widget
  // Crop (size reduced) or scale (size increased) the widget
  const handleSideResize = useCallback(
    (event: OnResize, onResize: (e: OnResize) => void) => {
      if (!imageRectRef.current) return;

      const [top, right, bottom, left] = parseElementAbsPosition(imageRectRef.current);
      const handle = getSideHandle(event.direction);

      const imageWidth = parseStrictNumber(imageRectRef.current.style.width);
      const imageHeight = parseStrictNumber(imageRectRef.current.style.height);

      let shouldCrop = false;
      if (handle === ResizeDirection.Top) shouldCrop = imageHeight - bottom > event.height;
      if (handle === ResizeDirection.Bottom) shouldCrop = imageHeight - top > event.height;
      if (handle === ResizeDirection.Left) shouldCrop = imageWidth - right > event.width;
      if (handle === ResizeDirection.Right) shouldCrop = imageWidth - left > event.width;

      if (shouldCrop) return cropFromSide(event, imageRectRef, imageRef, onResize);
      return scaleFromSide(event, rotateDeg, imageRectRef, imageRef, onResize);
    },
    [rotateDeg, imageRectRef, imageRef],
  );

  const onImageResize = useCallback(
    ({ event, onResize }: CustomOnResize) => {
      if (isSideHandle(event.direction) && !isSquareFrame(frame)) return handleSideResize(event, onResize);
      return scaleImageWithCropArea(event, imageRectRef, imageRef, onResize);
    },
    [imageRectRef, imageRef, handleSideResize, frame],
  );

  const onImageResizeEnd = useCallback(
    ({ event, smartGuide, saveWidget }: CustomOnResizeEnd) => {
      const { lastEvent } = event;

      smartGuide?.hide();
      if (!lastEvent) return;
      if (!imageRectRef.current) return;

      const target = event.target;
      const imageWidth = parseStrictNumber(imageRectRef.current.style.width);
      const imageHeight = parseStrictNumber(imageRectRef.current.style.height);

      const widthPx = parseStrictNumber(target.style.width);
      const heightPx = parseStrictNumber(target.style.height);
      const leftPx = parseStrictNumber(target.style.left) + getTranslateXY(target as HTMLElement).translateX;
      const topPx = parseStrictNumber(target.style.top) + getTranslateXY(target as HTMLElement).translateY;

      // The widget has been cropped or the image has been scaled
      if (isSideHandle(lastEvent.direction)) {
        const [top, right, bottom, left] = parseElementAbsPosition(imageRectRef.current);
        const crop = { top, right, bottom, left };

        const imageRect = { widthPx: imageWidth, heightPx: imageHeight };

        const widgetData = { widthPx, heightPx, crop, imageRect, leftPx, topPx };

        target.style.transform = `translate(0px, 0px) rotate(${rotateDeg}deg)`;

        // TODO: remove this when the image widget resize bug is fixed
        boundingBox.updateRect();
        setTimeout(boundingBox.updateRect, 0);

        return saveWidget(widgetId, widgetData);
      }

      const [top, right, bottom, left] = parseElementAbsPosition(imageRectRef.current);
      const crop = { top, right, bottom, left };
      const imageRect = { widthPx: imageWidth, heightPx: imageHeight };

      target.style.transform = `translate(0px, 0px) rotate(${rotateDeg}deg)`;

      saveWidget(widgetId, { imageRect, crop, widthPx, heightPx, topPx, leftPx });

      // TODO: remove this when the image widget resize bug is fixed
      boundingBox.updateRect();
      setTimeout(boundingBox.updateRect, 0);
    },
    [widgetId, rotateDeg, imageRectRef, boundingBox],
  );

  return { onImageResize, onImageResizeEnd };
};
