import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { PageToWidgetsMap } from 'types/infographTypes';
import { WidgetType } from 'types/widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { getTextWidgetLabel } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.helpers';

/**
 * Iterates document pages, and get the text content up to giving limit
 *
 * @param pageToWidgetMap document pages in a map with its widgets
 * @returns document text content in giving specific limit length
 */
export const getDocumentTextContent = (pageToWidgetMap: PageToWidgetsMap, limit = 100) => {
  let textContent = '';

  Object.values(pageToWidgetMap).some((pageWidgets) => {
    return pageWidgets.some(({ widgetId, widgetData }) => {
      const widgetType = getWidgetTypeFromId(widgetId);
      // Note: Table has same widget data as text
      if ([WidgetType.Table, WidgetType.Text].includes(widgetType)) {
        textContent = textContent.concat(' ', getTextWidgetLabel(widgetData as TextWidgetData, limit)).trim();

        // Terminate loop early if text content length over giving limit
        return textContent.length > limit;
      }

      return false;
    });
  });

  return textContent.substring(0, limit);
};
