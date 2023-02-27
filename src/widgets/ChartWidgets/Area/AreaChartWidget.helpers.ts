import { WidgetType } from 'types/widget.types';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, DEFAULT_AREA_CHART_DATA } from './AreaChartWidget.config';
import { VERSION } from './AreaChartWidget.upgrade';
import { AreaChartWidgetData } from 'widgets/ChartWidgets/Area/AreaChartWidget.types';

export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.AreaChart,
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
      ...DEFAULT_AREA_CHART_DATA,
    } as AreaChartWidgetData,
  };
};
