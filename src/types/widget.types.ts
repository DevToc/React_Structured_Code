/**
 * Type of widgets
 */
enum WidgetType {
  Icon = '002',
  Text = '003',
  Group = '004',
  Line = '005',
  BasicShape = '006',
  Image = '007',
  Table = '008',
  PieChart = '009',
  LineChart = '010',
  ColumnChart = '011',
  BarChart = '012',
  StackedBarChart = '013',
  StackedColumnChart = '014',
  ProgressChart = '015',
  StatChart = '016',
  AreaChart = '017',
  StackedAreaChart = '018',
  ResponsiveText = '019',
  LabelText = '020',
}

type BasicWidgetTypes =
  | WidgetType.Icon
  | WidgetType.Text
  | WidgetType.Line
  | WidgetType.BasicShape
  | WidgetType.Image
  | WidgetType.Table
  | WidgetType.PieChart
  | WidgetType.LineChart
  | WidgetType.ColumnChart
  | WidgetType.BarChart
  | WidgetType.AreaChart
  | WidgetType.StackedAreaChart;

/**
 * Parent base widget, shared across all widgets
 */
interface Widget {
  version: number;
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;
  rotateDeg: number;
  isLocked?: boolean;
  isAspectRatioLocked?: boolean;
  // a hidden widget is not rendered by the renderer
  isHidden?: boolean;
  // zIndex is determined by WidgetRenderer, at render time, based on widgetLayerOrder stored in the parent Page
  // zIndex is set by renderer. Even if this field is saved in backend, it's ignored when rendered
  zIndex?: number;
}

interface AccessibleElement {
  altText: string;
  isDecorative: boolean;
}

export { WidgetType };
export type { Widget, AccessibleElement, BasicWidgetTypes };
