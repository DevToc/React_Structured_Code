import { ReactElement, useRef, useCallback, Suspense } from 'react';
import { Image, Skeleton, Box, Spinner } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox';
import { useWidget, WidgetToolbar, WidgetBase, ReadOnlyWidgetBase, useEditor } from 'widgets/sdk';
import { CropHandler, CropData } from './Crop';
import { ImageWidgetData, ImageLayoutProps } from './ImageWidget.types';
import { useImageLoader, cropToAbsolutePosition } from './ImageWidget.helpers';
import { useImageResize } from './useImageResize';
import { CROP_BUTTON_ID } from './ImageWidget.config';
import { generateClipPathUrl, isSquareFrame } from './Frame/frame';
import { FrameShape } from './Frame/frame.types';
import { ClipPathFrameSvg } from './Frame/ClipPathFrameSvg';
import { useDynamicImport } from 'hooks/useDynamicImport';
import { WidgetComponentsMap } from 'widgets/components.lazy';

const ImageWidgetToolbarMenu = () => {
  const Component = useDynamicImport('imageWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};

export const ImageWidget = (): ReactElement => {
  const { url, frame, rotateDeg, widgetId } = useWidget<ImageWidgetData>();
  const { isCropView, boundingBox } = useEditor();

  const { isLoading } = useImageLoader(url);
  const imageRectRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { onImageResize, onImageResizeEnd } = useImageResize({
    rotateDeg,
    widgetId,
    imageRectRef,
    imageRef,
    frame,
    boundingBox,
  });

  return (
    <WidgetBase onResize={onImageResize} onResizeEnd={onImageResizeEnd}>
      <WidgetToolbar>
        <ImageWidgetToolbarMenu />
      </WidgetToolbar>
      {isLoading ? (
        <Skeleton w='100%' h='100%' />
      ) : (
        <>{isCropView ? <CropContainer /> : <ImageLayout imageRectRef={imageRectRef} imageRef={imageRef} />}</>
      )}
    </WidgetBase>
  );
};

const CropContainer = () => {
  const { url, crop, frame, imageRect, widgetId, updateWidget, altText } = useWidget<ImageWidgetData>();
  const { widthPx: imageWidthPx, heightPx: imageHeightPx } = imageRect;

  const { zoom, disableEditorKeyboardShortcuts, enableEditorKeyboardShortcuts, disableCropView } = useEditor();
  const { widgetRefs, boundingBox } = useBoundingBox();
  const widgetBaseRef: HTMLElement = widgetRefs[widgetId]?.element;

  const onCropClose = useCallback(
    ({ crop, position }: CropData) => {
      enableEditorKeyboardShortcuts();

      if (!crop || !position) return;
      const widthPx = imageWidthPx - crop.left - crop.right;
      const heightPx = imageHeightPx - crop.top - crop.bottom;

      const { leftPx, topPx } = position;
      const widget = { widthPx, heightPx, leftPx, topPx, crop };

      updateWidget(widget);

      // Prevent widget bounding box to get out of sync when cropping with keyboard
      setTimeout(() => boundingBox.updateRect(), 0);
    },
    [updateWidget, enableEditorKeyboardShortcuts, imageHeightPx, imageWidthPx, boundingBox],
  );

  const closeCrop = useCallback(
    (e?: Event) => {
      if (e && e.target && (e.target as HTMLElement).id === CROP_BUTTON_ID) return;
      disableCropView();
    },
    [disableCropView],
  );

  return (
    <CropHandler
      isCropAspectRatioLocked={isSquareFrame(frame)}
      closeCrop={closeCrop}
      onCropOpen={disableEditorKeyboardShortcuts}
      onCropClose={onCropClose}
      imageWidth={imageWidthPx}
      imageHeight={imageHeightPx}
      altText={altText}
      url={url}
      crop={crop}
      zoom={zoom}
      widgetBaseRef={widgetBaseRef}
    />
  );
};

export const ReadOnlyImageWidget = (): ReactElement => {
  const { url } = useWidget<ImageWidgetData>();
  const { isLoading } = useImageLoader(url);

  return <ReadOnlyWidgetBase>{isLoading ? <Skeleton w='100%' h='100%' /> : <ImageLayout />}</ReadOnlyWidgetBase>;
};

const ImageLayout = ({ imageRectRef, imageRef }: ImageLayoutProps) => {
  const { url, crop, frame, imageRect, widgetId, opacity, altText, isDecorative } = useWidget<ImageWidgetData>();
  const { widthPx: w, heightPx: h } = imageRect;

  // Only apply alt text if specified or marked as decorative
  const altAttributes: { alt?: string } = {};
  if (altText || isDecorative) altAttributes['alt'] = isDecorative ? '' : altText;

  const [top, right, bottom, left] = cropToAbsolutePosition(crop);
  const hasClipPathFrame = !!FrameShape[frame] && frame !== FrameShape.None;
  const clipPathUrl = hasClipPathFrame ? generateClipPathUrl(widgetId) : '';

  return (
    <Box position='absolute' clipPath={clipPathUrl} overflow='hidden' w='100%' height='100%'>
      {hasClipPathFrame && <ClipPathFrameSvg frame={frame} id={widgetId} />}
      <div
        data-testid='image-rect'
        ref={imageRectRef}
        style={{ top, left, right, bottom, position: 'absolute', width: w, height: h, opacity }}
      >
        <ImageElement draggable='false' ref={imageRef} src={url} alt={altAttributes.alt} />
      </div>
    </Box>
  );
};

const ImageElement = styled(Image)`
  transform: translateZ(0px);
  backface-visibility: hidden;
  position: absolute;
  userselect: none;
  height: 100%;
  width: 100%;
  object-fit: fill;
`;
