import { WidgetType } from 'types/widget.types';
import { WidgetBoundingBoxConfig, WidgetControlDirection } from './BoundingBox.types';

// Widget specific bounding box config
import {
  BOUNDING_BOX_CONFIG as TextBasedBoundingBoxConfig,
  TABLE_BOUNDING_BOX_CONFIG as TableBoundingBoxConfig,
} from 'widgets/TextBasedWidgets/common/TextBasedWidgets.config';
import { BOUNDING_BOX_CONFIG as IconBoundingBoxConfig } from 'widgets/IconWidget/IconWidget.config';
import { BOUNDING_BOX_CONFIG as LineBoundingBoxConfig } from 'widgets/LineWidget/LineWidget.config';
import { BOUNDING_BOX_CONFIG as ImageBoundingBoxConfig } from 'widgets/ImageWidget/ImageWidget.config';
import { BOUNDING_BOX_CONFIG as StatChartBoundingBoxConfig } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.config';
import { BOUNDING_BOX_CONFIG as ResponsiveTextBoundingBoxConfig } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.config';
import { HANDLE } from 'constants/bounding-box';

export const DEFAULT_SNAP_DATA = {
  x: null,
  y: null,
  width: null,
  height: null,
};

// Set specific bounding box control handles for your widget
// defaults to ALL if widget is not added here
export const WIDGET_BOUNDING_BOX_CONFIG: WidgetBoundingBoxConfig = {
  [WidgetType.Text]: TextBasedBoundingBoxConfig,
  [WidgetType.Icon]: IconBoundingBoxConfig,
  [WidgetType.Line]: LineBoundingBoxConfig,
  [WidgetType.Image]: ImageBoundingBoxConfig,
  [WidgetType.Table]: TableBoundingBoxConfig,
  [WidgetType.LabelText]: TextBasedBoundingBoxConfig,
  [WidgetType.StatChart]: StatChartBoundingBoxConfig,
  [WidgetType.ResponsiveText]: ResponsiveTextBoundingBoxConfig,
};

// By default, widgets should always scale from the corner handle if it is shown
export const DEFAULT_WIDGET_BOUNDING_BOX_CONFIG: WidgetControlDirection = {
  keepAspectRatioHandles: HANDLE.CORNERS,
};
