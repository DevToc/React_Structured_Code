import { configureStore, combineReducers, createAction, AnyAction } from '@reduxjs/toolkit';
import produce from 'immer';

import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { NewWidget } from 'widgets/Widget.types';
import { generateWidgetId } from 'widgets/Widget.helpers';
import { InfographState } from 'types/infographTypes';
import { PageId, WidgetId } from 'types/idTypes';
import { WidgetType } from 'types/widget.types';
import {
  initialState as infogInitialState,
  addWidget,
  replaceWidget,
  groupWidget,
  unGroupWidget,
  addPage,
  historyManagedInfographReducer,
  duplicatePage as infographDuplicatePage,
  AddWidget,
} from './infographSlice';
import widgetControlReducer, {
  WidgetControlState,
  initialState as widgetInitialState,
  setActiveWidgetIds,
  setActiveWidgetToolbarState,
} from './widgetControlSlice';
import pageControlReducer, {
  PageControlState,
  PageClipboard,
  initialState as pageInitialState,
  generatePageId,
  setActivePageId,
  switchPage,
} from './pageControlSlice';
import editorSettingsReducer, {
  EditorSettingsState,
  initialState as editorSettingsInitialState,
} from './editorSettingsSlice';
import { parseWidgetData } from './store.helpers';
import { getNextActiveWidget, getPreviousActiveWidget } from './widgetControlSlice.helpers';
import { PageDirection } from './pageControlSlice.types';

const combinedReducer = combineReducers({
  infograph: historyManagedInfographReducer,
  widgetControl: widgetControlReducer,
  pageControl: pageControlReducer,
  editorSettings: editorSettingsReducer,
});

export const addNewWidget = createAction<NewWidget | NewWidget[]>('global/addNewWidget');

// Deletes existing widgetId and creates a new widget
export const addNewWidgetAndReplaceExisting = createAction<{ widgetId: WidgetId; newWidgetData: NewWidget }>(
  'global/replaceWidget',
);
export const addNewPage = createAction<{ insertAfterId: PageId }>('global/addNewPage');
export const duplicatePage = createAction<{ insertAfterId: PageId; pageClipboard: PageClipboard }>(
  'global/duplicatePage',
);

export const groupSelectedWidgets = createAction<{}>('global/groupSelectedWidgets');
export const unGroupSelectedWidgets = createAction<{}>('global/unGroupSelectedWidgets');
export const setActiveWidget = createAction<
  WidgetId[] | WidgetId | { allPageWidgets?: boolean; shouldScrollToWidget?: boolean; widgetId?: WidgetId }
>('global/setActiveWidget');
export const setNextActiveWidget = createAction('global/setNextActiveWidget');
export const setPreviousActiveWidget = createAction('global/setPreviousActiveWidget');
export const setActivePage = createAction<{ pageId?: PageId; direction?: PageDirection; pageNumber?: number }>(
  'global/setActivePage',
);

type GlobalState = {
  infograph: InfographState;
  widgetControl: WidgetControlState;
  pageControl: PageControlState;
  editorSettings: EditorSettingsState;
};

