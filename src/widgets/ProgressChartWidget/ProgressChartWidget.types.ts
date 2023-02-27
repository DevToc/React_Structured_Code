import { Widget } from 'types/widget.types';

export enum ProgressChartType {
  Donut = 'Donut',
  HalfDonut = 'HalfDonut',
  Bar = 'Bar',
}

interface ProgressChartWidgetData extends Widget {
  type: ProgressChartType;

  // Percent in decimal form (0-1)
  // Note: this is the value that is directly passed to the Nivo Pie
  // component but the value is normalized when displayed in the Donut Size
  // toolbar slider due to issues rendering using the entire range of 0-100%
  donutSize: number;

  // Normalized value in range [5-50]
  // This is the value displayed in the toolbar
  barHeight: number;

  // 0-100
  value: number;

  // Percent in decimal form (0-1)
  cornerRadius: number;

  dataColor: string;
  nonDataColor: string;
}

export type { ProgressChartWidgetData };
