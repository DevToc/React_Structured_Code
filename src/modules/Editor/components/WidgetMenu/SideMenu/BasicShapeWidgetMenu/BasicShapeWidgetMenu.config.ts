import {
  BasicShapeType,
  BasicShapeWidgetData,
} from '../../../../../../widgets/BasicShapeWidget/BasicShapeWidget.types';

interface Dimension {
  widthPx: number;
  heightPx: number;
}

interface BasicShapeWidgetMenuItem {
  type: BasicShapeType;
  label: string;
  iconDimensions: Dimension;
  options?: Partial<BasicShapeWidgetData>;
}

const PILL_CORNER_RADIUS = 50;
const ROUNDED_RECT_CORNER_RADIUS = 10;

const DEFAULT_ICON_WIDTH = 46;
const DEFAULT_ICON_HEIGHT = 46;

const ICON_ONE_TO_ONE_DIM = { widthPx: DEFAULT_ICON_WIDTH, heightPx: DEFAULT_ICON_HEIGHT };
const ICON_LANDSCAPE_DIM = { widthPx: DEFAULT_ICON_WIDTH, heightPx: DEFAULT_ICON_HEIGHT / 2 };

export const ICON_TO_WIDGET_SCALE = 4;

/**
 * Array of basic shape widgets that will be displayed in the left panel
 * For each shape in the array, a fill-only and border-only option will be added
 * to the menu.
 */
export const BASIC_SHAPE_WIDGET_MENU_ITEMS: Array<BasicShapeWidgetMenuItem> = [
  {
    type: BasicShapeType.Rectangle,
    label: 'Square',
    iconDimensions: { ...ICON_ONE_TO_ONE_DIM },
  },
  {
    type: BasicShapeType.Rectangle,
    label: 'Rounded Rectangle',
    iconDimensions: { ...ICON_ONE_TO_ONE_DIM },
    options: { cornerRadius: ROUNDED_RECT_CORNER_RADIUS },
  },
  {
    type: BasicShapeType.Rectangle,
    label: 'Rectangle',
    iconDimensions: { ...ICON_LANDSCAPE_DIM },
  },
  {
    type: BasicShapeType.Ellipse,
    label: 'Circle',
    iconDimensions: { ...ICON_ONE_TO_ONE_DIM },
  },
  {
    type: BasicShapeType.Rectangle,
    label: 'Pill',
    iconDimensions: { ...ICON_LANDSCAPE_DIM },
    options: { cornerRadius: PILL_CORNER_RADIUS },
  },
  {
    type: BasicShapeType.Ellipse,
    label: 'Oval',
    iconDimensions: { ...ICON_LANDSCAPE_DIM },
  },
  {
    type: BasicShapeType.RightTriangle,
    label: 'Right Triangle',
    iconDimensions: { ...ICON_ONE_TO_ONE_DIM },
  },
  {
    type: BasicShapeType.Triangle,
    label: 'Triangle',
    iconDimensions: { ...ICON_ONE_TO_ONE_DIM },
  },
  {
    type: BasicShapeType.SemiCircle,
    label: 'SemiCircle',
    iconDimensions: { ...ICON_LANDSCAPE_DIM },
  },
];
