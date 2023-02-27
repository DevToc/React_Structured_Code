import { ReactElement } from 'react';
import { ShapeProps, ResizeShape } from './Shapes.types';
import {
  generateGradientId,
  generateLinearGradient,
  generateStrokeFromBorderStyle,
  normalizeDimension,
  generateSvgId,
  generateFillId,
  generateBorderId,
} from './Shapes.helpers';
import { BorderStyle } from '../BasicShapeWidget.types';

export const resizeRectangle = ({ widthPx, heightPx, borderWidth, widgetId }: ResizeShape) => {
  const svg = document.getElementById(generateSvgId(widgetId));
  const svgFill = document.getElementById(generateFillId(widgetId));
  const svgBorder = document.getElementById(generateBorderId(widgetId));

  if (svg && svgFill && svgBorder) {
    // set svg dimensions
    svg.setAttribute('width', `${widthPx}px`);
    svg.setAttribute('height', `${heightPx}px`);

    // set fill dimensions
    svgFill.setAttribute('width', generateFillWidth({ widthPx, borderWidth }));
    svgFill.setAttribute('height', generateFillHeight({ heightPx, borderWidth }));

    // set border dimensions
    svgBorder.setAttribute('width', generateBorderWidth({ widthPx, borderWidth }));
    svgBorder.setAttribute('height', generateBorderHeight({ heightPx, borderWidth }));
  }
};

const generateFillWidth = ({ widthPx, borderWidth }: { widthPx: number; borderWidth: number }) => {
  return `${normalizeDimension(widthPx - 2 * borderWidth)}px`;
};

const generateFillHeight = ({ heightPx, borderWidth }: { heightPx: number; borderWidth: number }) => {
  return `${normalizeDimension(heightPx - 2 * borderWidth)}px`;
};

const generateBorderWidth = ({ widthPx, borderWidth }: { widthPx: number; borderWidth: number }) => {
  return `${normalizeDimension(widthPx - borderWidth)}px`;
};

const generateBorderHeight = ({ heightPx, borderWidth }: { heightPx: number; borderWidth: number }) => {
  return `${normalizeDimension(heightPx - borderWidth)}px`;
};

const Rectangle = ({
  widthPx,
  heightPx,
  border,
  widgetId,
  fillColor,
  fillPercent,
  cornerRadius,
  ...other
}: ShapeProps): ReactElement => {
  const { width: borderWidth, style: borderStyle, color: borderColor } = border;

  const borderStyleAttributes = generateStrokeFromBorderStyle(borderStyle, borderWidth);

  const hasSecondaryColorFill =
    Array.isArray(fillColor) && fillColor[1] && fillPercent && fillPercent >= 0 && fillPercent <= 100;
  const gradientId = generateGradientId(widgetId);

  const rx = cornerRadius ? Math.min(cornerRadius || 0, Math.min(widthPx, heightPx) / 2) : 0;

  return (
    <svg
      id={generateSvgId(widgetId)}
      xmlns='http://www.w3.org/2000/svg'
      width={`${widthPx}px`}
      height={`${heightPx}px`}
      {...other}
    >
      {hasSecondaryColorFill && <defs>{generateLinearGradient(fillColor, fillPercent, widgetId)}</defs>}

      {/* Fill Container */}
      <rect
        id={generateFillId(widgetId)}
        fill={hasSecondaryColorFill ? `url('#${gradientId}')` : fillColor[0]}
        width={generateFillWidth({ widthPx, borderWidth })}
        height={generateFillHeight({ heightPx, borderWidth })}
        x={borderWidth}
        y={borderWidth}
        rx={`${rx > borderWidth ? rx - borderWidth : 0}px`}
      />

      {/* Border */}
      <rect
        id={generateBorderId(widgetId)}
        width={generateBorderWidth({ widthPx, borderWidth })}
        height={generateBorderHeight({ heightPx, borderWidth })}
        stroke={borderColor}
        strokeWidth={`${borderWidth}px`}
        fill={
          borderStyle === BorderStyle.Solid && rx > 0
            ? hasSecondaryColorFill
              ? `url('#linearGradient-${widgetId}')`
              : fillColor[0]
            : 'none'
        }
        x={borderWidth / 2}
        y={borderWidth / 2}
        rx={`${rx}px`}
        {...borderStyleAttributes}
      />
    </svg>
  );
};

export default Rectangle;
