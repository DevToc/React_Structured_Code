import { PageId, WidgetId } from '../../../../../../types/idTypes';
import { PageToWidgetsMap } from '../../../../../../types/infographTypes';
import { AccessibleElement, WidgetType } from '../../../../../../types/widget.types';
import { getWidgetTypeFromId } from '../../../../../../widgets/Widget.helpers';

// Widget types that can have alt text
export const ALT_TEXT_WIDGET_TYPES = [
  WidgetType.BasicShape,
  WidgetType.Icon,
  WidgetType.Image,
  WidgetType.Line,
  WidgetType.LineChart,
  WidgetType.PieChart,
  WidgetType.ColumnChart,
  WidgetType.BarChart,
  WidgetType.AreaChart,
  WidgetType.StackedAreaChart,
  WidgetType.StackedBarChart,
  WidgetType.StackedColumnChart,
  WidgetType.StatChart,
];

/**
 * Check if the widgets in the pageToWidgetMap have valid alt text
 *
 * @param pageToWidgetMap PageToWidgetsMap
 * @returns invalid widgets
 */
export const checkAltText = (pageToWidgetMap: PageToWidgetsMap) => {
  const invalidWidgets: { pageId: PageId; widgetId: WidgetId }[] = [];

  Object.entries(pageToWidgetMap).forEach(([pageId, pageWidgets]) => {
    pageWidgets.forEach(({ widgetId, widgetData }) => {
      const type = getWidgetTypeFromId(widgetId);
      const { altText, isDecorative } = widgetData as unknown as AccessibleElement;
      if (!ALT_TEXT_WIDGET_TYPES.includes(type)) {
        return;
      }

      if (!widgetHasAltText(altText, isDecorative)) {
        invalidWidgets.push({ pageId, widgetId });
      }
    });
  });

  return invalidWidgets;
};

export const widgetHasAltText = (altText: string, isDecorative: boolean) => altText || isDecorative;
