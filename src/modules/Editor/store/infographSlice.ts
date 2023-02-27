import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import clonedeep from 'lodash.clonedeep';

import type { InfographState, Language, PageSize, Color } from 'types/infographTypes';
import type { PageId, WidgetId } from 'types/idTypes';
import type { AllWidgetData } from 'widgets/Widget.types';
import { generateWidgetId, getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { GroupWidgetData } from 'widgets/GroupWidget/GroupWidget.types';
import { generateDefaultData } from 'widgets/GroupWidget/GroupWidget.helpers';
import { Page } from 'types/pageTypes';
import {
  moveElementInArray,
  removeWidgetById,
  replaceInTree,
  duplicateNestedMemberWidgets,
  mergeWidgetData,
  addWidgetToState,
} from './infographSlice.helpers';
import { PageClipboard } from './pageControlSlice';
import { ActiveWidget } from './widgetControlSlice';
import { withHistoryReducer, undoActionRegistry } from './history';
import { WidgetDirection, AddWidget } from './infographSlice.types';
import { TreeNode } from 'types/structuredContentTypes';
import { PaperType } from 'types/paper.types';
import { Subset } from 'types/object.types';
import { MAXIMUM_PAGE_LIMIT } from '../Editor.config';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';

type UpdateWidget = { widgetId: WidgetId; widgetData: Subset<AllWidgetData> };

type ReplaceWidget = {
  widgetIdToReplace: WidgetId;
  newWidget: AddWidget;
};

// Define the initial state using that type
const initialState: InfographState = {
  id: '',
  title: '',
  size: {
    widthPx: 816,
    heightPx: 1056,
    paperType: PaperType.LETTER,
  },
  language: {
    iso639_1_Code: 'en',
    displayName: 'English',
  },
  colorSwatch: ['#fff', '#000'],
  pageOrder: [],
  pages: {},
  widgets: {},
};

const infographSlice = createSlice({
  name: 'infograph',
  initialState,
  reducers: {
    /**
     * Loads infograph. If one of the properties of InfographState is not given,
     * it'll set to initial value. (empty)
     * It also overides any existing property.
     *
     * Use this to load entire infograph data in one go.
     *
     * @param state
     * @param action
     */
    loadInfograph: (state, action: PayloadAction<Partial<InfographState>>) => {
      state.id = action.payload.id || initialState.id;
      state.title = action.payload.title || initialState.title;
      state.colorSwatch = action.payload.colorSwatch || initialState.colorSwatch;
      state.pageOrder = action.payload.pageOrder || initialState.pageOrder;
      state.pages = action.payload.pages || initialState.pages;
      state.widgets = action.payload.widgets || initialState.widgets;
      state.size = action.payload.size || initialState.size;
    },
    addWidget: (state, action: PayloadAction<AddWidget | AddWidget[]>) => {
      const widgetPayload = action.payload;
      if (Array.isArray(widgetPayload)) widgetPayload.forEach((widget) => addWidgetToState(state, widget));
      else addWidgetToState(state, widgetPayload);
    },
    // Replace an existing widget with new widget data. A new widget is created and the old one is discarded.
    replaceWidget: (state, action: PayloadAction<ReplaceWidget>) => {
      const { newWidget, widgetIdToReplace } = action.payload;
      const parentGroupId = groupIdCache.getParentId(widgetIdToReplace);
      const isGroupMember = !!parentGroupId;

      // add the new widget to the infograph
      addWidgetToState(state, newWidget, widgetIdToReplace, isGroupMember);

      // if the widget belongs to a group
      // update the group memberWidgetIds
      if (parentGroupId) {
        const groupWidgetData = state.widgets[parentGroupId] as GroupWidgetData;
        const newGroupMemberIds = groupWidgetData.memberWidgetIds.map((memberWidgetId) =>
          memberWidgetId === widgetIdToReplace ? newWidget.widgetId : memberWidgetId,
        );

        // update the group widget with the new memberWidgetIds
        (state.widgets[parentGroupId] as GroupWidgetData).memberWidgetIds = [...newGroupMemberIds];

        // update the groupIdCache for selection
        groupIdCache.remove(widgetIdToReplace);
        groupIdCache.add(
          newWidget.widgetId,
          parentGroupId,
          groupWidgetData.memberWidgetIds.indexOf(newWidget.widgetId),
        );
      }

      // remove the widget that was replaced
      removeWidgetById(widgetIdToReplace, state, newWidget.pageId);
    },
    unGroupWidget: (state, action: PayloadAction<{ widgetGroupId: WidgetId; pageId: PageId }>) => {
      const { widgetGroupId, pageId } = action.payload;
      const groupWidget = state.widgets[widgetGroupId];

      const { memberWidgetIds } = groupWidget as GroupWidgetData;
      const groupWidgetLayerIdx = state.pages[pageId].widgetLayerOrder.indexOf(widgetGroupId);

      // remove the group widget id from widgetLayerOrder
      state.pages[pageId].widgetLayerOrder.splice(groupWidgetLayerIdx, 1);
      // remove the group widget from widgets
      delete state.widgets[widgetGroupId];
      // add the groups member widgets back to the widgetLayerOrder - (at the position of where the group widget was)
      state.pages[pageId].widgetLayerOrder.splice(groupWidgetLayerIdx, 0, ...memberWidgetIds);
    },

    groupWidget: (
      state,
      action: PayloadAction<{ activeWidgets: ActiveWidget[]; widgetGroupId: WidgetId; pageId: PageId }>,
    ) => {
      const { activeWidgets, widgetGroupId, pageId } = action.payload;
      if (!activeWidgets.length) return;

      // sort the widgets that should be grouped by their current layer order
      const sortedActiveWidgets = [...activeWidgets].sort((a: ActiveWidget, b: ActiveWidget) => {
        const firstId = a.groupId || a.responsiveGroupId || a.id;
        const secondId = b.groupId || b.responsiveGroupId || b.id;

        const aIdx = state.pages[pageId].widgetLayerOrder.indexOf(firstId);
        const bIdx = state.pages[pageId].widgetLayerOrder.indexOf(secondId);

        return aIdx - bIdx;
      });

      const groupWidget = generateDefaultData().widgetData as GroupWidgetData;
      const oldGroupIdsToRemove: WidgetId[] = [];

      sortedActiveWidgets.forEach((widget: ActiveWidget) => {
        // Group widgets should have widget.groupId
        // Responsive group widgets should have widget.responsiveGroupId
        const isGroupWidget = !!widget.groupId;
        const isResponsiveGroupWidget = !!widget.responsiveGroupId;

        // group merge with group
        if (isGroupWidget) {
          const activeGroupWidget = state.widgets[widget.groupId] as GroupWidgetData;
          // add the group members to the new group
          groupWidget.memberWidgetIds.push(...activeGroupWidget.memberWidgetIds);
          // The old group id can now be removed
          oldGroupIdsToRemove.push(widget.groupId);
        } else if (isResponsiveGroupWidget) {
          groupWidget.memberWidgetIds.push(widget.responsiveGroupId);
        } else {
          groupWidget.memberWidgetIds.push(widget.id);
        }
      });

      // find the highest widget layer idx of the widgets that are being grouped
      // this will be the new layer idx of the group widget
      // this should be before the widgetLayerOrder is updated
      const highestWidgetLayer =
        sortedActiveWidgets[sortedActiveWidgets.length - 1].groupId ||
        sortedActiveWidgets[sortedActiveWidgets.length - 1].id;
      const highestWidgetLayerIdx = state.pages[pageId].widgetLayerOrder.indexOf(highestWidgetLayer);
      const widgetCountBefore = state.pages[pageId].widgetLayerOrder.length;

      // Remove group member widgets from the widgetLayerOrder
      state.pages[pageId].widgetLayerOrder = state.pages[pageId].widgetLayerOrder.filter((wId: WidgetId) => {
        if (groupWidget.memberWidgetIds.includes(wId)) return false;
        if (oldGroupIdsToRemove.includes(wId)) return false;
        return true;
      });

      // Add new group widget to widgets
      state.widgets[widgetGroupId] = groupWidget;

      // offset the highest layer idx by the number of widgets that were removed (excluding the group widget)
      const widgetCountAfter = state.pages[pageId].widgetLayerOrder.length;
      const newLayerIndex = highestWidgetLayerIdx - (widgetCountBefore - widgetCountAfter - 1);
      // Add new group widget to widgetLayerOrder
      state.pages[pageId].widgetLayerOrder.splice(newLayerIndex, 0, widgetGroupId);
    },
    removeWidget: (state, action: PayloadAction<{ pageId: PageId; widgetId?: WidgetId; widgetIds?: WidgetId[] }>) => {
      const { pageId, widgetId, widgetIds } = action.payload;

      if (widgetId) removeWidgetById(widgetId, state, pageId);
      if (widgetIds) widgetIds.forEach((widgetId: WidgetId) => removeWidgetById(widgetId, state, pageId));
    },
    updateWidget: (state, action: PayloadAction<UpdateWidget | UpdateWidget[]>) => {
      const updateWidgetPayload = action.payload;

      // update multiple widgets in one action
      if (Array.isArray(updateWidgetPayload)) {
        updateWidgetPayload.forEach((updateWidget: UpdateWidget) => {
          const { widgetId, widgetData } = updateWidget;
          const widget = state.widgets[widgetId];

          mergeWidgetData(widget, widgetData);
        });
        return;
      }

      const { widgetId, widgetData } = updateWidgetPayload;
      const widget = state.widgets[widgetId];
      if (!widget) return console.warn(`Widgeth ${widgetId} not found in widgets map!`);

      mergeWidgetData(widget, widgetData);
    },
    moveWidgetInLayer: (
      state,
      action: PayloadAction<{ pageId: PageId; widgetId: WidgetId; direction: WidgetDirection }>,
    ) => {
      const { pageId, widgetId, direction } = action.payload;
      const page = state.pages[pageId];

      if (!page) return console.warn(`Page not found - ${pageId}`);

      switch (direction) {
        case 'up':
          moveElementInArray<WidgetId>(page.widgetLayerOrder, widgetId, 'right');
          break;
        case 'down':
          moveElementInArray<WidgetId>(page.widgetLayerOrder, widgetId, 'left');
          break;
        case 'front':
          moveElementInArray<WidgetId>(page.widgetLayerOrder, widgetId, 'last');
          break;
        case 'back':
          moveElementInArray<WidgetId>(page.widgetLayerOrder, widgetId, 'first');
          break;
      }
    },
    updatePageBackground: (state, action: PayloadAction<{ color: string; pageId: PageId }>) => {
      const { color, pageId } = action.payload;
      state.pages[pageId].background = color;
    },
    addPage: (state, action: PayloadAction<{ newPageId: PageId; insertAfterId: PageId }>) => {
      if (state.pageOrder.length >= MAXIMUM_PAGE_LIMIT) return;

      const { newPageId, insertAfterId } = action.payload;

      const newBlankPage: Page = {
        widgetLayerOrder: [],
        widgetStructureTree: ['div', {}, []],
        background: state.pages[insertAfterId]?.background || '#fff',
      };

      state.pages[newPageId] = newBlankPage;

      // add the new page after insertAfterId
      const activePageIdIndex = state.pageOrder.findIndex((id) => id === insertAfterId);
      state.pageOrder.splice(activePageIdIndex + 1, 0, newPageId);
    },
    duplicatePage: (
      state,
      action: PayloadAction<{ newPageId: PageId; insertAfterId: PageId; pageClipboard: PageClipboard }>,
    ) => {
      if (state.pageOrder.length >= MAXIMUM_PAGE_LIMIT) return;

      const { newPageId, insertAfterId, pageClipboard } = action.payload;
      const { page: duplicatePage, widgets: duplicatePageWidgets } = pageClipboard;
      const { widgetLayerOrder, widgetStructureTree, background } = duplicatePage;

      const newWidgetStructureTree = clonedeep(widgetStructureTree);
      const newWidgetLayerOrder: WidgetId[] = [];

      widgetLayerOrder.forEach((wId: WidgetId) => {
        const newWidgetType = getWidgetTypeFromId(wId);
        const newWidgetId = generateWidgetId(newWidgetType);

        // For groups - all group member widgets will need to be duplicated as well
        const isGroup = duplicatePageWidgets[wId]?.hasOwnProperty('memberWidgetIds');
        const isResponsiveGroup = duplicatePageWidgets[wId]?.hasOwnProperty('componentWidgetIdMap');
        if (isGroup) {
          const groupWidget = duplicatePageWidgets[wId] as GroupWidgetData;
          const newGroupWidget: GroupWidgetData | ResponsiveWidgetBaseData = { ...groupWidget, memberWidgetIds: [] };
          const newGroupWidgetId = generateWidgetId(newWidgetType);

          if (isResponsiveGroup) {
            replaceInTree(newWidgetStructureTree, wId, newGroupWidgetId);
            (newGroupWidget as ResponsiveWidgetBaseData).componentWidgetIdMap = {};
          }

          duplicateNestedMemberWidgets(
            state,
            duplicatePageWidgets,
            newWidgetStructureTree,
            groupWidget.memberWidgetIds,
            newGroupWidget,
            wId,
            isResponsiveGroup,
          );

          newWidgetLayerOrder.push(newGroupWidgetId);
          state.widgets[newGroupWidgetId] = newGroupWidget;
        } else {
          // replace id in widgetStructureTree
          replaceInTree(newWidgetStructureTree, wId, newWidgetId);

          // add to widgetLayerOrder
          newWidgetLayerOrder.push(newWidgetId);

          // add to infograph widgets
          const newWidget = clonedeep(duplicatePageWidgets[wId]);
          state.widgets[newWidgetId] = newWidget;
        }
      });

      const newPage: Page = {
        background,
        widgetLayerOrder: newWidgetLayerOrder,
        widgetStructureTree: newWidgetStructureTree,
      };

      state.pages[newPageId] = newPage;
      const insertAfterIdIndex = state.pageOrder.findIndex((id) => id === insertAfterId);
      state.pageOrder.splice(insertAfterIdIndex + 1, 0, newPageId);
    },
    removePage: (state, action: PayloadAction<{ pageId: PageId }>) => {
      if (state.pageOrder.length === 1) return;

      const { pageId } = action.payload;
      const { widgetLayerOrder } = state.pages[pageId];

      widgetLayerOrder.forEach((widgetId: WidgetId) => removeWidgetById(widgetId, state, pageId));
      state.pageOrder = state.pageOrder.filter((id: PageId) => id !== pageId);
      delete state.pages[pageId];
    },
    setPageOrder: (state, action: PayloadAction<{ pageOrder: PageId[] }>) => {
      const { pageOrder } = action.payload;
      state.pageOrder = pageOrder;
    },
    setTitle: (state, action: PayloadAction<{ title: string }>) => {
      const { title } = action.payload;
      state.title = title;
    },
    setLanguage: (state, action: PayloadAction<{ language: Language }>) => {
      const { language } = action.payload;
      state.language = language;
    },
    setSwatchColor: (state, action: PayloadAction<{ swatchColor: Color }>) => {
      const { swatchColor } = action.payload;
      if (!state.colorSwatch) state.colorSwatch = [swatchColor];
      if (state.colorSwatch.includes(swatchColor)) return;

      state.colorSwatch.push(swatchColor);
    },
    removeSwatchColor: (state, action: PayloadAction<{ swatchColor: Color }>) => {
      const { swatchColor } = action.payload;
      if (!state.colorSwatch) return;

      state.colorSwatch = state.colorSwatch.filter((color: Color) => swatchColor !== color);
    },
    setPageStructureTree: (state, action: PayloadAction<{ pageId: PageId; structureTree: TreeNode }>) => {
      const { structureTree, pageId } = action.payload;
      state.pages[pageId].widgetStructureTree = structureTree;
    },
    setSize: (state, action: PayloadAction<{ size: Partial<PageSize> }>) => {
      const { size } = action.payload;
      state.size = { ...state.size, ...size };
    },
  },
});

const historyManagedInfographReducer = withHistoryReducer(infographSlice.reducer);

export const {
  loadInfograph,
  addWidget,
  replaceWidget,
  removeWidget,
  updateWidget,
  moveWidgetInLayer,
  setPageOrder,
  addPage,
  removePage,
  updatePageBackground,
  duplicatePage,
  setTitle,
  setLanguage,
  setSwatchColor,
  removeSwatchColor,
  setPageStructureTree,
  setSize,
  groupWidget,
  unGroupWidget,
} = infographSlice.actions;

// Register undoable actions
undoActionRegistry.add([
  addWidget.type,
  removeWidget.type,
  updateWidget.type,
  updatePageBackground.type,
  addPage.type,
  removePage.type,
  setPageOrder.type,
  duplicatePage.type,
  setTitle.type,
  setPageStructureTree.type,
  setSize.type,
  groupWidget.type,
  unGroupWidget.type,
  replaceWidget.type,
]);

export { historyManagedInfographReducer, initialState };
export type { AddWidget, UpdateWidget };
