import { Widget, AccessibleElement } from 'types/widget.types';

enum IconWidgetType {
  Grid = 'Grid',
  Single = 'Single',
}

enum FillDirection {
  TopDown = 'TopDown',
  LeftRight = 'LeftRight',
}

interface IconWidgetData extends Widget, AccessibleElement {
  iconId: string;
  shapeColorOne: string;
  isMirrored: boolean;
  shapeColorTwo: string;
  shapeFill: number;
  fillDirection?: FillDirection;

  // The icon widget can be a grid (same icon repeated) or a single icon
  type?: IconWidgetType;

  // grid properties
  numberOfIcons?: number;
  gridGapPx?: number;
  gridItemWidthPx?: number;
  gridItemHeightPx?: number;
}

interface IconStyle {
  height: string;
  width: string;
  transform?: string;
  transformOrigin?: string;
}

interface AdjustSvgViewBox {
  viewBox?: string;
  maxSize: number;
}

interface Dimensions {
  width: number;
  height: number;
}

export type { IconWidgetData, IconStyle, AdjustSvgViewBox, Dimensions };
export { IconWidgetType, FillDirection };
