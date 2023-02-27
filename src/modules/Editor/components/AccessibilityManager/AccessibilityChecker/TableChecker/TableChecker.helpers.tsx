import { JSONContent } from '@tiptap/core';
import { PageId, WidgetId } from '../../../../../../types/idTypes';
import { PageToWidgetsMap } from '../../../../../../types/infographTypes';
import { Widget, WidgetType } from '../../../../../../types/widget.types';
import { TableWidgetData } from '../../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.types';
import { AllWidgetData } from '../../../../../../widgets/Widget.types';
import { InvalidWidgetList } from '../../AccessibilityManager.types';
import { findAllPropertyValues } from '../../../../../../utils/findAllPropertyValues';
import { getWidgetTypeFromId } from '../../../../../../widgets/Widget.helpers';

type WidgetData = {
  widgetId: WidgetId;
  widgetData: Widget | AllWidgetData;
};

/**
 * Check each page in pageData for invalid heading
 *
 * @param pageData
 * @returns  An array of invalid widget
 */
const checkTableHeading = (pageData: PageToWidgetsMap): InvalidWidgetList => {
  const invalidWidgets: InvalidWidgetList = [];

  for (const pageId in pageData) {
    const widgets = pageData[pageId];
    invalidWidgets.push(...checkWidgets(pageId, widgets));
  }

  return invalidWidgets;
};

/**
 * In table beta release-22.38.0, we will flag all table widgets as invalid
 * regardless of if they have any header applied
 *
 * @see trello card https://trello.com/c/OWTMG76U/12128-add-table-heading-accessibility-checker
 *
 * @param widgets array of { widgetId: WidgetId, textTag: TextWidgetTag } to check
 * @returns InvalidWidgetList - array of widgets that do not pass the check
 */
const checkWidgets = (pageId: PageId, widgets: WidgetData[]): InvalidWidgetList => {
  const invalidWidgets: InvalidWidgetList = [];

  widgets.forEach(({ widgetId }) => {
    // Skip non-table widgets
    if (getWidgetTypeFromId(widgetId) !== WidgetType.Table) return;

    invalidWidgets.push({ widgetId, pageId });
  });

  return invalidWidgets;
};

/**
 * Check whether the design has one or more table widgets
 *
 * @param pageData
 */
const hasTables = (pageData: PageToWidgetsMap): boolean => {
  return Object.values(pageData).some((widgets) => {
    return widgets.some(({ widgetId }) => getWidgetTypeFromId(widgetId) === WidgetType.Table);
  });
};

/**
 * Check table widget whether has non empty header
 *
 * @param widgetData
 * @returns
 */
const checkTableWidgetHeading = (widgetData: TableWidgetData): boolean => {
  const tableJson = (widgetData.proseMirrorData as JSONContent)?.content?.[0];

  if (tableJson?.type !== 'table' || !tableJson?.content?.length) return false;

  const isEmptyHeaderCell = (cell?: JSONContent): boolean => {
    if (cell?.type !== 'tableHeader') return true;
    const text = findAllPropertyValues(cell, ['text']).pop?.();
    return !text?.toString()?.length;
  };

  /**
   * Interate table first row and first column, check whether table has at least one
   * non empty row or col header cell
   */
  return !!tableJson?.content?.some((row, rIndex) => {
    if (row?.type !== 'tableRow') return false;

    if (rIndex === 0) {
      // check first row whether has non empty header cell
      return !!row?.content?.some((col) => !isEmptyHeaderCell(col));
    } else {
      // check first column whether has non empty header cell
      return !isEmptyHeaderCell(row?.content?.[0]);
    }
  });
};

export { checkTableWidgetHeading, checkTableHeading, hasTables };
