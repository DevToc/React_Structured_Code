import { AllWidgetData, NewWidget } from 'widgets/Widget.types';
import { IconWidgetData, IconWidgetType } from 'widgets/IconWidget/IconWidget.types';
import { WidgetType, Widget } from 'types/widget.types';
import { WidgetId } from 'types/idTypes';
import { adjustSVGViewBox, getGridIconSize } from 'widgets/IconWidget/IconWidget.helpers';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';

type HandleReplaceData = {
  newWidgetData: AllWidgetData | NewWidget;
  widgetData: Widget;
  viewBox: string;
  widgetId: WidgetId;
};

/**
 * Function to handle the replace data based on the widget type
 * @param widgetId
 * @param widgetData widget data of the selected widge
 * @param newWidgetData widget data of the new replace widget
 * @param viewBox - The current widget metadata object
 *
 * @returns the data that needs to be replaced
 */
export const handleReplaceData = ({ widgetId, widgetData, newWidgetData, viewBox }: HandleReplaceData) => {
  const widgetType = getWidgetTypeFromId(widgetId);

  switch (widgetType) {
    // update the icon widget with a new icon
    case WidgetType.Icon: {
      const { iconId: newIconId } = newWidgetData as IconWidgetData;
      const { type = IconWidgetType.Single, widthPx, heightPx } = widgetData as IconWidgetData;

      if (type === IconWidgetType.Grid) {
        const { gridItemWidthPx, gridItemHeightPx } = widgetData as IconWidgetData;
        const maxSize = Math.max(gridItemWidthPx!, gridItemHeightPx!);

        const { width: newGridWidthPx, height: newGridHeightPx } = adjustSVGViewBox({ viewBox, maxSize });
        const { height: newHeightPx, width: newWidthPx } = getGridIconSize(widgetId, newGridWidthPx, newGridHeightPx);

        return {
          heightPx: newHeightPx,
          widthPx: newWidthPx,
          gridItemWidthPx: newGridWidthPx,
          gridItemHeightPx: newGridHeightPx,
          iconId: newIconId,
        };
      }

      const maxSize = Math.max(widthPx, heightPx);
      const { width: newWidthPx, height: newHeightPx } = adjustSVGViewBox({ viewBox, maxSize });

      return { iconId: newIconId, heightPx: newHeightPx, widthPx: newWidthPx };
    }
    default:
      return {};
  }
};

/**
 * Check if the widget has a replace option
 * @param widgetId
 */
export const widgetHasReplace = (widgetId: WidgetId) => {
  if (!widgetId) return false;

  const widgetType = getWidgetTypeFromId(widgetId);
  if (widgetType === WidgetType.Icon) return true;

  return false;
};
