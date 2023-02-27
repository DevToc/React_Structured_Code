import { WidgetType } from 'types/widget.types';
import { normalizeNumber } from 'utils/number';
import { DEFAULT_PROGRESS_CHART_DATA_MAP } from './ProgressChartWidget.config';
import { ProgressChartType, ProgressChartWidgetData } from './ProgressChartWidget.types';
import { VERSION } from './ProgressChartWidget.upgrade';

/**
 * Converts percentage input from toolbar Donut Size slider to value to be saved
 * in widget data. Normalizes the input.
 *
 * @param donutSize number This is an integer between [0, 100] that is displayed in the toolbar slider
 * @param type ProgressChartType
 * @returns decimal number to be saved in ProgressChart widget data
 */
export const convertDonutSizeInputToChartData = (donutSize: number, type: ProgressChartType) => {
  const normalized =
    type === ProgressChartType.HalfDonut
      ? normalizeNumber(60, 98, 0.38 * donutSize + 60)
      : normalizeNumber(0, 98, 0.98 * donutSize);

  return normalized / 100;
};

/**
 * Converts donutSize property of widget data to value that will be displayed in the
 * toolbar Donut Size slider input.
 *
 * @param donutSize number Donut size as a percent in decimal form - this is what is stored in the widget data
 * @param type ProgressChartType
 * @returns
 */
export const convertDonutSizeChartDataToInput = (donutSize: number, type: ProgressChartType) => {
  return type === ProgressChartType.HalfDonut ? (donutSize * 100 - 60) / 0.38 : (donutSize * 100) / 0.98;
};

export const generateDefaultData = (
  chartType: ProgressChartType,
  progressChartConfig?: Partial<ProgressChartWidgetData>,
) => {
  return Object.assign({
    widgetType: WidgetType.ProgressChart,
    widgetData: {
      version: VERSION,
      topPx: 0,
      leftPx: 0,
      rotateDeg: 0,
      isHidden: progressChartConfig?.isHidden || false,

      ...DEFAULT_PROGRESS_CHART_DATA_MAP[chartType],
    },
  });
};
