import { chartColorPalette } from '../ChartWidget.config';
import { extendSeriesData } from '../ChartWidget.helpers';
import { ChartDataSeries } from '../ChartWidget.types';

const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 350;

const DEFAULT_TEXT_STYLES = {
  color: '#000',
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
};

const DEFAULT_AREA_CHART_DATA = {
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
  xAxis: {
    title: {
      text: 'Time',
      style: {
        ...DEFAULT_TEXT_STYLES,
        fontWeight: 'bold',
      },
    },
    style: {
      lineColor: '#000',
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
    style: {
      lineColor: '#000',
      lineWidth: 1,
    },
    enableLine: false,
    labelStyle: {
      ...DEFAULT_TEXT_STYLES,
    },
  },
  grid: {
    style: {
      lineColor: '#DBDBDB',
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

  // Not used Data, fix the crashing only
  generalOptions: {
    innerSize: 0,
    borderWidth: 0,
    borderColor: '#FFFFFF',
  },
};

export { DEFAULT_HEIGHT, DEFAULT_WIDTH, DEFAULT_AREA_CHART_DATA };
