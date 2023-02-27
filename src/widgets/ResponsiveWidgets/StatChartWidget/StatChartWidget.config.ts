import { HANDLE } from 'constants/bounding-box';
import { Widget } from 'types/widget.types';
import { StatChartWidgetData, StatChartType } from './StatChartWidget.types';

const DEFAULT_VERTICAL_SPACING = 6;
const DEFAULT_PRIMARY_CHART_COLOR = '#0069D1';
const DEFAULT_SECONDARY_CHART_COLOR = '#D9E1FF';
const DEFAULT_FONT_SIZE = 38;
const DEFAULT_FONT_WIDTH_PX = 150;
const DEFAULT_ICON_WIDTH_PX = 550;
const DEFAULT_ICON_HEIGHT_PX = 42;
const DEFAULT_ICON_GAP = 10;
const DEFAULT_ICON_SIZE = 42;
const DEFAULT_ICON_NUMBER = 10;
const DEFAULT_ICON_ID = 'icons8-6110';
const DEFAULT_FILL_PERCENTAGE = 67;

const CHART_TYPE_DEFAULT_DIMENSIONS_MAP = {
  [StatChartType.Donut]: {
    widgetDimension: { widthPx: 150, heightPx: 150 },
  },
  [StatChartType.HalfDonut]: {
    widgetDimension: { widthPx: 150, heightPx: 75 },
  },
  [StatChartType.ProgressBar]: {
    widgetDimension: { widthPx: 150, heightPx: 56 },
  },
  [StatChartType.Icon]: {
    widgetDimension: { widthPx: 650, heightPx: 42 },
  },
};

const BOUNDING_BOX_CONFIG = {
  customHandle: (widget: Widget) => {
    const widgetData = widget as StatChartWidgetData;
    const typesWithSideHandle = [StatChartType.Icon, StatChartType.ProgressBar];

    if (typesWithSideHandle.includes(widgetData.type)) return HANDLE.SIDE_CORNERS;
    return HANDLE.CORNERS;
  },
};

export {
  CHART_TYPE_DEFAULT_DIMENSIONS_MAP,
  BOUNDING_BOX_CONFIG,
  DEFAULT_VERTICAL_SPACING,
  DEFAULT_PRIMARY_CHART_COLOR,
  DEFAULT_SECONDARY_CHART_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WIDTH_PX,
  DEFAULT_ICON_WIDTH_PX,
  DEFAULT_ICON_HEIGHT_PX,
  DEFAULT_ICON_GAP,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_ID,
  DEFAULT_ICON_NUMBER,
  DEFAULT_FILL_PERCENTAGE,
};
