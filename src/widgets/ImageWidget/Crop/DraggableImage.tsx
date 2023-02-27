import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import Moveable, { OnDrag, OnDragEnd, OnDragStart } from 'react-moveable';
import { Image, Box } from '@chakra-ui/react';

import { cropToAbsolutePosition } from '../ImageWidget.helpers';
import { getCrop, getImageDistanceToCanvas, getOffset } from './Crop.helpers';
import { DraggableImageProps, CropAreaBounds } from './Crop.types';
import { parseStrictNumber } from '../../../utils/number';

export const DraggableImage = ({
  imageData,
  cropRef,
  areaTranslate,
  setCropAreaBounds,
  imageDragBounds,
  imageMoveableRef,
  zoom,
  dragTargetRef,
  cropImageRef,
  setIsDragging,
  widgetBaseRef,
}: DraggableImageProps) => {
  const { url, crop, imageWidth, imageHeight, altText } = imageData;
  const [translate, setTranslate] = useState<number[]>([0, 0]);
  const [top, right, bottom, left] = cropToAbsolutePosition(crop);
  const startPos = useRef({ top: 0, left: 0 });

  const onDragStart = (e: OnDragStart) => {
    setIsDragging(true);

    const target = e.target;
    startPos.current.top = parseStrictNumber(target.style.top);
    startPos.current.left = parseStrictNumber(target.style.left);

    e.set(translate);
  };

  const onDrag = (e: OnDrag) => {
    if (!imageDragBounds) return;
    if (!cropRef.current) return;

    const { left, top, target, dist } = e;
    const [widthDist, topDist] = dist;
    const isDragDown = topDist > 0;
    const isDragRight = widthDist > 0;

    // Dragging the image is limited to the inner bounds of the cropped area
    // -> image cannot be dragged outside of the crop area

    if (isDragDown) {
      const isWithinTopBound = top < imageDragBounds.top;
      if (isWithinTopBound) target.style.top = top + 'px';
      else target.style.top = imageDragBounds.top + 'px';
    } else {
      const isWithinBottomBound = Math.abs(topDist) < cropRef.current.crop.bottom;
      if (isWithinBottomBound) {
        target.style.top = top + 'px';
      } else {
        const bottomLimit = startPos.current.top - cropRef.current.crop.bottom;
        target.style.top = bottomLimit + 'px';
      }
    }

    if (isDragRight) {
      const isWithinLeftBound = left < imageDragBounds.left;
      if (isWithinLeftBound) target.style.left = left + 'px';
      else target.style.left = imageDragBounds.left + 'px';
    } else {
      const isWithinRightBound = Math.abs(widthDist) < cropRef.current.crop.right;
      if (isWithinRightBound) {
        target.style.left = left + 'px';
      } else {
        const rightLimit = startPos.current.left - cropRef.current.crop.right;
        target.style.left = rightLimit + 'px';
      }
    }
  };

  const onDragEnd = (e: OnDragEnd) => {
    setIsDragging(false);

    if (e.lastEvent) setTranslate(e.lastEvent.beforeTranslate);
    if (!cropImageRef.current) return;
    if (!cropRef.current) return;

    const targetEl = e.target as HTMLElement;
    const newCrop = getCrop(cropImageRef.current, targetEl, areaTranslate);
    const newPosition = getImageDistanceToCanvas(targetEl, newCrop.top, newCrop.left);

    cropRef.current.crop = newCrop;
    cropRef.current.position = newPosition;

    const bounds = getBounds(targetEl, widgetBaseRef);
    setCropAreaBounds(bounds as CropAreaBounds);
  };

  const dragTargetStyle = { top, right, bottom, left, position: 'absolute', zIndex: 1 } as React.CSSProperties;
  const moveableZoom = zoom < 1 ? zoom + 1 : 1;

  return (
    <>
      <Box ref={dragTargetRef} w={`${imageWidth}px`} h={`${imageHeight}px`} style={dragTargetStyle}>
        <Image w='100%' h='100%' userSelect='none' cursor='move' draggable={false} src={url} alt={altText} />
      </Box>
      <Moveable
        // see https://github.com/daybrush/moveable/tree/master/packages/react-moveable#react-18-concurrent-mode
        flushSync={flushSync}
        ref={imageMoveableRef}
        target={dragTargetRef.current}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        zoom={moveableZoom}
        origin={false}
        draggable={true}
      />
    </>
  );
};

/**
 * distance from the draggable image to the widget original position
 * Returns bounds { left, top, right, bottom } as px number for moveable
 */
const getBounds = (dragTargetEl: HTMLElement, widgetBaseEl: HTMLElement) => {
  const dragTargetElOffset = getOffset(dragTargetEl);
  const widgetBaseElOffset = getOffset(widgetBaseEl);

  const top = dragTargetElOffset.top - widgetBaseElOffset.top;
  const left = dragTargetElOffset.left - widgetBaseElOffset.left;
  const right = -(dragTargetElOffset.right - widgetBaseElOffset.right);
  const bottom = -(dragTargetElOffset.bottom - widgetBaseElOffset.bottom);

  return { left, top, right, bottom, position: 'css' };
};
