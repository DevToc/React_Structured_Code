import { chartColorPalette } from '../ChartWidget.config';
import { extendSeriesData } from '../ChartWidget.helpers';
import { ChartDataSeries } from '../ChartWidget.types';

const DEFAULT_WIDTH = 450;
const DEFAULT_HEIGHT = 350;

const DEFAULT_PIE_BORDER_WIDTH = 1;
const DEFAULT_PIE_BORDER_COLOR = '#FFF';
const DEFAULT_PIE_INNER_SIZE = 0;
const DEFAULT_PIE_NUMBER_FORMAT = 'percentage';

const DEFAULT_DONUT_PIE_BORDER_WIDTH = DEFAULT_PIE_BORDER_WIDTH;
const DEFAULT_DONUT_PIE_BORDER_COLOR = DEFAULT_PIE_BORDER_COLOR;
const DEFAULT_DONUT_PIE_INNER_SIZE = 50;

const DEFAULT_TEXT_STYLES = {
  color: '#000',
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
};

const DEFAULT_PIE_CHART_DATA = {
  generalOptions: {
    borderWidth: DEFAULT_PIE_BORDER_WIDTH,
    borderColor: DEFAULT_PIE_BORDER_COLOR,
    innerSize: DEFAULT_PIE_INNER_SIZE,
  },
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
      name: 'Category',
      data: ['LinkedIn', 'Indeed', 'Agency', 'Website'],
    },
    {
      name: 'Value',
      data: [55, 40, 22, 16],
    },
  ] as ChartDataSeries),
  seriesMeta: {
    colors: chartColorPalette,
  },
  xAxis: {
    style: {
      lineColor: '#000',
      lineWidth: 1,
    },
    labelStyle: {
      ...DEFAULT_TEXT_STYLES,
    },
    title: {
      text: '',
      style: {
        ...DEFAULT_TEXT_STYLES,
      },
    },
  },
  yAxis: {
    style: {
      lineColor: '#000',
      lineWidth: 1,
    },
    labelStyle: {
      ...DEFAULT_TEXT_STYLES,
    },
    title: {
      text: '',
      style: {
        ...DEFAULT_TEXT_STYLES,
      },
    },
  },
  grid: {
    style: {
      lineColor: '#DBDBDB',
    },
  },
  numberFormat: {
    format: DEFAULT_PIE_NUMBER_FORMAT,
    separator: 'none',
    decimalPrecision: 'auto',
  },
};

export {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_PIE_CHART_DATA,
  DEFAULT_PIE_BORDER_COLOR,
  DEFAULT_PIE_BORDER_WIDTH,
  DEFAULT_PIE_INNER_SIZE,
  DEFAULT_PIE_NUMBER_FORMAT,
  DEFAULT_DONUT_PIE_BORDER_COLOR,
  DEFAULT_DONUT_PIE_BORDER_WIDTH,
  DEFAULT_DONUT_PIE_INNER_SIZE,
};
