import { PageId, WidgetId } from '../../../../../../types/idTypes';
import { PageToWidgetsMap, WidgetsMap } from '../../../../../../types/infographTypes';
import { Widget, WidgetType } from '../../../../../../types/widget.types';
import { TextWidgetData } from '../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { TextWidgetTag } from '../../../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { AllWidgetData } from '../../../../../../widgets/Widget.types';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';
import { ComponentWidgetIdKeys } from 'widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidget.types';

type HeadingTag =
  | TextWidgetTag.H1
  | TextWidgetTag.H2
  | TextWidgetTag.H3
  | TextWidgetTag.H4
  | TextWidgetTag.H5
  | TextWidgetTag.H6;

type WidgetTagData = {
  widgetId: WidgetId;
  widgetData: Widget | AllWidgetData;
};

type InvalidWidgetList = {
  pageId: PageId;
  widgetId: WidgetId;
}[];

const HEADING_TAGS = [
  TextWidgetTag.H1,
  TextWidgetTag.H2,
  TextWidgetTag.H3,
  TextWidgetTag.H4,
  TextWidgetTag.H5,
  TextWidgetTag.H6,
];

const HEADING_TAG_TO_LEVEL_MAP = {
  [TextWidgetTag.H1]: 1,
  [TextWidgetTag.H2]: 2,
  [TextWidgetTag.H3]: 3,
  [TextWidgetTag.H4]: 4,
  [TextWidgetTag.H5]: 5,
  [TextWidgetTag.H6]: 6,
};

/**
 * Check each page in pageData for invalid heading order
 * It should check the order in the whole document level not each page basis.
 *
 * @param pageData
 * @returns
 */
export const checkHeadingOrder = (pageData: PageToWidgetsMap, allWidgets: WidgetsMap): InvalidWidgetList => {
  const invalidWidgets: InvalidWidgetList = [];
  // Last level from the previous page
  let lastLevel = 0;
  for (const pageId in pageData) {
    const widgets = pageData[pageId];
    const { invalidWidgets: invalidWidgetList, lastLevel: lastLevelInPrevPage } = checkWidgets(
      pageId,
      widgets,
      lastLevel,
      allWidgets,
    );

    lastLevel = lastLevelInPrevPage;
    invalidWidgets.push(...invalidWidgetList);
  }

  return invalidWidgets;
};

/**
 * Given an array of widgets, will check that text widgets with the heading tags
 * follow a hierarchical structure.
 *
 * Rules: Any heading tag must
 * - Have the same level as or lower level than the previous heading in the reading order OR
 * - Be exactly 1 level above the previous heading
 *
 * i.e.
 *  - H1 > H2 > H3 > H2 = valid
 *  - H1 > H2 > H3 > H5 - H5 is invalid
 *
 * @param widgets array of { widgetId: WidgetId, textTag: TextWidgetTag } to check
 * @returns InvalidWidgetList - array of widgets that do not pass the check
 */
export const checkWidgets = (
  pageId: PageId,
  widgets: WidgetTagData[],
  level: number = 0,
  allWidgets: WidgetsMap,
): { invalidWidgets: InvalidWidgetList; lastLevel: number } => {
  const invalidWidgets: { widgetId: WidgetId; pageId: PageId }[] = [];

  let lastLevel = level;
  widgets.forEach(({ widgetId, widgetData }) => {
    // Skip non-text widgets and text widgets that aren't headings
    const type = widgetId.substring(0, 3) as WidgetType;
    if (type !== WidgetType.Text && type !== WidgetType.ResponsiveText) {
      return;
    }

    // TODO - this information should be stored at the widget structure tree level
    let textWData = widgetData as TextWidgetData;
    let textWidgetId = widgetId;
    if (type === WidgetType.ResponsiveText) {
      const { componentWidgetIdMap } = widgetData as ResponsiveWidgetBaseData;
      textWidgetId = componentWidgetIdMap?.[ComponentWidgetIdKeys.Text];

      if (textWidgetId && allWidgets[textWidgetId]) {
        textWData = allWidgets[textWidgetId] as TextWidgetData;
      }
    }

    const { textTag } = textWData as TextWidgetData;
    if (!HEADING_TAGS.includes(textTag)) {
      return;
    }

    const currLevel = HEADING_TAG_TO_LEVEL_MAP[textTag as HeadingTag];
    if (currLevel > lastLevel && currLevel !== lastLevel + 1) {
      invalidWidgets.push({ widgetId: textWidgetId, pageId });
    }
    lastLevel = currLevel;
  });

  return {
    invalidWidgets,
    lastLevel,
  };
};
