import { ReactElement } from 'react';
import { ShapeProps, ResizeShape } from './Shapes.types';
import {
  generateStrokeFromBorderStyle,
  normalizeDimension,
  generateLinearGradient,
  generateGradientId,
  generateSvgId,
  generateFillId,
  generateBorderId,
} from './Shapes.helpers';

export const resizeEllipse = ({ widthPx, heightPx, borderWidth, widgetId }: ResizeShape) => {
  const svg = document.getElementById(generateSvgId(widgetId));
  const svgFill = document.getElementById(generateFillId(widgetId));
  const svgBorder = document.getElementById(generateBorderId(widgetId));

  if (svg && svgFill && svgBorder) {
    const centerX = widthPx / 2;
    const centerY = heightPx / 2;

    // set svg dimensions
    svg.setAttribute('width', `${widthPx}px`);
    svg.setAttribute('height', `${heightPx}px`);

    // set fill dimensions
    svgFill.setAttribute('rx', generateFillRx({ widthPx, borderWidth }));
    svgFill.setAttribute('ry', generateFillRy({ heightPx, borderWidth }));
    svgFill.setAttribute('cx', `${centerX}`);
    svgFill.setAttribute('cy', `${centerY}`);

    // set border dimensions
    svgBorder.setAttribute('rx', generateBorderRx({ widthPx, borderWidth }));
    svgBorder.setAttribute('ry', generateBorderRy({ heightPx, borderWidth }));
    svgBorder.setAttribute('cx', `${centerX}`);
    svgBorder.setAttribute('cy', `${centerY}`);
  }
};

const generateFillRx = ({ widthPx, borderWidth }: { widthPx: number; borderWidth: number }) => {
  return `${normalizeDimension((widthPx - 2 * borderWidth) / 2)}px`;
};

const generateFillRy = ({ heightPx, borderWidth }: { heightPx: number; borderWidth: number }) => {
  return `${normalizeDimension((heightPx - 2 * borderWidth) / 2)}px`;
};

const generateBorderRx = ({ widthPx, borderWidth }: { widthPx: number; borderWidth: number }) => {
  return `${normalizeDimension((widthPx - borderWidth) / 2)}px`;
};

const generateBorderRy = ({ heightPx, borderWidth }: { heightPx: number; borderWidth: number }) => {
  return `${normalizeDimension((heightPx - borderWidth) / 2)}px`;
};

const Ellipse = ({
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

  const centerX = widthPx / 2;
  const centerY = heightPx / 2;

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
      <ellipse
        id={generateFillId(widgetId)}
        rx={generateFillRx({ widthPx, borderWidth })}
        ry={generateFillRy({ heightPx, borderWidth })}
        cx={centerX}
        cy={centerY}
        fill={hasSecondaryColorFill ? `url('#${gradientId}')` : fillColor[0]}
      />

      {/* Border */}
      <ellipse
        id={generateBorderId(widgetId)}
        rx={generateBorderRx({ widthPx, borderWidth })}
        ry={generateBorderRy({ heightPx, borderWidth })}
        stroke={borderColor}
        strokeWidth={`${borderWidth}px`}
        fill={'none'}
        cx={centerX}
        cy={centerY}
        {...borderStyleAttributes}
      />
    </svg>
  );
};

export default Ellipse;
