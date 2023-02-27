import { FrameShape } from './frame.types';

import { ReactComponent as Rectangle } from '../../../assets/icons/rectangle.svg';
import { ReactComponent as Triangle } from '../../../assets/icons/triangle.svg';
import { ReactComponent as Square } from '../../../assets/icons/square.svg';
import { ReactComponent as Circle } from '../../../assets/icons/circle.svg';
import { ReactComponent as Ellipse } from '../../../assets/icons/ellipse.svg';
import { ReactComponent as Diamond } from '../../../assets/icons/diamond.svg';
import { ReactComponent as Star } from '../../../assets/icons/star.svg';
import { ReactComponent as PointedCircle } from '../../../assets/icons/pointed_circle.svg';

export const FRAME_SHAPE_LIST = [
  { label: 'Rectangle', value: FrameShape.None, icon: Rectangle },
  { label: 'Square', value: FrameShape.Square, icon: Square },
  { label: 'Circle', value: FrameShape.Circle, icon: Circle },
  { label: 'Ellipse', value: FrameShape.Ellipse, icon: Ellipse },
  { label: 'Diamond', value: FrameShape.Diamond, icon: Diamond },
  { label: 'Triangle', value: FrameShape.Triangle, icon: Triangle },
  { label: 'Star', value: FrameShape.Star, icon: Star },
  { label: 'Pointed Circle', value: FrameShape.PointedCircle, icon: PointedCircle },
];

export const SQUARE_FRAME = {
  [FrameShape.Circle]: true,
  [FrameShape.Square]: true,
};
