import { useEffect, useState } from 'react';
import { WidgetType } from 'types/widget.types';
import { calculateAspectRatioFit } from 'utils/calculateAspectRatioFit';
import { Crop } from './ImageWidget.types';
import { FrameShape } from './Frame/frame.types';
import { VERSION } from './ImageWidget.upgrade';
import { parseStrictNumber } from 'utils/number';

interface ImageLoader {
  isLoading: boolean;
}

/**
 * A Simple hook for getting the loading state of an image url
 * e.g. const { isLoading } = useImageLoader('cat.png')
 *
 * @param url
 * @returns {ImageLoader}
 */

const loadedUrls: { [url: string]: boolean } = {};

export const useImageLoader = (url: string): ImageLoader => {
  const [isLoading, setIsLoading] = useState(!loadedUrls[url]);

  useEffect(() => {
    if (loadedUrls[url]) return;
    if (!url) setIsLoading(false);

    const img = document.createElement('img');
    img.src = url;
    img.onload = () => {
      setIsLoading(false);
      loadedUrls[url] = true;
    };

    return () => {
      if (img) img.onload = () => {};
    };
  }, [url]);

  return { isLoading };
};

interface Dimension {
  width: number;
  height: number;
}

export const generateDefaultData = (
  url: string,
  imageSize: Dimension,
  infographSize: Dimension,
  topPxOverride?: number,
  leftPxOverride?: number,
) => {
  const { width: widthPx, height: heightPx } = calculateAspectRatioFit(
    imageSize.width,
    imageSize.height,
    // The new image widget is limited to max half the size of the page
    infographSize.width / 2,
    infographSize.height / 2,
  );

  const imageWidget = {
    widgetType: WidgetType.Image,
    widgetData: {
      version: VERSION,
      topPx: topPxOverride || 0,
      leftPx: leftPxOverride || 0,
      rotateDeg: 0,
      widthPx,
      heightPx,
      url: url,
      altText: '',
      isDecorative: false,
      crop: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      imageRect: {
        widthPx: widthPx,
        heightPx: heightPx,
      },
      frame: FrameShape.None,
      opacity: 1,
    },
  };

  return imageWidget;
};

/**
 * Get the absolute positioning style of an element
 */
export const parseElementAbsPosition = (el: HTMLElement): [number, number, number, number] => {
  const top = Math.abs(parseStrictNumber(el.style.top));
  const right = Math.abs(parseStrictNumber(el.style.right));
  const bottom = Math.abs(parseStrictNumber(el.style.bottom));
  const left = Math.abs(parseStrictNumber(el.style.left));

  return [top, right, bottom, left];
};

/**
 * Get the absolute position of the crop area
 */
export const cropToAbsolutePosition = (crop: Crop): [number, number, number, number] => {
  const top = -crop.top;
  const right = crop.right;
  const bottom = crop.bottom;
  const left = -crop.left;

  return [top, right, bottom, left];
};

/**
 * Get the transform translateX, translateY from an element
 */
export const getTranslateXY = (element: HTMLElement) => {
  const style = (window as any).getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);

  return {
    translateX: matrix.m41,
    translateY: matrix.m42,
  };
};
