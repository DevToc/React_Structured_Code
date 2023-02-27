import React from 'react';
import { Widget, AccessibleElement } from 'types/widget.types';
import { WidgetId } from 'types/idTypes';
import { FrameShape } from './Frame/frame.types';

export interface Crop {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ImageRect {
  widthPx: number;
  heightPx: number;
}

export interface ImageWidgetData extends Widget, AccessibleElement {
  url: string;
  crop: Crop;
  imageRect: ImageRect;
  frame: FrameShape;
  // Opacity of the image widget, ranges between 0 - 1.
  opacity: number;
  // TODO: filters
  // TODO: link
}

export interface ImageLayoutProps {
  alt?: string;
  imageRectRef?: React.RefObject<HTMLDivElement>;
  imageRef?: React.RefObject<HTMLImageElement>;
}
