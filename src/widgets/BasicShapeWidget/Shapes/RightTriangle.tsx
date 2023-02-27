import { ReactElement } from 'react';
import { ShapeProps, ResizeShape } from './Shapes.types';
import {
  generateStrokeFromBorderStyle,
  generateLinearGradient,
  generateGradientId,
  generateSvgId,
  generateFillId,
  generateBorderId,
} from './Shapes.helpers';

export const resizeRightTriangle = ({ widthPx, heightPx, borderWidth, widgetId }: ResizeShape) => {
  const svg = document.getElementById(generateSvgId(widgetId));
  const svgFill = document.getElementById(generateFillId(widgetId));
  const svgBorder = document.getElementById(generateBorderId(widgetId));

  if (svg && svgFill && svgBorder) {
    // set svg dimensions
    svg.setAttribute('width', `${widthPx}px`);
    svg.setAttribute('height', `${heightPx}px`);

    // set fill dimensions
    svgFill.setAttribute('d', generateRightTriangleFillPath({ widthPx, heightPx, borderWidth }));
    // set border dimensions
    svgBorder.setAttribute('d', generateRightTriangleBorderPath({ widthPx, heightPx, borderWidth }));
  }
};

interface ShapeDimensions {
  widthPx: number;
  heightPx: number;
  borderWidth: number;
}

const generateRightTriangleFillPath = ({ widthPx, heightPx, borderWidth }: ShapeDimensions) => {
  return `
    M ${borderWidth}, ${heightPx - borderWidth}
    L ${borderWidth}, ${borderWidth / Math.tan(Math.atan(widthPx / heightPx) / 2)}
    L ${widthPx - borderWidth / Math.tan(Math.atan(heightPx / widthPx) / 2)}, ${heightPx - borderWidth}
    Z
  `;
};

const generateRightTriangleBorderPath = ({ widthPx, heightPx, borderWidth }: ShapeDimensions) => {
  return `
    M ${borderWidth / 2}, ${heightPx - borderWidth / 2}
    L ${borderWidth / 2}, ${borderWidth / 2 / Math.tan(Math.atan(widthPx / heightPx) / 2)}
    L ${widthPx - borderWidth / 2 / Math.tan(Math.atan(heightPx / widthPx) / 2)}, ${heightPx - borderWidth / 2}
    Z
  `;
};

const RightTriangle = ({
  widthPx,
  heightPx,
  border,
  widgetId,
  fillColor,
  fillPercent,
  ...other
}: ShapeProps): ReactElement => {
  const { width: borderWidth, style: borderStyle, color: borderColor } = border;

  const borderStyleAttributes = generateStrokeFromBorderStyle(borderStyle, borderWidth);
  const hasSecondaryColorFill =
    Array.isArray(fillColor) && fillColor[1] && fillPercent && fillPercent >= 0 && fillPercent <= 100;
  const gradientId = generateGradientId(widgetId);

  return (
    <svg
      id={generateSvgId(widgetId)}
      xmlns='http://www.w3.org/2000/svg'
      width={`${widthPx}px`}
      height={`${heightPx}px`}
      strokeMiterlimit={10}
      {...other}
    >
      {hasSecondaryColorFill && <defs>{generateLinearGradient(fillColor, fillPercent, widgetId)}</defs>}

      {/* Fill Container */}
      <path
        id={generateFillId(widgetId)}
        fill={hasSecondaryColorFill ? `url('#${gradientId}')` : fillColor[0]}
        d={generateRightTriangleFillPath({ widthPx, heightPx, borderWidth })}
      />

      {/* Border */}
      <path
        id={generateBorderId(widgetId)}
        d={generateRightTriangleBorderPath({ widthPx, heightPx, borderWidth })}
        stroke={borderColor}
        strokeWidth={`${borderWidth}px`}
        fill={'none'}
        {...borderStyleAttributes}
      />
    </svg>
  );
};

export default RightTriangle;
