import { RefObject } from 'react';

export const getCanvasScale = (screenRef: RefObject<HTMLDivElement>) => {
  if (!screenRef.current) return 1;
  const PADDING_OFFSET = 48; // offset value for pageAreaContainer padding: 24px 24px
  const { offsetWidth, offsetHeight } = screenRef.current;
  const { availWidth, availHeight } = window.screen;

  // get values for editor's pageArea width and height and available screen width and height
  const transformedAreaWidth = offsetWidth - PADDING_OFFSET;
  const transformedAreaHeight = offsetHeight - PADDING_OFFSET;
  const screenAreaWidth = availWidth - PADDING_OFFSET;
  const screenAreaHeight = availHeight - PADDING_OFFSET;

  // get scale value for zoom factor
  const widthScale = Math.floor((screenAreaWidth / transformedAreaWidth) * 100) / 100;
  const heightScale = Math.floor((screenAreaHeight / transformedAreaHeight) * 100) / 100;

  // return the lower scale value of the two
  return Math.min(widthScale, heightScale);
};
