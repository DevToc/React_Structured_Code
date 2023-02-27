import { ProgressChartType } from '../ProgressChartWidget.types';
import { DonutChart } from './Donut';
import { BarChart } from './Bar';

export const CHART_TYPE_MAP = {
  [ProgressChartType.Donut]: {
    component: DonutChart,
    props: { type: 'full' },
  },
  [ProgressChartType.HalfDonut]: {
    component: DonutChart,
    props: { type: 'half' },
  },
  [ProgressChartType.Bar]: {
    component: BarChart,
    props: null,
  },
};
