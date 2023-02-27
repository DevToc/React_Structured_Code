import { WidgetType } from 'types/widget.types';
import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_HEIGHT, DEFAULT_WIDTH } from './ColumnChartWidget.config';
import { chartColorPalette } from '../ChartWidget.config';
import { ChartDataSeries } from '../ChartWidget.types';
import { extendSeriesData } from '../ChartWidget.helpers';
import { VERSION } from './ColumnChartWidget.upgrade';
import { ColumnChartWidgetData } from 'widgets/ChartWidgets/ColumnChartWidget/ColumnChartWidget.types';

const DEFAULT_TEXT_STYLES = {
  color: '#000',
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
};

export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.ColumnChart,
    widgetData: {
      version: VERSION,
      widthPx: DEFAULT_WIDTH,
      heightPx: DEFAULT_HEIGHT,
      topPx: 0,
      leftPx: 0,
      rotateDeg: 0,
      altText: '',
      isDecorative: false,
      legend: {
        enabled: true,
        labelStyle: {
          ...DEFAULT_TEXT_STYLES,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          ...DEFAULT_TEXT_STYLES,
        },
      },
      seriesData: extendSeriesData([
        {
          data: ['Public Sector', 'Education', 'Technology'],
        },
        {
          name: '2010',
          data: [18, 12, 6],
        },
        {
          name: '2020',
          data: [24, 16, 8],
        },
        {
          name: '2030',
          data: [30, 20, 10],
        },
      ] as ChartDataSeries),
      seriesMeta: {
        colors: chartColorPalette,
      },
      xAxis: {
        title: {
          text: 'Industries',
          style: {
            ...DEFAULT_TEXT_STYLES,
            fontWeight: 'bold',
          },
        },
        style: {
          lineColor: '#000000',
          lineWidth: 1,
        },
        labelStyle: {
          ...DEFAULT_TEXT_STYLES,
        },
      },
      yAxis: {
        title: {
          text: 'Percentage of organizations',
          style: {
            ...DEFAULT_TEXT_STYLES,
            fontWeight: 'bold',
          },
        },
        style: {
          lineColor: '#000000',
          lineWidth: 1,
        },
        enableLine: false,
        labelStyle: {
          ...DEFAULT_TEXT_STYLES,
        },
      },
      grid: {
        style: {
          lineColor: '#e6e6e6',
        },
      },
      generalOptions: {
        innerSize: 0,
        borderWidth: DEFAULT_BORDER_WIDTH,
        borderColor: DEFAULT_BORDER_COLOR,
      },
      patterns: {
        enabled: false,
        list: [],
      },
    } as ColumnChartWidgetData,
  };
};
