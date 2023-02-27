import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { WidgetId, PageId } from 'types/idTypes';
import { WidgetsMap } from 'types/infographTypes';
import { WidgetType } from 'types/widget.types';
import { AllWidgetData, AllWidgetUIControl } from 'widgets/Widget.types';
import { GroupWidgetData } from 'widgets/GroupWidget/GroupWidget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';

export type ActiveWidgetIds = WidgetId[];
export type ActiveWidget = {
  id: WidgetId;
  groupId: WidgetId;
  responsiveGroupId: WidgetId;
  groupMembers: WidgetId[];
};
export type ActiveWidgets = ActiveWidget[];

export type ClipboardGroupWidget = {
  widgetType: WidgetType;
  widgetData: AllWidgetData;

  // Nested group members
  // For the case where there is a responsive widget in a group
  groupMembers?: ClipboardGroupWidget[];

  // Component key to set for responsive widgets
  // Used in the componentWidgetIdMap
  componentKey?: string;
};

export type ClipboardWidget = {
  widgetData: AllWidgetData;
  widgetType: WidgetType;
  fromPageId: PageId;
  groupWidgets: ClipboardGroupWidget[];
  isResponsiveGroup?: boolean;
};

export type WidgetClipboard = ClipboardWidget[];

export interface WidgetControlState {
  // includes all widget ids (including all ids belonging to groups)
  activeWidgetIds: ActiveWidgetIds;
  activeWidgets: ActiveWidget[];
  activeWidgetToolbarState?: AllWidgetUIControl;
  widgetClipboard: WidgetClipboard;
  // set this to view a widget in crop view (the widget is rendered on top of all other widgets with a overlay)
  cropId: string;
  taggedWidgetTypes: WidgetType[];
  // set this to true to scroll to the active widget
  shouldScrollToWidget: boolean;
}

export const initialState: WidgetControlState = {
  activeWidgets: [],
  activeWidgetIds: [],
  activeWidgetToolbarState: undefined, // Non serializable {state, setState, focus}
  widgetClipboard: [],
  cropId: '',
  taggedWidgetTypes: [],
  shouldScrollToWidget: false,
};

export const widgetControl = createSlice({
  name: 'widgetControl',
  initialState,
  reducers: {
    /**
     * Use for controlling widget toolbar
     * @param state
     * @param action
     */
    setActiveWidgetToolbarState: (state, action: PayloadAction<AllWidgetUIControl>) => {
      if (action.payload) {
        state.activeWidgetToolbarState = action.payload;
      }
    },

    setActiveWidgetIds: (
      state,
      action: PayloadAction<{ widgetIds: WidgetId[] | WidgetId; widgets: WidgetsMap; shouldScrollToWidget?: boolean }>,
    ) => {
      const { widgetIds, widgets, shouldScrollToWidget = false } = action.payload;
      let widgetIdList = Array.isArray(widgetIds) ? widgetIds : [widgetIds];

      // Locked widget can only be selected by themselves - not as a part of multiple selection
      const isMultipleSelect = widgetIdList.length > 1;
      if (isMultipleSelect) widgetIdList = widgetIdList.filter((id) => !widgets[id]?.isLocked);

      let activeWidgets: ActiveWidget[] = [];
      const allWidgetIds: WidgetId[] = [];

      const selectedMap: { [widgetId: WidgetId]: boolean } = {};
      for (const widgetId of widgetIdList) {
        if (selectedMap[widgetId]) continue;

        // When a parent widget with memberWidgetIds is first being added to the canvas (duplicate group, or add responsive widget),
        // they are not yet added to the groupIdCache. Should select parent widget.
        const parentId =
          groupIdCache.getParentIdNested(widgetId) ||
          (widgets[widgetId]?.hasOwnProperty('memberWidgetIds') ? widgetId : '');

        if (!parentId) {
          selectedMap[widgetId] = true;
          allWidgetIds.push(widgetId);
          activeWidgets.push({ id: widgetId, groupId: '', responsiveGroupId: '', groupMembers: [] });
          continue;
        }

        selectedMap[parentId] = true;
        allWidgetIds.push(parentId);

        // Recursive fn to get all nested member widgets
        // For now, there can only be one level of nesting when there is a Responsive Widget in a group
        const getAllNestedMemberWidgetIds = (memberWidgetIds: WidgetId[]) => {
          memberWidgetIds.forEach((id) => {
            allWidgetIds.push(id);
            selectedMap[id] = true;

            const memberWidget = widgets[id];
            if (memberWidget?.hasOwnProperty('memberWidgetIds')) {
              getAllNestedMemberWidgetIds((memberWidget as GroupWidgetData).memberWidgetIds);
            }
          });
        };

        const memberWidgetIds = (widgets[parentId] as GroupWidgetData).memberWidgetIds;
        getAllNestedMemberWidgetIds(memberWidgetIds);

        // Set the groupId and responsiveGroupId for the active widget
        // Widgets that belong to a group will have groupId set
        // Widgets that belong to a responsive group will have responsiveGroupId set
        // For nested groups (i.e. group that contains a responsive widget) it is possible to have both ids set
        // responsiveGroupId = immediate parent id, groupId = parent's group id
        const activeWidget = { id: widgetId, groupMembers: memberWidgetIds, groupId: '', responsiveGroupId: '' };
        const immediateParentId = groupIdCache.getParentId(widgetId) || parentId;
        const isGroupMember = getWidgetTypeFromId(parentId) === WidgetType.Group;
        const isResponsiveGroupMember =
          getWidgetTypeFromId(parentId) !== WidgetType.Group ||
          (!!immediateParentId && getWidgetTypeFromId(immediateParentId) !== WidgetType.Group);

        if (isGroupMember) {
          activeWidget.groupId = parentId;
        }

        if (isResponsiveGroupMember && !!immediateParentId) {
          activeWidget.responsiveGroupId = immediateParentId;
        }

        if (groupIdCache.isResponsiveWidgetBase(widgetId)) {
          activeWidget.responsiveGroupId = widgetId;
        }

        activeWidgets.push(activeWidget);
      }

      // If there weren't any widgets selected previously and a member of a Responsive widget was selected.
      // Select the parent responsive widget first.
      if (
        activeWidgets.length === 1 &&
        !!activeWidgets[0]?.responsiveGroupId &&
        activeWidgets[0].responsiveGroupId !== state.activeWidgets?.[0]?.responsiveGroupId
      ) {
        activeWidgets = [
          {
            id: activeWidgets[0].responsiveGroupId,
            groupId: activeWidgets[0].groupId,
            responsiveGroupId: activeWidgets[0].responsiveGroupId,
            groupMembers: activeWidgets[0].groupMembers,
          },
        ];
      }

      state.activeWidgetIds = allWidgetIds;
      state.activeWidgets = activeWidgets;
      state.shouldScrollToWidget = shouldScrollToWidget;
    },
    addToWidgetClipboard: (state, action: PayloadAction<WidgetClipboard>) => {
      state.widgetClipboard = action.payload;
    },
    setCropId: (state, action: PayloadAction<string>) => {
      state.cropId = action.payload;
    },
    setTaggedWidgetTypes: (state, action: PayloadAction<WidgetType[]>) => {
      state.taggedWidgetTypes = action.payload;
    },
  },
});

export const {
  setActiveWidgetIds,
  setActiveWidgetToolbarState,
  addToWidgetClipboard,
  setCropId,
  setTaggedWidgetTypes,
} = widgetControl.actions;

export default widgetControl.reducer;
