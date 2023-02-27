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

export const resizeSemiCircle = ({ widthPx, heightPx, borderWidth, widgetId }: ResizeShape) => {
  const svg = document.getElementById(generateSvgId(widgetId));
  const svgFill = document.getElementById(generateFillId(widgetId));
  const svgBorder = document.getElementById(generateBorderId(widgetId));

  if (svg && svgFill && svgBorder) {
    // set svg dimensions
    svg.setAttribute('width', `${widthPx}px`);
    svg.setAttribute('height', `${heightPx}px`);

    // set fill dimensions
    svgFill.setAttribute('d', generateSemiCircleFillPath({ widthPx, heightPx, borderWidth }));
    // set border dimensions
    svgBorder.setAttribute('d', generateSemiCircleBorderPath({ widthPx, heightPx, borderWidth }));
  }
};

interface SemiCirclePath {
  widthPx: number;
  heightPx: number;
  borderWidth: number;
}

const generateSemiCircleFillPath = ({ widthPx, heightPx, borderWidth }: SemiCirclePath) => {
  return `
    M ${borderWidth}, ${heightPx - borderWidth}
    A ${(widthPx - 2 * borderWidth) / 2} ${heightPx - 2 * borderWidth} 0 0 1 ${widthPx - borderWidth}, ${
    heightPx - borderWidth
  }
    Z
    `;
};

const generateSemiCircleBorderPath = ({ widthPx, heightPx, borderWidth }: SemiCirclePath) => {
  return `
    M ${borderWidth / 2}, ${heightPx - borderWidth / 2}
    A ${(widthPx - borderWidth) / 2} ${heightPx - borderWidth} 0 0 1 ${widthPx - borderWidth / 2}, ${
    heightPx - borderWidth / 2
  }
    Z
    `;
};

const SemiCircle = ({
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
      {...other}
    >
      {hasSecondaryColorFill && <defs>{generateLinearGradient(fillColor, fillPercent, widgetId)}</defs>}

      {/* Fill Container */}
      <path
        id={generateFillId(widgetId)}
        fill={hasSecondaryColorFill ? `url('#${gradientId}')` : fillColor[0]}
        d={generateSemiCircleFillPath({ widthPx, heightPx, borderWidth })}
      />

      {/* Border */}
      <path
        id={generateBorderId(widgetId)}
        d={generateSemiCircleBorderPath({ widthPx, heightPx, borderWidth })}
        stroke={borderColor}
        strokeWidth={`${borderWidth}px`}
        fill={'none'}
        {...borderStyleAttributes}
      />
    </svg>
  );
};

export default SemiCircle;
