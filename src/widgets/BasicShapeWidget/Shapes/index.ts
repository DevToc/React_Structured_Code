import Rectangle, { resizeRectangle } from './Rectangle';
import Ellipse, { resizeEllipse } from './Ellipse';
import SemiCircle, { resizeSemiCircle } from './SemiCircle';
import Triangle, { resizeTriangle } from './Triangle';
import RightTriangle, { resizeRightTriangle } from './RightTriangle';

import { BasicShapeType } from '../BasicShapeWidget.types';

export const SHAPE_TYPE_MAP = {
  [BasicShapeType.Rectangle]: Rectangle,
  [BasicShapeType.Ellipse]: Ellipse,
  [BasicShapeType.SemiCircle]: SemiCircle,
  [BasicShapeType.Triangle]: Triangle,
  [BasicShapeType.RightTriangle]: RightTriangle,
};

export const SHAPE_RESIZE_MAP = {
  [BasicShapeType.Rectangle]: resizeRectangle,
  [BasicShapeType.Ellipse]: resizeEllipse,
  [BasicShapeType.SemiCircle]: resizeSemiCircle,
  [BasicShapeType.Triangle]: resizeTriangle,
  [BasicShapeType.RightTriangle]: resizeRightTriangle,
};
