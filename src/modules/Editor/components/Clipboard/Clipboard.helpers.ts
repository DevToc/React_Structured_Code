import clonedeep from 'lodash.clonedeep';

import { AllWidgetData, WidgetMap, NewWidget } from 'widgets/Widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { GroupWidgetData } from 'widgets/GroupWidget/GroupWidget.types';
import { WidgetClipboard, ActiveWidget, ClipboardWidget, ClipboardGroupWidget } from '../../store/widgetControlSlice';
import { WidgetId, PageId } from 'types/idTypes';
import { Page } from 'types/pageTypes';
import { COPY_OFFSET_POSITION } from './Clipboard.config';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';

export const clearBrowserClipboard = () => navigator?.clipboard?.writeText('');

export const shiftWidgetPosition = (widgetData: AllWidgetData) => {
  const newWidgetData = clonedeep(widgetData);

  newWidgetData.topPx = widgetData.topPx + COPY_OFFSET_POSITION;
  newWidgetData.leftPx = widgetData.leftPx + COPY_OFFSET_POSITION;

  return newWidgetData;
};

/**
 * Recursive fn to get all group widgets to copy.
 * For groups with responsive widgets, will get the nested member widget ids.
 *
 * Used in createCopyWidgets
 *
 * @param memberWidgetIds member ids of group
 * @param parentId parent id
 * @param isResponsiveGroup True if it is a responsive widget, if true, will set the appropriate componentKey for the groupCopyWidget
 * @param widgets
 * @returns
 */
export const getClipboardGroupWidgets = (
  memberWidgetIds: WidgetId[],
  parentId: WidgetId,
  isResponsiveGroup: boolean,
  widgets: WidgetMap,
): ClipboardGroupWidget[] => {
  let groupWidgets: ClipboardGroupWidget[] = [];
  memberWidgetIds.forEach((memberId: WidgetId) => {
    const widgetData = widgets[memberId] as AllWidgetData;
    const widgetType = getWidgetTypeFromId(memberId);

    let componentKey: string | undefined = undefined;
    if (isResponsiveGroup) {
      const responsiveWData = widgets[parentId] as ResponsiveWidgetBaseData;
      const { componentWidgetIdMap } = responsiveWData;

      componentKey = Object.keys(componentWidgetIdMap).find((key) => componentWidgetIdMap[key] === memberId);
    }

    // Handle the case where a group widget contains a responsive widget with their own respective memberWidgetIds
    let nestedGroupMembers: ClipboardGroupWidget[] = [];
    if (widgetData.hasOwnProperty('memberWidgetIds')) {
      nestedGroupMembers = getClipboardGroupWidgets(
        (widgetData as ResponsiveWidgetBaseData).memberWidgetIds,
        memberId,
        true,
        widgets,
      );
    }

    groupWidgets.push({
      widgetType,
      widgetData,
      ...(componentKey && { componentKey }),
      ...(nestedGroupMembers.length > 0 && { groupMembers: nestedGroupMembers }),
    });
  });

  return groupWidgets;
};

export const createCopyWidgets = (activeWidgets: ActiveWidget[], widgets: WidgetMap, activePageId: PageId) => {
  const copiedWidgets: WidgetClipboard = [];

  activeWidgets.forEach((activeWidget: ActiveWidget) => {
    const { id, groupMembers, groupId, responsiveGroupId } = activeWidget;
    const isGroup = !!groupId && !!groupMembers.length;
    const isResponsiveGroup = !groupId && !!responsiveGroupId && !!groupMembers.length;

    const widgetData = widgets[id] as AllWidgetData;

    const parentId = groupId || responsiveGroupId;

    // copy the group widgets + all the widgets in the group
    if (isGroup || isResponsiveGroup) {
      const groupCopyWidget: ClipboardWidget = {
        widgetType: getWidgetTypeFromId(parentId),
        widgetData: widgets[parentId] as AllWidgetData,
        fromPageId: activePageId,
        groupWidgets: [],
        isResponsiveGroup,
      };

      groupCopyWidget.groupWidgets = getClipboardGroupWidgets(groupMembers, parentId, isResponsiveGroup, widgets);

      copiedWidgets.push(groupCopyWidget);
    } else {
      const widgetType = getWidgetTypeFromId(id);
      copiedWidgets.push({ widgetType, widgetData, fromPageId: activePageId, groupWidgets: [] });
    }
  });

  return copiedWidgets;
};

