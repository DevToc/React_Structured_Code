import { customAlphabet } from 'nanoid';
import { generateText } from '@tiptap/core';
import { WidgetType, AccessibleElement } from '../types/widget.types';
import { WidgetId } from '../types/idTypes';
import { Page } from '../types/pageTypes';
import { WidgetsMap, InfographState } from '../types/infographTypes';
import { AllWidgetData } from './Widget.types';
import { extensions } from './TextBasedWidgets/TextWidget/TextWidget.config';
import { GroupWidgetData } from './GroupWidget/GroupWidget.types';
import { SnapRect } from '../hooks/useSmartGuide/useSmartGuide.types';
import { getRotatedRectByAngle } from '../hooks/useSmartGuide/useSmartGuide.helpers';

/**
 * List of widget types that use the 'fit-content' as css height.
 * It's for changing the widget base height dynamically based on the contents.
 * TODO: It should be in the Widget.config.ts but it has an error.
 */
const AUTO_HEIGHT_WIDGET_TYPES: WidgetType[] = [
  WidgetType.Text,
  WidgetType.Table,
  WidgetType.StatChart,
  WidgetType.ResponsiveText,
  WidgetType.LabelText,
];

/**
 * List of widget types that use 'fit-content' as css width.
 * It changes the widget base width dynamically based on the contents.
 */
const AUTO_WIDTH_WIDGET_TYPES: WidgetType[] = [WidgetType.Table];

/**
 *
 * Used to generate random id for widget. 24 chars.
 * (note the actual generate functions prefixes with widget type, which is 3 chars, plus 1 period separator)
 * So the final widget id should be 28 chars
 */
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 24);

/**
 * Generates unique ID for any given type of the widget.
 *
 * @param widgetType Type of widget to generate ID for
 * @returns Unique id of the widget, with type information encoded
 */
export function generateWidgetId(widgetType: WidgetType): WidgetId {
  return `${widgetType}.${nanoid()}`;
}

/**
 * Returns the widgetType of a widgetId string
 *
 * @param widgetId ID of the widget, to determine type of the widget
 * @returns Returns the widgetType of a widgetId string
 */
export function getWidgetTypeFromId(widgetId: WidgetId): WidgetType {
  const widgetType: WidgetType = widgetId.substring(0, 3) as WidgetType;
  return widgetType;
}

/**
 * Generates the label to be announced by screen readers
 * @param widgetId ID of the widget
 * @param data the widget's data
 * @returns label
 */
export function getWidgetLabelInformation(
  widgetId: WidgetId,
  // TODO: refactor this its too coupled with the text widget
  proseMirrorData: any,
  textTag: string,
  altText: string,
): {
  widgetLabel: string;
  widgetDescription: string;
} {
  const widgetType = getWidgetTypeFromId(widgetId);
  let widgetLabel, widgetDescription;

  const graphicalWidgets = {
    [WidgetType.Icon]: 'Icon widget',
    [WidgetType.BasicShape]: 'Basic shape widget',
    [WidgetType.Line]: 'Line widget',
    [WidgetType.Image]: 'Image widget',
    [WidgetType.AreaChart]: 'Area chart widget',
    [WidgetType.BarChart]: 'Bar chart widget',
    [WidgetType.ColumnChart]: 'Column chart widget',
    [WidgetType.LineChart]: 'Line chart widget',
    [WidgetType.PieChart]: 'Pie chart widget',
    [WidgetType.StackedAreaChart]: 'Stacked area chart widget',
    [WidgetType.StackedBarChart]: 'Stacked bar chart widget',
    [WidgetType.StackedColumnChart]: 'Stacked column chart widget',
  };

  switch (widgetType) {
    case WidgetType.Text:
      const textContent = generateText(proseMirrorData, extensions);

      widgetLabel = `${textTag} text widget`;
      widgetDescription = textContent;

      break;
    case WidgetType.Icon:
    case WidgetType.BasicShape:
    case WidgetType.Line:
    case WidgetType.Image:
    case WidgetType.AreaChart:
    case WidgetType.BarChart:
    case WidgetType.ColumnChart:
    case WidgetType.LineChart:
    case WidgetType.PieChart:
    case WidgetType.StackedAreaChart:
    case WidgetType.StackedBarChart:
    case WidgetType.StackedColumnChart:
      const widgetName = graphicalWidgets[widgetType];

      widgetLabel = widgetName;
      widgetDescription = altText || '';
      break;
    default:
      widgetLabel = '';
      widgetDescription = '';
  }

  return {
    widgetLabel,
    widgetDescription,
  };
}

