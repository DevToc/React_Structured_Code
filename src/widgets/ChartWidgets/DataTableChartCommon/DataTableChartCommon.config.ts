import { WidgetType } from 'types/widget.types';

export const HIDDEN_AXIS_LINE_COLOR = 'rgba(0, 0, 0, 0)';
export const HIDDEN_AXIS_LINE_WIDTH = 0;

export const ALLOW_SINGLE_SERIES_CHARTS = [
  WidgetType.BarChart,
  WidgetType.ColumnChart,
  WidgetType.StackedBarChart,
  WidgetType.StackedColumnChart,
];

export const FORCE_SINGLE_SERIES_CHARTS = [WidgetType.PieChart];