function crossSliceReducer(
  state: GlobalState = {
    infograph: infogInitialState,
    widgetControl: widgetInitialState,
    pageControl: pageInitialState,
    editorSettings: editorSettingsInitialState,
  },
  action: AnyAction,
) {
  switch (action.type) {
    case addNewWidget.toString(): {
      const pageId = state.pageControl.activePageId;
      if (!pageId) return state;

      const newWidgetData = action.payload;
      const [newWidgetId, newWidget] = parseWidgetData(newWidgetData, pageId);
      const infoState = historyManagedInfographReducer(state.infograph, addWidget(newWidget));
      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds: newWidgetId, widgets: infoState.widgets }),
      );

      // may be not needed if this simple
      return produce(state, (state) => {
        // Set active
        state.infograph = infoState;
        state.widgetControl = widgetControlState;
      });
    }
    case addNewWidgetAndReplaceExisting.toString(): {
      const pageId = state.pageControl.activePageId;
      if (!pageId) return state;

      const { newWidgetData, widgetId: existingWidgetId } = action.payload;
      const [newWidgetId, newWidget] = parseWidgetData(newWidgetData, pageId);

      const infoState = historyManagedInfographReducer(
        state.infograph,
        replaceWidget({
          widgetIdToReplace: existingWidgetId,
          newWidget: newWidget as AddWidget, // Support for single result for now.
        }),
      );

      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds: newWidgetId, widgets: infoState.widgets }),
      );

      // may be not needed if this simple
      return produce(state, (state) => {
        // Set active
        state.infograph = infoState;
        state.widgetControl = widgetControlState;
      });
    }
    case groupSelectedWidgets.toString(): {
      const activeWidgets = action.payload;

      const pageId = state.pageControl.activePageId;
      if (!pageId) return state;

      const widgetGroupId = generateWidgetId(WidgetType.Group);
      const infoState = historyManagedInfographReducer(
        state.infograph,
        groupWidget({ activeWidgets, widgetGroupId, pageId }),
      );

      const newGroupWidget = infoState.widgets[widgetGroupId];
      groupIdCache.add(widgetGroupId, widgetGroupId, -1);
      newGroupWidget.memberWidgetIds.forEach((id: WidgetId, idx: number) => {
        groupIdCache.add(id, widgetGroupId, idx, {
          isResponsiveWidgetBase: groupIdCache.isResponsiveWidgetBase(id),
        });
      });

      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({
          widgetIds: newGroupWidget.memberWidgetIds[0] || widgetGroupId,
          widgets: infoState.widgets,
        }),
      );

      return produce(state, (state) => {
        state.infograph = infoState;
        state.widgetControl = widgetControlState;
      });
    }
    case unGroupSelectedWidgets.toString(): {
      const widgetGroupId = action.payload;

      const pageId = state.pageControl.activePageId;
      if (!pageId) return state;

      const removedGroupWidget = state.infograph.widgets[widgetGroupId] as any;
      const { memberWidgetIds } = removedGroupWidget;
      const infoState = historyManagedInfographReducer(state.infograph, unGroupWidget({ widgetGroupId, pageId }));

      groupIdCache.remove(widgetGroupId);
      removedGroupWidget.memberWidgetIds.forEach((id: WidgetId) => {
        // For responsive widgets, need to remove widget from cache and add it back
        // since it is a parent widget
        if (groupIdCache.isResponsiveWidgetBase(id)) {
          groupIdCache.remove(id);
          groupIdCache.add(id, id, -1, { isResponsiveWidgetBase: true });
        } else {
          groupIdCache.remove(id);
        }
      });

      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds: memberWidgetIds, widgets: state.infograph.widgets }),
      );

      return produce(state, (state) => {
        // Set active
        state.infograph = infoState;
        state.widgetControl = widgetControlState;
      });
    }
    case setActivePage.toString(): {
      const { pageId, direction, pageNumber } = action.payload;
      if (!pageId && !direction) return state;

      // reset active widget when the page changes
      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds: [], widgets: state.infograph.widgets }),
      );

      let pageState: PageControlState;
      if (pageId) pageState = pageControlReducer(state.pageControl, setActivePageId(pageId));
      else if (direction) {
        const pageOrder = state.infograph.pageOrder;
        pageState = pageControlReducer(state.pageControl, switchPage({ direction, pageOrder, pageNumber }));
      }

      return produce(state, (state) => {
        // Set active
        state.widgetControl = widgetControlState;
        state.pageControl = pageState;
      });
    }
    case addNewPage.toString(): {
      const { insertAfterId } = action.payload;

      const newPageId = generatePageId();
      const infoState = historyManagedInfographReducer(state.infograph, addPage({ newPageId, insertAfterId }));

      // Set the page as active
      const pageState = pageControlReducer(state.pageControl, setActivePageId(newPageId));

      // reset the active widgets
      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds: [], widgets: state.infograph.widgets }),
      );

      return produce(state, (state) => {
        state.infograph = infoState;
        state.pageControl = pageState;
        state.widgetControl = widgetControlState;
      });
    }
    case duplicatePage.toString(): {
      const { insertAfterId, pageClipboard } = action.payload;
      const newPageId = generatePageId();

      const infoState = historyManagedInfographReducer(
        state.infograph,
        infographDuplicatePage({ newPageId, insertAfterId, pageClipboard }),
      );

      // Set the page as active
      const pageState = pageControlReducer(state.pageControl, setActivePageId(newPageId));

      // reset the active widgets
      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds: [], widgets: state.infograph.widgets }),
      );

      return produce(state, (state) => {
        state.infograph = infoState;
        state.pageControl = pageState;
        state.widgetControl = widgetControlState;
      });
    }
    case setActiveWidget.toString(): {
      const setActiveWidget = action.payload;
      const pageId = state.pageControl.activePageId;
      const widgetLayerOrder = state.infograph.pages[pageId]?.widgetLayerOrder || [];
      const shouldScrollToWidget = !!setActiveWidget?.shouldScrollToWidget;

      let widgetIds = typeof setActiveWidget === 'string' || Array.isArray(setActiveWidget) ? setActiveWidget : [];
      if (setActiveWidget.allPageWidgets) widgetIds = widgetLayerOrder;
      else if (setActiveWidget.widgetId) widgetIds = setActiveWidget.widgetId;

      // can check redundant operations here too e.g. empty widgetIds & empty active widget do nothing
      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({ widgetIds, widgets: state.infograph.widgets, shouldScrollToWidget }),
      );

      return produce(state, (state) => {
        state.widgetControl = widgetControlState;
      });
    }
    case setNextActiveWidget.toString(): {
      const pageId = state.pageControl.activePageId;
      if (!pageId) return state;

      const widgetLayerOrder = state.infograph.pages[pageId]?.widgetLayerOrder || [];
      const activeWidgets = state.widgetControl.activeWidgets || [];

      const nextActiveWidgetId = getNextActiveWidget(widgetLayerOrder, activeWidgets, state.infograph.widgets);
      if (!nextActiveWidgetId) return state;

      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({
          widgetIds: nextActiveWidgetId,
          widgets: state.infograph.widgets,
          shouldScrollToWidget: true,
        }),
      );

      return produce(state, (state) => {
        state.widgetControl = widgetControlState;
      });
    }
    case setPreviousActiveWidget.toString(): {
      const pageId = state.pageControl.activePageId;
      if (!pageId) return state;

      const widgetLayerOrder = state.infograph.pages[pageId]?.widgetLayerOrder || [];
      const activeWidgets = state.widgetControl.activeWidgets || [];

      const previousActiveWidgetId = getPreviousActiveWidget(widgetLayerOrder, activeWidgets, state.infograph.widgets);
      if (!previousActiveWidgetId) return state;

      const widgetControlState = widgetControlReducer(
        state.widgetControl,
        setActiveWidgetIds({
          widgetIds: previousActiveWidgetId,
          widgets: state.infograph.widgets,
          shouldScrollToWidget: true,
        }),
      );

      return produce(state, (state) => {
        state.widgetControl = widgetControlState;
      });
    }
    default:
      return combinedReducer(state, action);
  }
}

export const store = configureStore({
  reducer: crossSliceReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [setActiveWidgetToolbarState.type],
        ignoredPaths: ['widgetControl.activeWidgetToolbarState'],
      },
    }),
});

export const newStore = () => {
  return configureStore({
    reducer: crossSliceReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [setActiveWidgetToolbarState.type],
          ignoredPaths: ['widgetControl.activeWidgetToolbarState'],
        },
      }),
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
