import { nanoid } from 'nanoid';
import { WidgetId } from '../../../types/idTypes';
import { BorderStyle } from '../BasicShapeWidget.types';

interface SVGStrokeDashStyle {
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeDasharray?: string;
}

/**
 * Generates object with SVG stroke attributes given a border style
 * to mimic CSS 'dotted', 'dashed', 'solid', etc. border styling.
 *
 * @param borderStyle {BorderStyle} style of the border
 * @param borderWidth {number} width of border in px
 * @returns {SVGStrokeDashStyle}
 */
export const generateStrokeFromBorderStyle = (borderStyle: BorderStyle, borderWidth: number): SVGStrokeDashStyle => {
  const strokeDashStyle: SVGStrokeDashStyle = {};
  switch (borderStyle) {
    case BorderStyle.Dotted:
      strokeDashStyle.strokeLinecap = 'round';
      strokeDashStyle.strokeDasharray = `0, ${2 * borderWidth}`;
      break;
    case BorderStyle.Dashed:
      strokeDashStyle.strokeDasharray = `${3 * borderWidth}, ${2 * borderWidth}`;
      break;
    case BorderStyle.Solid:
    default:
      break;
  }

  return strokeDashStyle;
};

/**
 * Clips {dimension} to 0 if negative
 *
 * @param dimension dimension to normalize
 * @returns
 */
export const normalizeDimension = (dimension: number): number => {
  return Math.max(0, dimension);
};

export const generateGradientId = (widgetId?: WidgetId) => {
  return `linearGradient-${widgetId || nanoid()}`;
};

export const generateLinearGradient = (fillColor: string | string[], fillPercent: number, widgetId?: WidgetId) => {
  if (fillPercent == null || !fillColor[1]) {
    return null;
  }

  const gradientId = generateGradientId(widgetId);
  return (
    <linearGradient id={gradientId} x1={'50%'} y1={'100%'} x2={'50%'} y2={'0%'}>
      <stop offset={`${100 - fillPercent}%`} stopColor={fillColor[0]} />
      <stop offset={`${100 - fillPercent}%`} stopColor={fillColor[1]} />
    </linearGradient>
  );
};

export const generateSvgId = (widgetId: WidgetId) => `triangle-svg-${widgetId}`;
export const generateFillId = (widgetId: WidgetId) => `triangle-fill-${widgetId}`;
export const generateBorderId = (widgetId: WidgetId) => `triangle-border-${widgetId}`;
