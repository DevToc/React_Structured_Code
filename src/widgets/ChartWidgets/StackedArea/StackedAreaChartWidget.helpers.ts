import { WidgetType } from 'types/widget.types';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, DEFAULT_STACKED_AREA_CHART_DATA } from './StackedAreaChartWidget.config';
import { VERSION } from './StackedAreaChartWidget.upgrade';
import { StackedAreaChartWidgetData } from 'widgets/ChartWidgets/StackedArea/StackedAreaChartWidget.types';

export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.StackedAreaChart,
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
      ...DEFAULT_STACKED_AREA_CHART_DATA,
    } as StackedAreaChartWidgetData,
  };
};
