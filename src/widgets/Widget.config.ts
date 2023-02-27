import { ReactElement } from 'react';

import { WidgetType } from 'types/widget.types';
import { IconWidget, ReadOnlyIconWidget } from './IconWidget/IconWidget';
import { TextWidget, ReadOnlyTextWidget } from './TextBasedWidgets/TextWidget/TextWidget';
import { GroupWidget, ReadOnlyGroupWidget } from './GroupWidget/GroupWidget';
import { LineWidget, ReadOnlyLineWidget } from './LineWidget/LineWidget';
import { BasicShapeWidget, ReadOnlyBasicShapeWidget } from './BasicShapeWidget/BasicShapeWidget';
import { ImageWidget, ReadOnlyImageWidget } from './ImageWidget/ImageWidget';
import { TableWidget, ReadOnlyTableWidget } from './TextBasedWidgets/TableWidget/TableWidget';

import type { WidgetBaseProp } from './sdk/WidgetBase';
import { PieChartWidget, ReadOnlyPieChartWidget } from './ChartWidgets/PieChartWidget/PieChartWidget';
import { LineChartWidget, ReadOnlyLineChartWidget } from './ChartWidgets/LineChartWidget/LineChartWidget';
import { ColumnChartWidget, ReadOnlyColumnChartWidget } from './ChartWidgets/ColumnChartWidget/ColumnChartWidget';
import { BarChartWidget, ReadOnlyBarChartWidget } from './ChartWidgets/BarChartWidget/BarChartWidget';
import { StackedBarChartWidget, ReadOnlyStackedBarChartWidget } from './ChartWidgets/StackedBar/StackedBarChartWidget';
import {
  StackedColumnChartWidget,
  ReadOnlyStackedColumnChartWidget,
} from './ChartWidgets/StackedColumn/StackedColumnChartWidget';
import { ProgressChartWidget, ReadOnlyProgressChartWidget } from './ProgressChartWidget/ProgressChartWidget';
import { StatChartWidget, ReadOnlyStatChartWidget } from './ResponsiveWidgets/StatChartWidget/StatChartWidget';
import { AreaChartWidget, ReadOnlyAreaChartWidget } from './ChartWidgets/Area/AreaChartWidget';
import {
  StackedAreaChartWidget,
  ReadOnlyStackedAreaChartWidget,
} from './ChartWidgets/StackedArea/StackedAreaChartWidget';
import {
  ReadOnlyResponsiveTextWidget,
  ResponsiveTextWidget,
} from './ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidget';
import { LabelTextWidget, ReadOnlyLabelTextWidget } from './TextBasedWidgets/LabelTextWidget/LabelTextWidget';

type WidgetComponent = (props: WidgetBaseProp) => ReactElement;
type WidgetMap = {
  [index in WidgetType]: { widget: WidgetComponent; readOnlyWidget: WidgetComponent };
};

/**
 * Defines a mapping from WidgetType enum to a widget component
 */
export const WIDGET_TYPE_MAP: WidgetMap = {
  [WidgetType.Icon]: { widget: IconWidget, readOnlyWidget: ReadOnlyIconWidget },
  [WidgetType.Text]: { widget: TextWidget, readOnlyWidget: ReadOnlyTextWidget },
  [WidgetType.BasicShape]: { widget: BasicShapeWidget, readOnlyWidget: ReadOnlyBasicShapeWidget },
  [WidgetType.Group]: { widget: GroupWidget, readOnlyWidget: ReadOnlyGroupWidget },
  [WidgetType.Line]: { widget: LineWidget, readOnlyWidget: ReadOnlyLineWidget },
  [WidgetType.Image]: { widget: ImageWidget, readOnlyWidget: ReadOnlyImageWidget },
  [WidgetType.PieChart]: { widget: PieChartWidget, readOnlyWidget: ReadOnlyPieChartWidget },
  [WidgetType.LineChart]: { widget: LineChartWidget, readOnlyWidget: ReadOnlyLineChartWidget },
  [WidgetType.Table]: { widget: TableWidget, readOnlyWidget: ReadOnlyTableWidget },
  [WidgetType.ColumnChart]: { widget: ColumnChartWidget, readOnlyWidget: ReadOnlyColumnChartWidget },
  [WidgetType.BarChart]: { widget: BarChartWidget, readOnlyWidget: ReadOnlyBarChartWidget },
  [WidgetType.StackedBarChart]: { widget: StackedBarChartWidget, readOnlyWidget: ReadOnlyStackedBarChartWidget },
  [WidgetType.StackedColumnChart]: {
    widget: StackedColumnChartWidget,
    readOnlyWidget: ReadOnlyStackedColumnChartWidget,
  },
  [WidgetType.ProgressChart]: { widget: ProgressChartWidget, readOnlyWidget: ReadOnlyProgressChartWidget },
  [WidgetType.StatChart]: { widget: StatChartWidget, readOnlyWidget: ReadOnlyStatChartWidget },
  [WidgetType.AreaChart]: { widget: AreaChartWidget, readOnlyWidget: ReadOnlyAreaChartWidget },
  [WidgetType.StackedAreaChart]: { widget: StackedAreaChartWidget, readOnlyWidget: ReadOnlyStackedAreaChartWidget },
  [WidgetType.ResponsiveText]: { widget: ResponsiveTextWidget, readOnlyWidget: ReadOnlyResponsiveTextWidget },
  [WidgetType.LabelText]: { widget: LabelTextWidget, readOnlyWidget: ReadOnlyLabelTextWidget },
};
