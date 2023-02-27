import { ReactElement } from 'react';
import { WidgetId } from 'types/idTypes';
import { Widget, WidgetType } from 'types/widget.types';
import { IconWidgetData } from './IconWidget/IconWidget.types';
import { TextWidgetData, TextWidgetToolbarUIControl } from './TextBasedWidgets/TextWidget/TextWidget.types';
import { GroupWidgetData } from './GroupWidget/GroupWidget.types';
import { LineWidgetData } from './LineWidget/LineWidget.types';
import { BasicShapeWidgetData } from './BasicShapeWidget/BasicShapeWidget.types';
import { ImageWidgetData } from './ImageWidget/ImageWidget.types';
import { TableWidgetData } from './TextBasedWidgets/TableWidget/TableWidget.types';
import { PieChartWidgetData } from './ChartWidgets/PieChartWidget/PieChartWidget.types';
import { LineChartWidgetData } from './ChartWidgets/LineChartWidget/LineChartWidget.types';
import { ColumnChartWidgetData } from './ChartWidgets/ColumnChartWidget/ColumnChartWidget.types';
import { BarChartWidgetData } from './ChartWidgets/BarChartWidget/BarChartWidget.types';
import { ProgressChartWidgetData } from './ProgressChartWidget/ProgressChartWidget.types';
import { StatChartWidgetData } from './ResponsiveWidgets/StatChartWidget/StatChartWidget.types';
import { LabelTextWidgetData } from './TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';

type NewWidget = {
  widgetType: WidgetType;
  widgetData: AllWidgetData;
  groupWidgets?: NewWidget[];

  // For widgets that extend ResponsiveWidgetData
  isResponsiveGroup?: boolean;
  componentKey?: string;
};

type SetWidgetRef = (id: WidgetId, ref: HTMLElement | null) => void;
type CleanupWidgetBoundingBoxConfig = (id: WidgetId) => void;
type SetCustomWidgetOverride = (
  id: WidgetId,
  boundingBoxFunction: (arg: any) => void,
  boundingBoxFunctionName: string,
) => void;

/**
 * Convenience type which could be any of defined widget data type for all widgets
 */
type AllWidgetData =
  | IconWidgetData
  | TextWidgetData
  | GroupWidgetData
  | LineWidgetData
  | BasicShapeWidgetData
  | ImageWidgetData
  | PieChartWidgetData
  | LineChartWidgetData
  | TableWidgetData
  | ColumnChartWidgetData
  | BarChartWidgetData
  | ProgressChartWidgetData
  | StatChartWidgetData
  | LabelTextWidgetData;

type WidgetMap = {
  [index: WidgetId]: Widget | AllWidgetData;
};

/**
 * Widget font property name has to be one of following standard enum value
 */
enum WidgetFontProperty {
  family = 'family',
  fontFamily = 'fontFamily',
}

type AllWidgetUIControl = TextWidgetToolbarUIControl;

type GetWidgetMemberComponent = () => (args: {
  widgetId: WidgetId;
  zIndex?: number;
  customWidgetData?: Partial<Widget | AllWidgetData>;
  isReadOnly?: boolean;
  includeAltTextImg?: boolean;
  getWidgetMemberComponent?: GetWidgetMemberComponent;
}) => ReactElement | null;

export type {
  WidgetMap,
  SetWidgetRef,
  CleanupWidgetBoundingBoxConfig,
  SetCustomWidgetOverride,
  AllWidgetData,
  AllWidgetUIControl,
  NewWidget,
  GroupWidgetData,
  GetWidgetMemberComponent,
};

export { WidgetFontProperty };
