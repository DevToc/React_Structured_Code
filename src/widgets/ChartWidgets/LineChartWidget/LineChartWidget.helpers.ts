import { WidgetType } from '../../../types/widget.types';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './LineChartWidget.config';
import { chartColorPalette } from '../ChartWidget.config';
import { ChartDataSeries } from '../ChartWidget.types';
import { extendSeriesData } from '../ChartWidget.helpers';
import { VERSION } from './LineChartWidget.upgrade';
import { LineChartWidgetData } from 'widgets/ChartWidgets/LineChartWidget/LineChartWidget.types';

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
    widgetType: WidgetType.LineChart,
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
        enabled: false,
        style: {
          ...DEFAULT_TEXT_STYLES,
        },
      },
      seriesData: extendSeriesData([
        {
          data: ['May 2012', 'Jan 2014', 'Jul 2015', 'Oct 2017', 'Aug 2019', 'Jun 2021'],
        },
        {
          name: 'NVDA',
          data: [63, 63, 42, 64, 61, 66],
        },
        {
          name: 'JAWS',
          data: [42, 50, 40, 61, 75, 58],
        },
        {
          name: 'VoiceOver',
          data: [30, 38, 29, 40, 48, 42],
        },
      ] as ChartDataSeries),
      seriesMeta: {
        colors: chartColorPalette,
      },
      xAxis: {
        title: {
          text: 'Time',
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
          text: 'Percentage usage',
          style: {
            ...DEFAULT_TEXT_STYLES,
            fontWeight: 'bold',
          },
        },
        enableLine: false,
        style: {
          lineColor: '#000000',
          lineWidth: 1,
        },
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
        borderWidth: 0,
        borderColor: '#FFFFFF',
      },
      patterns: {
        enabled: false,
        list: [],
      },
    } as LineChartWidgetData,
  };
};
