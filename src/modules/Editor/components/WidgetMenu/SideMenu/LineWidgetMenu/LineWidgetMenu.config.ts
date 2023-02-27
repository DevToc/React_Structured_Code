import { LineWidgetTypes, StraightLineProps } from '../../../../../../widgets/LineWidget/LineWidget.types';
import {
  DEFAULT_STROKE_DASH_TYPE,
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_STROKE_START_ARROW_STYLE,
  DEFAULT_STROKE_END_ARROW_STYLE,
} from '../../../../../../widgets/LineWidget/LineWidget.config';

interface LineWidgetMenuItem {
  type: LineWidgetTypes;
  label: string;
  options: StraightLineProps;
  isDecorative?: boolean;
}

export const DEFAULT_ICON_SIZE = 46;
export const DEFAULT_BUTTON_SIZE = 72;
export const DEFAULT_ICON_STROKE_WIDTH = 3;

const DEFAULT_HORIZONTAL_STRAIGHT_LINE_DATA = {
  topPx: 200,
  posList: [
    { xPx: 0, yPx: 10 },
    {
      xPx: 400,
      yPx: 10,
    },
  ],
  widthPx: 400,
  heightPx: 20,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  strokeColor: DEFAULT_FILL_COLOR,
  strokeDashType: DEFAULT_STROKE_DASH_TYPE,
  startArrowStyle: DEFAULT_STROKE_START_ARROW_STYLE,
  endArrowStyle: DEFAULT_STROKE_END_ARROW_STYLE,
};

const DEFAULT_VERTICAL_STRAIGHT_LINE_DATA = {
  leftPx: 200,
  posList: [
    { xPx: 10, yPx: 0 },
    {
      xPx: 10,
      yPx: 400,
    },
  ],
  widthPx: 20,
  heightPx: 400,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  strokeColor: DEFAULT_FILL_COLOR,
  strokeDashType: DEFAULT_STROKE_DASH_TYPE,
  startArrowStyle: DEFAULT_STROKE_START_ARROW_STYLE,
  endArrowStyle: DEFAULT_STROKE_END_ARROW_STYLE,
};

/**
 * Array of line widgets that will be displayed in the left panel
 * It render the svg size to the icon size using the DEFAULT_ICON_SIZE value
 */
export const HORIZONTAL_STRAIGHT_LINE_ITEMS: LineWidgetMenuItem[] = [
  {
    type: LineWidgetTypes.straight,
    label: 'horizontal line',
    options: {
      ...DEFAULT_HORIZONTAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-horizontal-line',
    },
    isDecorative: true,
  },
  {
    type: LineWidgetTypes.straight,
    label: 'horizontal line with the start arrow',
    options: {
      ...DEFAULT_HORIZONTAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-horizontal-line-with-start-arrow',
      startArrowStyle: 'basic',
    },
  },
  {
    type: LineWidgetTypes.straight,
    label: 'horizontal line with the end arrow',
    options: {
      ...DEFAULT_HORIZONTAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-horizontal-line-with-end-arrow',
      endArrowStyle: 'basic',
    },
  },
  {
    type: LineWidgetTypes.straight,
    label: 'horizontal line with arrows',
    options: {
      ...DEFAULT_HORIZONTAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-horizontal-line-with-arrow',
      startArrowStyle: 'basic',
      endArrowStyle: 'basic',
    },
  },
];

export const VERTICAL_STRAIGHT_LINE_ITEMS: LineWidgetMenuItem[] = [
  {
    type: LineWidgetTypes.straight,
    label: 'vertical line',
    options: {
      ...DEFAULT_VERTICAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-vertical-line',
    },
    isDecorative: true,
  },
  {
    type: LineWidgetTypes.straight,
    label: 'vertical line with the start arrow',
    options: {
      ...DEFAULT_VERTICAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-vertical-line-with-start-arrow',
      startArrowStyle: 'basic',
    },
  },
  {
    type: LineWidgetTypes.straight,
    label: 'vertical line with the end arrow',
    options: {
      ...DEFAULT_VERTICAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-vertical-line-with-end-arrow',
      endArrowStyle: 'basic',
    },
  },
  {
    type: LineWidgetTypes.straight,
    label: 'vertical line with arrows',
    options: {
      ...DEFAULT_VERTICAL_STRAIGHT_LINE_DATA,
      widgetId: 'line-menu-vertical-line-with-arrows',
      startArrowStyle: 'basic',
      endArrowStyle: 'basic',
    },
  },
];

export const LINE_WIDGET_MENU_ITEMS = [...HORIZONTAL_STRAIGHT_LINE_ITEMS, ...VERTICAL_STRAIGHT_LINE_ITEMS];
