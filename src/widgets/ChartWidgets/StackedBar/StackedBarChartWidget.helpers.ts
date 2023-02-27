import { WidgetType } from 'types/widget.types';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, DEFAULT_STACKED_BAR_CHART_DATA } from './StackedBarChartWidget.config';
import { VERSION } from './StackedBarChartWidget.upgrade';
import { StackedBarChartWidgetData } from 'widgets/ChartWidgets/StackedBar/StackedBarChartWidget.types';

export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.StackedBarChart,
    widgetData: {
      version: VERSION,
      widthPx: DEFAULT_WIDTH,
      heightPx: DEFAULT_HEIGHT,
      topPx: 0,
      leftPx: 0,
      rotateDeg: 0,
      altText: '',
      isDecorative: false,
      generalOptions: {
        innerSize: 0,
        borderWidth: 1,
        borderColor: '#FFFFFF',
      },
      patterns: {
        enabled: false,
        list: [],
      },
      // Bar chart specific data
      ...DEFAULT_STACKED_BAR_CHART_DATA,
    } as StackedBarChartWidgetData,
  };
};