export const getPageWidgetIds = (
  page: Page,
  widgets: WidgetsMap,
  includeAllGroupWidgets: boolean = true,
): WidgetId[] => {
  const widgetIds: WidgetId[] = [];
  if (!page || !page.widgetLayerOrder) return widgetIds;

  page.widgetLayerOrder.forEach((widgetId: WidgetId) => {
    const isGroup = widgets[widgetId].hasOwnProperty('memberWidgetIds');

    if (includeAllGroupWidgets && isGroup) {
      const groupWidget = widgets[widgetId] as GroupWidgetData;
      groupWidget.memberWidgetIds.forEach((memberWidgetId: WidgetId) => {
        widgetIds.push(memberWidgetId);
        if (widgets[memberWidgetId].hasOwnProperty('memberWidgetIds')) {
          const nestedMemberWidgetIds = (widgets[memberWidgetId] as GroupWidgetData).memberWidgetIds;
          nestedMemberWidgetIds.forEach((id: WidgetId) => widgetIds.push(id));
        }
      });
    }

    widgetIds.push(widgetId);
  });

  return widgetIds;
};

/**
 * Gets all the widgets that need to be rendered in page.
 * For GROUP widgets, only includes the member widgets.
 * For RESPONSIVE GROUP widgets, only includes the container widget
 *  - It does not include the member widgets since they will be rendered
 *    by the parent widget.
 *
 * @param page
 * @param widgets
 * @returns WidgetId[] widget ids that need to be rendered
 */
export const getPageWidgetIdsToRender = (page: Page, widgets: WidgetsMap): WidgetId[] => {
  const widgetIds: WidgetId[] = [];
  if (!page || !page.widgetLayerOrder) return widgetIds;

  page.widgetLayerOrder.forEach((widgetId: WidgetId) => {
    const isGroup = getWidgetTypeFromId(widgetId) === WidgetType.Group;

    if (isGroup) {
      const groupWidget = widgets[widgetId] as GroupWidgetData;
      groupWidget.memberWidgetIds.forEach((memberWidgetId: WidgetId) => widgetIds.push(memberWidgetId));
    }

    !isGroup && widgetIds.push(widgetId);
  });

  return widgetIds;
};

export const getAllPageWidgetIds = (infograph: InfographState): WidgetId[] => {
  const { widgets, pages } = infograph;
  const allPageWidgetIds: WidgetId[] = [];

  Object.keys(pages).forEach((pageId) => {
    const page = pages[pageId];
    const pageWidgetIds = getPageWidgetIds(page, widgets);
    allPageWidgetIds.push(...pageWidgetIds);
  });

  return allPageWidgetIds;
};

/**
 * Return the true if the widget position overlap
 *
 * @param widgetA
 * @param widgetB
 * @returns {boolean}
 */
export const intersectRect = (widgetA: SnapRect, widgetB: SnapRect): boolean =>
  !(
    widgetB.leftPx > widgetA.leftPx + widgetA.widthPx ||
    widgetB.leftPx + widgetB.widthPx < widgetA.leftPx ||
    widgetB.topPx > widgetA.topPx + widgetA.heightPx ||
    widgetB.topPx + widgetB.heightPx < widgetA.topPx
  );

