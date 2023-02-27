import { JSONContent } from '@tiptap/core';

import { TextWidgetData } from '../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { PageId, WidgetId } from '../../../../../../types/idTypes';
import { PageToWidgetsMap } from '../../../../../../types/infographTypes';
import { WidgetType } from '../../../../../../types/widget.types';

import { MIN_ACCESSIBLE_FONT_SIZE } from './TextSizeChecker.config';
import { getWidgetTypeFromId } from '../../../../../../widgets/Widget.helpers';

/**
 * Recursively iterates through all child nodes to find all marks of specified type
 *
 * @param type - specified mark type
 * @param node - prosemirror node
 * @param marks - marks in node
 * @param filter - optional filter for specific node condition
 * @returns a list of all the marks in the specified node or any of its child nodes
 */
export const getMarksOfType = (
  type: string,
  node: JSONContent,
  marks: Array<JSONContent> = [],
  filter?: (node: JSONContent) => boolean,
): Array<JSONContent> => {
  if (node.content) {
    node.content.forEach((subNode) => getMarksOfType(type, subNode, marks, filter));
  } else if (node.marks) {
    // Condition node filter
    if (filter instanceof Function && !filter(node)) return marks;

    marks.push(...node.marks.filter((x) => x.type === type));
  }

  return marks;
};

/**
 * Iterates through all widgets to check their text size accessibility requirements
 *
 * @param pageToWidgetMap list of widgetIds with their corresponding pageIds
 * @returns list of widgets with invalid text sizes
 */
export const checkTextSize = (pageToWidgetMap: PageToWidgetsMap) => {
  const invalidWidgets: { pageId: PageId; widgetId: WidgetId }[] = [];
  const noEmptyTextNodeFilter = (node: JSONContent) => node.type === 'text' && !!node.text?.length;

  Object.entries(pageToWidgetMap).forEach(([pageId, pageWidgets]) => {
    const widgets = pageWidgets.filter(({ widgetId }) =>
      [WidgetType.Text, WidgetType.Table].includes(getWidgetTypeFromId(widgetId)),
    );

    widgets.forEach(({ widgetId, widgetData }) => {
      const { proseMirrorData } = widgetData as TextWidgetData;
      const marks = getMarksOfType('textStyle', proseMirrorData, [], noEmptyTextNodeFilter) as Array<JSONContent>;
      const fontSizes = marks.map((x) => (x.attrs ? parseInt(x.attrs.fontSize) : -1)).filter((x) => x !== -1);
      const minFontSize = Math.min(...fontSizes);

      if (minFontSize < MIN_ACCESSIBLE_FONT_SIZE) invalidWidgets.push({ pageId, widgetId });
    });
  });

  return invalidWidgets;
};
