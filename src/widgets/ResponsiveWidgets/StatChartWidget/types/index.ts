import { StatChartType } from '../StatChartWidget.types';
import { DonutStatChart } from './DonutStatChart';
import { HalfDonutStatChart } from './HalfDonutStatChart';
import { ProgressBarStatChart } from './ProgressBarStatChart';
import { IconStatChart } from './IconStatChart';

export const CHART_TYPE_MAP = {
  [StatChartType.Donut]: DonutStatChart,
  [StatChartType.HalfDonut]: HalfDonutStatChart,
  [StatChartType.ProgressBar]: ProgressBarStatChart,
  [StatChartType.Icon]: IconStatChart,
};
