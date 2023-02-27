import { WidgetId } from 'types/idTypes';
import { WidgetType, Widget } from 'types/widget.types';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';
import { WidgetMap } from 'widgets/Widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { ActiveWidget } from './widgetControlSlice';

export const getNextResponsiveWidgetMember = (memberWidgetIds: WidgetId[], widgets: WidgetMap, activeId: WidgetId) => {
  let nextId;
  let startIndex = memberWidgetIds.findIndex((wId: WidgetId) => wId === activeId);
  let i = startIndex + 1;

  // in case the active widget is hidden, we need to loop through the member widgets until we find the next non-hidden widget
  while (nextId === undefined) {
    const nextWidgetId = memberWidgetIds[i];
    let nextWidget = widgets[nextWidgetId] as Widget;

    if (!nextWidget) i = 0;
    if (nextWidget && !nextWidget.isHidden) nextId = nextWidgetId;
    if (nextWidget && nextWidget.isHidden) i++;
    if (i === startIndex) nextId = activeId;
  }

  return nextId;
};

const getPreviousResponsiveWidgetMember = (memberWidgetIds: WidgetId[], widgets: WidgetMap, activeId: WidgetId) => {
  let nextId;
  let startIndex = memberWidgetIds.findIndex((wId: WidgetId) => wId === activeId);
  let i = startIndex - 1;

  // in case the active widget is hidden, we need to loop through the member widgets until we find the next non-hidden widget
  while (nextId === undefined) {
    const nextWidgetId = memberWidgetIds[i];
    let nextWidget = widgets[nextWidgetId] as Widget;

    if (!nextWidget) i = memberWidgetIds.length - 1;
    if (nextWidget && !nextWidget.isHidden) nextId = nextWidgetId;
    if (nextWidget && nextWidget.isHidden) i--;
    if (i === startIndex) nextId = activeId;
  }

  return nextId;
};

const getNextGroupMember = (activeWidgets: ActiveWidget[], widgets: WidgetMap, activeId: WidgetId) => {
  const { groupMembers } = activeWidgets[0];
  const activeIdx = groupMembers.findIndex((wId: WidgetId) => wId === activeId);
  const nextIdx = activeIdx + 1;

  if (groupMembers[nextIdx]) return groupMembers[nextIdx];
  return groupMembers[0];
};

const getPreviousGroupMember = (activeWidgets: ActiveWidget[], widgets: WidgetMap, activeId: WidgetId) => {
  const { groupMembers } = activeWidgets[0];
  const activeIdx = groupMembers.findIndex((wId: WidgetId) => wId === activeId);
  const nextIdx = activeIdx - 1;

  if (groupMembers[nextIdx]) return groupMembers[nextIdx];

  return groupMembers[groupMembers.length - 1];
};

export const getNextActiveWidget = (
  widgetOrder: WidgetId[],
  activeWidgets: ActiveWidget[],
  widgets: WidgetMap,
): WidgetId | undefined => {
  if (!widgetOrder.length) return;
  if (activeWidgets.length > 1) return;
  if (activeWidgets.length === 0) return widgetOrder[0];

  const responsiveGroupId = activeWidgets[0].responsiveGroupId;
  const groupId = activeWidgets[0].groupId;
  const activeId = activeWidgets[0].id;

  // get the next responsive widget member
  const isResponsiveWidgetMember = responsiveGroupId && activeId !== responsiveGroupId;
  if (isResponsiveWidgetMember) {
    // For responsive widgets, need to get the member widget ids of the parent - these are not stored in the activeWidget group members
    const responsiveWidgetBase = widgets[activeWidgets[0].responsiveGroupId] as ResponsiveWidgetBaseData;
    const { memberWidgetIds } = responsiveWidgetBase;
    return getNextResponsiveWidgetMember(memberWidgetIds, widgets, activeId);
  }

  // get the next group widget member
  const isResponsiveWidgetBase = responsiveGroupId === activeId;
  const isResponsiveWidgetInGroup = activeId === responsiveGroupId && !!groupId;
  const isGroupMember =
    activeWidgets.length === 1 &&
    !!activeWidgets[0].groupMembers.length &&
    getWidgetTypeFromId(activeId) !== WidgetType.Group &&
    (!isResponsiveWidgetBase || isResponsiveWidgetInGroup);

  if (isGroupMember) return getNextGroupMember(activeWidgets, widgets, activeId);

  // get the next widget in the widget order
  const activeIdx = widgetOrder.findIndex((wId: WidgetId) => wId === activeId);
  const nextIdx = activeIdx + 1;

  if (widgetOrder[nextIdx]) return widgetOrder[nextIdx];
  return widgetOrder[0];
};

// TODO: add massive amounts of tests
export const getPreviousActiveWidget = (
  widgetList: WidgetId[],
  activeWidgets: ActiveWidget[],
  widgets: WidgetMap,
): WidgetId | undefined => {
  if (!widgetList.length) return;
  if (activeWidgets.length > 1) return;
  if (activeWidgets.length === 0) return widgetList[0];

  const responsiveGroupId = activeWidgets[0].responsiveGroupId;
  const groupId = activeWidgets[0].groupId;
  const activeId = activeWidgets[0].id;

  // get the previous responsive widget member
  const isResponsiveWidgetMember = responsiveGroupId && activeId !== responsiveGroupId;
  if (isResponsiveWidgetMember) {
    // For responsive widgets, need to get the member widget ids of the parent - these are not stored in the activeWidget group members
    const responsiveWidgetBase = widgets[activeWidgets[0].responsiveGroupId] as ResponsiveWidgetBaseData;
    const { memberWidgetIds } = responsiveWidgetBase;
    return getPreviousResponsiveWidgetMember(memberWidgetIds, widgets, activeId);
  }

  // get the previous group widget member
  const isResponsiveWidgetBase = responsiveGroupId === activeId;
  const isResponsiveWidgetInGroup = activeId === responsiveGroupId && !!groupId;
  const isGroupMember =
    activeWidgets.length === 1 &&
    !!activeWidgets[0].groupMembers.length &&
    getWidgetTypeFromId(activeId) !== WidgetType.Group &&
    (!isResponsiveWidgetBase || isResponsiveWidgetInGroup);
  if (isGroupMember) return getPreviousGroupMember(activeWidgets, widgets, activeId);

  // get the previous widget in the widget order
  const activeIdx = widgetList.findIndex((wId: WidgetId) => wId === activeId);
  const nextIdx = activeIdx - 1;

  if (widgetList[nextIdx]) return widgetList[nextIdx];
  return widgetList[widgetList.length - 1];
};
