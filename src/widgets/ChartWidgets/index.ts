import { TableWidget } from '../TextBasedWidgets/TableWidget/TableWidget';
import { ChartType } from './ChartWidget.types';

export const CHART_TYPE_MAP = {
  [ChartType.Table]: TableWidget,
};
