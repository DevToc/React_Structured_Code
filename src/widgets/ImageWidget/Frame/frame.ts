import { FrameShape } from './frame.types';
import { SQUARE_FRAME } from './frame.config';

const MASK = '_mask';

export const generateClipPathUrl = (id: string): string => `url(#${id}${MASK})`;

/**
 * Create svg shape for image frame clip path
 * @param {FrameShape}
 */
export const createSvgClipPathFrame = (type: FrameShape, id: string): SVGElement => {
  const ns = 'http://www.w3.org/2000/svg';

  // Uses clipPathUnits and objectBoundingBox to create a auto-scaling svg clip path
  // e.g. no need to re-create the svg each time the width / height changes
  // constraint: sizes must be a decimal between 1 and 0
  const size = 1;
  const height = 1;
  const width = 1;

  let shape;
  switch (type) {
    case FrameShape.Circle:
      shape = document.createElementNS(ns, 'circle');
      shape.setAttribute('cx', width / 2 + '');
      shape.setAttribute('cy', height / 2 + '');
      shape.setAttribute('r', size / 2 + '');
      break;
    case FrameShape.Ellipse:
      shape = document.createElementNS(ns, 'ellipse');
      shape.setAttribute('cx', width / 2 + '');
      shape.setAttribute('cy', height / 2 + '');
      shape.setAttribute('rx', width / 2 + '');
      shape.setAttribute('ry', height / 2 + '');
      break;
    case FrameShape.Square:
      shape = document.createElementNS(ns, 'rect');
      shape.setAttribute('x', (width - size) / 2 + '');
      shape.setAttribute('y', (height - size) / 2 + '');
      shape.setAttribute('width', size + '');
      shape.setAttribute('height', size + '');
      break;
    case FrameShape.Diamond:
      shape = document.createElementNS(ns, 'polygon');
      shape.setAttribute(
        'points',
        width / 2 + ' 0, ' + width + ' ' + height / 2 + ', ' + width / 2 + ' ' + height + ', 0 ' + height / 2,
      );
      break;
    case FrameShape.Triangle:
      shape = document.createElementNS(ns, 'polygon');
      shape.setAttribute('points', width / 2 + ' 0, 0 ' + height + ', ' + width + ' ' + height);
      break;
    case FrameShape.Star:
      shape = document.createElementNS(ns, 'polygon');
      shape.setAttribute(
        'points',
        width / 2 +
          ' 0, ' +
          width * 0.63 +
          ' ' +
          height * 0.38 +
          ', ' +
          width +
          ' ' +
          height * 0.38 +
          ', ' +
          width * 0.69 +
          ' ' +
          height * 0.59 +
          ', ' +
          width * 0.82 +
          ' ' +
          height +
          ', ' +
          width / 2 +
          ' ' +
          height * 0.75 +
          ', ' +
          width * 0.18 +
          ' ' +
          height +
          ', ' +
          width * 0.31 +
          ' ' +
          height * 0.59 +
          ', ' +
          0 +
          ' ' +
          height * 0.38 +
          ', ' +
          width * 0.37 +
          ' ' +
          height * 0.38,
      );
      break;
    case FrameShape.PointedCircle:
      shape = document.createElementNS(ns, 'polygon');
      shape.setAttribute(
        'points',
        width +
          ', ' +
          height * 0.51 +
          ', ' +
          width * 0.87 +
          ', ' +
          height * 0.57 +
          ', ' +
          width * 0.97 +
          ', ' +
          height * 0.68 +
          ', ' +
          width * 0.82 +
          ', ' +
          height * 0.7 +
          ', ' +
          width * 0.88 +
          ', ' +
          height * 0.83 +
          ', ' +
          width * 0.74 +
          ', ' +
          height * 0.8 +
          ', ' +
          width * 0.75 +
          ', ' +
          height * 0.95 +
          ', ' +
          width * 0.63 +
          ', ' +
          height * 0.86 +
          ', ' +
          width * 0.59 +
          ', ' +
          height +
          ', ' +
          width * 0.5 +
          ', ' +
          height * 0.89 +
          ', ' +
          width * 0.41 +
          ', ' +
          height +
          ', ' +
          width * 0.37 +
          ', ' +
          height * 0.86 +
          ', ' +
          width * 0.25 +
          ', ' +
          height * 0.95 +
          ', ' +
          width * 0.26 +
          ', ' +
          height * 0.8 +
          ', ' +
          width * 0.12 +
          ', ' +
          height * 0.83 +
          ', ' +
          width * 0.18 +
          ', ' +
          height * 0.7 +
          ', ' +
          width * 0.03 +
          ', ' +
          height * 0.68 +
          ', ' +
          width * 0.13 +
          ', ' +
          height * 0.57 +
          ', ' +
          0 +
          ', ' +
          height * 0.51 +
          ', ' +
          width * 0.13 +
          ', ' +
          height * 0.44 +
          ', ' +
          width * 0.03 +
          ', ' +
          height * 0.33 +
          ', ' +
          width * 0.18 +
          ', ' +
          height * 0.32 +
          ', ' +
          width * 0.12 +
          ', ' +
          height * 0.18 +
          ', ' +
          width * 0.26 +
          ', ' +
          height * 0.22 +
          ', ' +
          width * 0.25 +
          ', ' +
          height * 0.07 +
          ', ' +
          width * 0.37 +
          ', ' +
          height * 0.15 +
          ', ' +
          width * 0.41 +
          ', ' +
          height * 0.01 +
          ', ' +
          width * 0.5 +
          ', ' +
          height * 0.13 +
          ', ' +
          width * 0.59 +
          ', ' +
          height * 0.01 +
          ', ' +
          width * 0.63 +
          ', ' +
          height * 0.15 +
          ', ' +
          width * 0.75 +
          ', ' +
          height * 0.07 +
          ', ' +
          width * 0.74 +
          ', ' +
          height * 0.22 +
          ', ' +
          width * 0.88 +
          ', ' +
          height * 0.18 +
          ', ' +
          width * 0.82 +
          ', ' +
          height * 0.32 +
          ', ' +
          width * 0.97 +
          ', ' +
          height * 0.33 +
          ', ' +
          width * 0.87 +
          ', ' +
          height * 0.44,
      );
      break;
  }

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');

  const defs = document.createElementNS(ns, 'defs');

  const clipPath = document.createElementNS(ns, 'clipPath');
  clipPath.setAttribute('id', id + MASK);
  clipPath.setAttribute('clipPathUnits', 'objectBoundingBox');

  if (shape) clipPath.appendChild(shape);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  return svg;
};

export const isSquareFrame = (type: FrameShape): boolean => SQUARE_FRAME.hasOwnProperty(type);
