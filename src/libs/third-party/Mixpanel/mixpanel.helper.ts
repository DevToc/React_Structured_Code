import { WidgetType } from 'types/widget.types';

export function generateToolbarName(widgetType: WidgetType) {
  let name;
  switch (widgetType) {
    case WidgetType.Icon:
      name = 'Icon Toolbar';
      break;
    case WidgetType.BasicShape:
      name = 'Shape Toolbar';
      break;
    case WidgetType.Image:
      name = 'Image Toolbar';
      break;
    case WidgetType.Line:
      name = 'Line Toolbar';
      break;
    case WidgetType.AreaChart:
    case WidgetType.BarChart:
    case WidgetType.PieChart:
    case WidgetType.ColumnChart:
    case WidgetType.LineChart:
    case WidgetType.StackedAreaChart:
    case WidgetType.StackedBarChart:
    case WidgetType.StackedColumnChart:
      name = 'Chart Toolbar';
      break;
    default:
      console.warn('Need to add a new widget type');
      name = 'Unknown';
      break;
  }

  return name;
}
