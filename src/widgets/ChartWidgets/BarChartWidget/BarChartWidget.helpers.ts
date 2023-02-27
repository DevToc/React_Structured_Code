import { WidgetType } from 'types/widget.types';
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_BAR_CHART_DATA,
  DEFAULT_BORDER_WIDTH,
  DEFAULT_BORDER_COLOR,
} from './BarChartWidget.config';
import { VERSION } from './BarChartWidget.upgrade';
import { BarChartWidgetData } from 'widgets/ChartWidgets/BarChartWidget/BarChartWidget.types';

export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.BarChart,
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
        borderWidth: DEFAULT_BORDER_WIDTH,
        borderColor: DEFAULT_BORDER_COLOR,
      },
      patterns: {
        enabled: false,
        list: [],
      },
      // Bar chart specific data
      ...DEFAULT_BAR_CHART_DATA,
    } as BarChartWidgetData,
  };
};