/**
 * Note: This is a temporary solution, so it should be resolved using the Java library VenngagePDFUtil later.
 *
 * Headlesschrome generates PDF file's reading order using zIndex.
 * So that, Adobe Acrobat reader and NVDA use the reading order based on the element's zIndex.
 * Re-calculate the zIndex-ordered array using the structure tree and the array of layers.
 *
 * If Reading order widget is covered by another widget, it is an unusual use case.
 * These widgets are excluded from the calculation.
 *
 * @param widgets
 * @param widgetOrderList
 * @param layers
 * @returns {WidgetId[]}
 */
export const calculateZIndexOrdering = (
  widgets: WidgetsMap,
  widgetOrderList: WidgetId[],
  layers: WidgetId[],
): WidgetId[] => {
  let readingOrderIdList = widgetOrderList
    /* Get widgets used in reading order */
    .filter((widgetId: string) => (widgets[widgetId] as AccessibleElement)?.isDecorative !== true)
    /* Filter the overlapped widget */
    .filter((widgetId: string) => {
      const targetWidgetData = widgets[widgetId] as AllWidgetData;

      // Ignore invalid widgetIDs in the structureTree
      if (!targetWidgetData) {
        console.warn(`Not found this widgetId(structureTree) in the widget data list: ${widgetId}`);
        return false;
      }

      const targetWidgetLayerIndex = layers.findIndex((wId) => wId === widgetId);

      // Ignore if this widgetId doesn't exist in layers
      if (targetWidgetLayerIndex === -1) {
        console.warn(`Not found this widgetId(structureTree) in layers: ${widgetId}`);
        return false;
      }

      const rotatedTargetWidgetRect = getRotatedRectByAngle(targetWidgetData, targetWidgetData.rotateDeg);

      // If it overlaps position with the widget of the upper layer, it will be removed
      for (let i = targetWidgetLayerIndex + 1; i < layers.length; i += 1) {
        const isOverlapped = intersectRect(
          rotatedTargetWidgetRect,
          getRotatedRectByAngle(widgets[layers[i]], widgets[layers[i]].rotateDeg),
        );

        if (isOverlapped) return false;
      }

      return true;
    });

  // Remove the widget ids included in the Reading order from layers and push it at the end of the array.
  return layers.filter((widgetId) => !readingOrderIdList.includes(widgetId)).concat(readingOrderIdList);
};

// Temporary solution to filter out the widgets that are not used in any page or group
// but included in the Infograph
export const removeDeletedWidgets = (infograph: InfographState) => {
  // get all widgets that are used on any pages
  const allWidgetIds = getAllPageWidgetIds(infograph);
  const allWidgetIdsMap: { [widgetId: WidgetId]: boolean } = {};
  allWidgetIds.forEach((widgetId) => (allWidgetIdsMap[widgetId] = true));

  // delete widgets that are not used on any pages
  Object.keys(infograph.widgets).forEach((widgetId) => {
    if (allWidgetIdsMap[widgetId]) return;
    delete infograph.widgets[widgetId];
  });

  return infograph;
};

/**
 * Check if this widget type uses fit-content as the height for dynamic height adjustment using content.
 * @param widgetId
 * @returns {boolean}
 */
export const isAutoHeightWidget = (widgetId: WidgetId | WidgetType): boolean =>
  AUTO_HEIGHT_WIDGET_TYPES.includes(getWidgetTypeFromId(widgetId));

/**
 * Check if this widget type uses fit-content as the height for dynamic height adjustment using content.
 * @param widgetId
 * @returns {boolean}
 */
export const isAutoWidthWidget = (widgetId: WidgetId | WidgetType): boolean =>
  AUTO_WIDTH_WIDGET_TYPES.includes(getWidgetTypeFromId(widgetId));

/**
 * Blur on active widget
 * @param widgetId
 */
export const blurActiveWidget = (widgetId: string): void => {
  const activeWidget = document.getElementById(widgetId);
  if (activeWidget) (activeWidget as HTMLElement).blur();
};
