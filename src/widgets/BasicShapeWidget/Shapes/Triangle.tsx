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

interface TrianglePath {
  widthPx: number;
  heightPx: number;
  borderWidth: number;
  theta: number;
}

const generateTriangleBorderPath = ({ widthPx, heightPx, borderWidth, theta }: TrianglePath) => {
  return `
 M ${widthPx / 2}, ${borderWidth / 2 / Math.sin(Math.PI / 2 - theta)}
 L ${borderWidth / 2 / Math.tan(theta / 2)}, ${heightPx - borderWidth / 2}
 L ${widthPx - borderWidth / 2 / Math.tan(theta / 2)}, ${heightPx - borderWidth / 2}
 Z
`;
};

const generateTriangleFillPath = ({ widthPx, heightPx, borderWidth, theta }: TrianglePath) => {
  return `
        M ${widthPx / 2}, ${borderWidth / Math.sin(Math.PI / 2 - theta)}
        L ${borderWidth / Math.tan(theta / 2)}, ${heightPx - borderWidth}
        L ${widthPx - borderWidth / Math.tan(theta / 2)}, ${heightPx - borderWidth}
        Z
      `;
};

export const resizeTriangle = ({ widthPx, heightPx, borderWidth, widgetId }: ResizeShape) => {
  const svg = document.getElementById(generateSvgId(widgetId));
  const svgFill = document.getElementById(generateFillId(widgetId));
  const svgBorder = document.getElementById(generateBorderId(widgetId));

  if (svg && svgFill && svgBorder) {
    // heightPx & widthPx cannot be less than 0
    const theta = Math.atan((2 * Math.max(heightPx, 1)) / Math.max(widthPx, 1));

    // set svg dimensions
    svg.setAttribute('width', `${widthPx}px`);
    svg.setAttribute('height', `${heightPx}px`);

    // set fill dimensions
    svgFill.setAttribute('d', generateTriangleFillPath({ widthPx, heightPx, borderWidth, theta }));
    // set border dimensions
    svgBorder.setAttribute('d', generateTriangleBorderPath({ widthPx, heightPx, borderWidth, theta }));
  }
};

const Triangle = ({
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
  const theta = Math.atan((2 * heightPx) / widthPx);

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
      <path
        id={generateFillId(widgetId)}
        fill={hasSecondaryColorFill ? `url('#${gradientId}')` : fillColor[0]}
        d={generateTriangleFillPath({ widthPx, heightPx, borderWidth, theta })}
      />

      {/* Border */}
      <path
        id={generateBorderId(widgetId)}
        d={generateTriangleBorderPath({ widthPx, heightPx, borderWidth, theta })}
        stroke={borderColor}
        strokeWidth={`${borderWidth}px`}
        fill={'none'}
        {...borderStyleAttributes}
      />
    </svg>
  );
};

export default Triangle;
