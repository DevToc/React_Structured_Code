import { TextBasedWidgetData } from 'widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { PageToWidgetsMap } from '../../../../../../types/infographTypes';
import { WidgetType } from '../../../../../../types/widget.types';
import { getWidgetTypeFromId } from '../../../../../../widgets/Widget.helpers';
import { InvalidWidgetList } from '../../AccessibilityManager.types';
import { getMarksOfType } from '../TextSizeChecker/TextSizeChecker.helpers';

/**
 * Check if any text widgets in the pageToWidgetMap have links
 * Note: currently what only matters is whether we have links or not
 *
 * @param pageToWidgetMap PageToWidgetsMap
 * @returns one widget that has link in array if any link found
 */
export const checkLinks = (pageToWidgetMap: PageToWidgetsMap) => {
  let isWidgetLinked = false;
  const invalidWidgets: InvalidWidgetList = [];

  Object.entries(pageToWidgetMap).forEach(([pageId, pageWidgets]) => {
    const textBasedWidgets = pageWidgets.filter(({ widgetId }) => {
      const widgetType = getWidgetTypeFromId(widgetId);
      return widgetType === WidgetType.Text || widgetType === WidgetType.Table;
    });

    textBasedWidgets.forEach(({ widgetId, widgetData }) => {
      if (isWidgetLinked) return;

      const { proseMirrorData } = widgetData as TextBasedWidgetData;
      const linkMarks = getMarksOfType('link', proseMirrorData);

      isWidgetLinked = !!linkMarks.length;

      if (isWidgetLinked) {
        invalidWidgets.push({ pageId, widgetId });
      }
    });
  });

  return invalidWidgets;
};
