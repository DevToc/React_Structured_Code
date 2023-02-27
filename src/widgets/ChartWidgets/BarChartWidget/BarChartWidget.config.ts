import { chartColorPalette } from '../ChartWidget.config';
import { extendSeriesData } from '../ChartWidget.helpers';
import { ChartDataSeries } from '../ChartWidget.types';

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 300;

const DEFAULT_BORDER_WIDTH = 0;
const DEFAULT_BORDER_COLOR = '#FFF';

// Spacing on right of chart to prevent cropping of data labels
const DEFAULT_SPACING_RIGHT = 25;

const DEFAULT_TEXT_STYLES = {
  color: '#000',
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
};

const DEFAULT_BAR_CHART_DATA = {
  legend: {
    enabled: false,
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
  xAxis: {
    title: {
      text: 'Industries',
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
      text: 'Number of organizations',
      style: {
        ...DEFAULT_TEXT_STYLES,
        fontWeight: 'bold',
      },
    },
    enableLine: false,
    style: {
      lineColor: '#000',
      lineWidth: 1,
    },
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
      data: ['Public Sector', 'Education', 'Technology', 'Financial Services', 'Consumer Products'],
    },
    {
      name: '2020',
      data: [950, 620, 410, 270, 60],
    },
  ] as ChartDataSeries),
  seriesMeta: {
    colors: chartColorPalette,
  },
};

export {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_BAR_CHART_DATA,
  DEFAULT_SPACING_RIGHT,
  DEFAULT_BORDER_WIDTH,
  DEFAULT_BORDER_COLOR,
};
