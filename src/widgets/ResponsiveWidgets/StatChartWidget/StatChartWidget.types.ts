import { AccessibleElement } from 'types/widget.types';
import { ResponsiveWidgetBaseData } from '../ResponsiveWidgetBase.types';

enum ComponentWidgetIdKeys {
  Chart = 'chart',
  MetricText = 'metricText',
  IconGrid = 'iconGrid',

  // DescriptionText = 'descriptionText',
}

enum StatChartType {
  Donut = 'Donut',
  HalfDonut = 'HalfDonut',
  ProgressBar = 'Progress Bar',
  Icon = 'Icon',
}

// enum StatChartLayoutOption {
//   ValueInside = 'ValueInside',
//   ValueOutside = 'ValueOutside',
//   DescriptionBelow = 'DescriptionBelow',
//   DescriptionAbove = 'DescriptionAbove',
// };

interface StatChartWidgetData extends ResponsiveWidgetBaseData<ComponentWidgetIdKeys>, AccessibleElement {
  type: StatChartType;

  // TODO add back when layout options are implemented
  // layout: StatChartLayoutOption;
  // Spacing
  verticalSpacing?: number;
}

export type { StatChartWidgetData };
export { StatChartType, ComponentWidgetIdKeys };
