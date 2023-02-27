import { ProgressChartType } from './ProgressChartWidget.types';

const DEFAULT_VALUE = 67;
const DEFAULT_DATA_COLOR = '#0069D1';
const DEFAULT_NON_DATA_COLOR = '#D9E1FF';

export const DEFAULT_WIDTH = 150;
export const DEFAULT_HEIGHT = 75;
export const DEFAULT_BAR_HEIGHT = 12;

// Max and min value for bar height in toolbar
export const MAX_BAR_HEIGHT = 50;
export const MIN_BAR_HEIGHT = 5;

export const DEFAULT_PROGRESS_CHART_DATA_MAP = {
  [ProgressChartType.Donut]: {
    type: ProgressChartType.Donut,

    donutSize: 0.87,
    barHeight: DEFAULT_BAR_HEIGHT,
    value: DEFAULT_VALUE,
    cornerRadius: 1,
    dataColor: DEFAULT_DATA_COLOR,
    nonDataColor: DEFAULT_NON_DATA_COLOR,

    widthPx: DEFAULT_WIDTH,
    heightPx: DEFAULT_WIDTH,
  },
  [ProgressChartType.HalfDonut]: {
    type: ProgressChartType.HalfDonut,

    donutSize: 0.85,
    barHeight: DEFAULT_BAR_HEIGHT,
    value: DEFAULT_VALUE,
    cornerRadius: 1,
    dataColor: DEFAULT_DATA_COLOR,
    nonDataColor: DEFAULT_NON_DATA_COLOR,

    widthPx: DEFAULT_WIDTH,
    heightPx: DEFAULT_HEIGHT,
  },
  [ProgressChartType.Bar]: {
    type: ProgressChartType.Bar,

    donutSize: 0.85,
    barHeight: DEFAULT_BAR_HEIGHT,
    value: DEFAULT_VALUE,
    cornerRadius: 1,
    dataColor: DEFAULT_DATA_COLOR,
    nonDataColor: DEFAULT_NON_DATA_COLOR,

    widthPx: DEFAULT_WIDTH,
    heightPx: DEFAULT_BAR_HEIGHT,
  },
};
