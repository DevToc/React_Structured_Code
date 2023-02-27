import { WidgetType } from 'types/widget.types';
import {
  DEFAULT_DONUT_PIE_INNER_SIZE,
  DEFAULT_HEIGHT,
  DEFAULT_PIE_CHART_DATA,
  DEFAULT_WIDTH,
} from './PieChartWidget.config';
import { VERSION } from './PieChartWidget.upgrade';
import { PieChartWidgetData } from 'widgets/ChartWidgets/PieChartWidget/PieChartWidget.types';

/**
 * Generate default PieChartWidget data
 */
export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.PieChart,
    widgetData: {
      version: VERSION,
      widthPx: DEFAULT_WIDTH,
      heightPx: DEFAULT_HEIGHT,
      topPx: 0,
      leftPx: 0,
      rotateDeg: 0,
      altText: '',
      isDecorative: false,
      patterns: {
        enabled: false,
        list: [],
      },
      // TODO add pie chart specific data here
      ...DEFAULT_PIE_CHART_DATA,
    } as PieChartWidgetData,
  };
};

/**
 * Generate default DonutPieChartWidget data
 */
export const generateDonutPieDefaultData = () => {
  const defaultData = generateDefaultData();

  return {
    ...defaultData,
    widgetData: {
      ...defaultData.widgetData,
      generalOptions: {
        ...defaultData.widgetData.generalOptions,
        innerSize: DEFAULT_DONUT_PIE_INNER_SIZE,
      },
    },
  };
};
