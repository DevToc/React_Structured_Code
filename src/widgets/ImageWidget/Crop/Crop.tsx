import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { flushSync } from 'react-dom';
import { Box, useOutsideClick } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Moveable, { OnResize, OnResizeEnd, OnResizeStart } from 'react-moveable';

import { useEventListener } from '../../../hooks/useEventListener';
import { cropToAbsolutePosition } from '../ImageWidget.helpers';
import { CropData, CropHandlerProps, CropAreaBounds, ImageDragBounds } from './Crop.types';
import { HANDLE } from '../../../constants/bounding-box';
import { DraggableImage } from './DraggableImage';
import { getCrop, getImageDistanceToCanvas, getImageDragBounds, isCornerHandle } from './Crop.helpers';
import { useCropKeyboardShortcuts } from './useCropKeyboardShortcuts';

export const CropHandler = ({
  zoom,
  url,
  altText,
  crop,
  imageWidth,
  imageHeight,
  onCropOpen,
  onCropClose,
  closeCrop,
  isCropAspectRatioLocked,
  widgetBaseRef,
}: CropHandlerProps) => {
  const [isCropping, setIsCropping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);
  const [target, setTarget] = useState<HTMLImageElement>();
  const [translate, setTranslate] = useState([crop.left, crop.top]);
  const [imageDragBounds, setImageDragBounds] = useState<ImageDragBounds>();
  const [cropAreaBounds, setCropAreaBounds] = useState<CropAreaBounds>({
    left: -crop.left,
    top: -crop.top,
    right: -crop.right,
    bottom: -crop.bottom,
    position: 'css',
  });

  const cropRef = useRef<CropData>({ crop, position: null });
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropWrapperRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);

  const isMouseDownRef = useRef<boolean>(false);
  const imageMoveableRef = useRef<any>(null);
  const cropAreaMoveableRef = useRef<any>(null);

  useEffect(() => {
    if (cropImageRef.current) setTarget(cropImageRef.current);
    onCropOpen();

    const newValues = cropRef.current;
    return () => {
      const { crop, position } = newValues;
      onCropClose({ crop, position });
    };
    // Only when the entire component is mounted / unmounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!cropImageRef.current) return;
    if (!widgetBaseRef) return;

    const imageBounds = getImageDragBounds(cropImageRef.current, widgetBaseRef);
    setImageDragBounds(imageBounds);
  }, [widgetBaseRef]);

  const onResizeStart = (e: OnResizeStart) => {
    setIsCropping(true);
    if (isCornerHandle(e.direction)) setIsAspectRatioLocked(true);
    e.dragStart && e.dragStart.set(translate);
  };

  const onResize = (e: OnResize) => {
    const beforeTranslate = e.drag.beforeTranslate;
    if (!cropRef.current.crop) return;

    e.target.style.height = `${e.height}px`;
    e.target.style.width = `${e.width}px`;
    e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
  };

  const onResizeEnd = (e: OnResizeEnd) => {
    setIsCropping(false);
    setIsAspectRatioLocked(false);

    const lastEvent = e.lastEvent;
    if (!lastEvent) return;
    if (!dragTargetRef.current) return;
    if (!target) return;
    if (!widgetBaseRef) return;

    const { beforeTranslate } = lastEvent.drag;
    setTranslate(beforeTranslate);

    const newCrop = getCrop(target, dragTargetRef.current, beforeTranslate);
    const newPosition = getImageDistanceToCanvas(dragTargetRef.current, newCrop.top, newCrop.left);

    cropRef.current.crop = newCrop;
    cropRef.current.position = newPosition;

    const imageBounds = getImageDragBounds(target, widgetBaseRef);
    setImageDragBounds(imageBounds);
  };

  // Manually trigger image drag when crop area is pressed and dragged
  const startDragForImage = (e: React.MouseEvent) => {
    if (!imageMoveableRef.current) return;
    if (!isMouseDownRef.current) return;

    imageMoveableRef.current.dragStart(e.nativeEvent);
  };

  const onMouseDown = () => {
    isMouseDownRef.current = true;
  };

  const onMouseUp = () => {
    isMouseDownRef.current = false;
  };

  useCropKeyboardShortcuts({ imageMoveableRef, cropAreaMoveableRef, closeCrop, keepRatio: isCropAspectRatioLocked });
  useEventListener('mouseup', onMouseUp);
  useOutsideClick({ ref: cropWrapperRef, handler: closeCrop });

  const [top, right, bottom, left] = cropToAbsolutePosition(crop);
  const cropAreaPosition = { top, right, bottom, left, zIndex: 2, position: 'absolute' } as React.CSSProperties;
  const cropAreaWidth = `${imageWidth - crop.left - crop.right}px`;
  const cropAreaHeight = `${imageHeight - crop.top - crop.bottom}px`;
  const cropAreaTransform = `translate(${crop.left}px, ${crop.top}px)`;

  const moveableZoom = zoom < 1 ? zoom + 1 : 1;
  const moveableHandles = isCropAspectRatioLocked ? HANDLE.CORNERS : HANDLE.ALL;

  return (
    <Box ref={cropWrapperRef}>
      <CropArea
        w={cropAreaWidth}
        h={cropAreaHeight}
        style={cropAreaPosition}
        transform={cropAreaTransform}
        ref={cropImageRef}
        onMouseDown={onMouseDown}
        onMouseMove={startDragForImage}
        cursor='move'
      >
        {(isCropping || isDragging) && <CropAlignmentGrid />}
      </CropArea>
      <DraggableImage
        imageData={{ imageWidth, imageHeight, crop, url, altText }}
        areaTranslate={translate}
        setCropAreaBounds={setCropAreaBounds}
        imageDragBounds={imageDragBounds}
        zoom={zoom}
        cropRef={cropRef}
        imageMoveableRef={imageMoveableRef}
        dragTargetRef={dragTargetRef}
        cropImageRef={cropImageRef}
        widgetBaseRef={widgetBaseRef}
        setIsDragging={setIsDragging}
      />
      <Moveable
        // see https://github.com/daybrush/moveable/tree/master/packages/react-moveable#react-18-concurrent-mode
        flushSync={flushSync}
        ref={cropAreaMoveableRef}
        target={target}
        zoom={moveableZoom}
        renderDirections={isDragging ? [] : moveableHandles}
        keepRatio={isCropAspectRatioLocked || isAspectRatioLocked}
        resizable={true}
        snappable={true}
        draggable={true}
        origin={false}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        bounds={isCropping ? cropAreaBounds : {}}
      />
    </Box>
  );
};

const CropArea = styled(Box)`
  &::after {
    position: absolute;
    content: '';
    left: 0;
    box-shadow: 0 0 0 100000px rgb(0 0 0 / 70%);
    pointer-events: none;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }
`;

const CropAlignmentGrid = () => (
  <Box w='100%' h='100%' position='relative'>
    <CropGridLine w='100%' h='1px' top='33%' />
    <CropGridLine w='100%' h='1px' top='66%' />
    <CropGridLine w='1px' h='100%' left='33%' />
    <CropGridLine w='1px' h='100%' left='66%' />
  </Box>
);

const CropGridLine = styled(Box)`
  background-color: var(--vg-colors-brand-100);
  position: absolute;
`;