/**
 * Recursive fn to generate new group widgets to pass to addWidget action.
 * Handles case where there are nested member widgets for groups that have a responsive widget
 *
 * Used in parseCopyWidgets
 */
const generateNewGroupWidgets = (groupWidgets: ClipboardGroupWidget[], isSamePage: boolean): NewWidget[] => {
  const newGroupWidgets: NewWidget[] = groupWidgets.map((groupWidget) => {
    const { widgetData, widgetType, componentKey, groupMembers } = groupWidget;
    const newWidgetData = isSamePage ? shiftWidgetPosition(widgetData) : widgetData;

    let nestedGroupWidgets: NewWidget[] = [];
    if (groupMembers && groupMembers.length > 0) {
      nestedGroupWidgets = generateNewGroupWidgets(groupMembers, isSamePage);
    }

    return { widgetType, widgetData: newWidgetData, componentKey, groupWidgets: nestedGroupWidgets };
  });

  return newGroupWidgets;
};

export const parseCopyWidgets = (widgetClipboard: WidgetClipboard, activePageId: PageId) => {
  const widgets: NewWidget[] = widgetClipboard.map((clipboardWidget) => {
    const { widgetType, widgetData, fromPageId, isResponsiveGroup } = clipboardWidget;

    const isSamePage = fromPageId === activePageId;
    const { groupWidgets } = clipboardWidget;

    // for groups: shift position of all group member widgets
    if (groupWidgets && groupWidgets.length) {
      const newGroupWidgets = generateNewGroupWidgets(groupWidgets, isSamePage);

      return {
        widgetType,
        widgetData: isResponsiveGroup ? shiftWidgetPosition(widgetData) : widgetData,
        groupWidgets: newGroupWidgets,
        isResponsiveGroup,
      };
    }

    const widget = isSamePage
      ? { widgetType, widgetData: shiftWidgetPosition(widgetData) }
      : { widgetType, widgetData };

    return widget;
  });

  return widgets;
};

/**
 * Recursive fn to copy member widgets in a page
 * Handles cases for nested widgets
 *
 * @param memberWidgetIds
 * @param widgets
 * @param copiedPageWidgets copiedWidgets - is updated directly with the new copied widgets
 */
const copyAllMemberWidgets = (memberWidgetIds: WidgetId[], widgets: WidgetMap, copiedPageWidgets: WidgetMap) => {
  memberWidgetIds.forEach((memberWidgetId: WidgetId) => {
    const copiedMemberWidget = clonedeep(widgets[memberWidgetId]);
    copiedPageWidgets[memberWidgetId] = copiedMemberWidget;

    if (copiedMemberWidget.hasOwnProperty('memberWidgetIds')) {
      copyAllMemberWidgets((copiedMemberWidget as GroupWidgetData).memberWidgetIds, widgets, copiedPageWidgets);
    }
  });
};

export const createCopyPage = (activePage: Page, widgets: WidgetMap) => {
  const copiedPage = clonedeep(activePage);

  const { widgetLayerOrder } = copiedPage;
  const copiedPageWidgets: WidgetMap = {};

  // copy the pages widgets (can paste the page even if the source page for the copy has been deleted)
  widgetLayerOrder.forEach((wId: WidgetId) => {
    const copiedWidget = clonedeep(widgets[wId]);
    copiedPageWidgets[wId] = copiedWidget;

    // copy the group widgets + all the widgets in the group
    const hasMemberWidgets = widgets[wId]?.hasOwnProperty('memberWidgetIds');
    if (hasMemberWidgets) {
      const { memberWidgetIds } = copiedWidget as GroupWidgetData;
      copyAllMemberWidgets(memberWidgetIds, widgets, copiedPageWidgets);
    }
  });

  // store in clipboard
  return [{ page: copiedPage, widgets: copiedPageWidgets }];
};
