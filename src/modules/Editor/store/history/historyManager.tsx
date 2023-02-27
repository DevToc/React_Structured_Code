import { useEffect, createContext, ReactNode, useState, useCallback, useContext } from 'react';
import { useAppDispatch, useAppStore, useAppSelector } from 'modules/Editor/store/hooks';
import type { RootState } from 'modules/Editor/store';

import type { HistoryStore, HistoryManager } from './history.types';

import type { InfographState } from 'types/infographTypes';
import { WidgetId } from 'types/idTypes';
import { WidgetType } from 'types/widget.types';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { GroupWidgetData } from 'widgets/GroupWidget/GroupWidget.types';
import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox';
import { selectInfograph } from 'modules/Editor/store/infographSelector';
import { setActiveWidget, setActivePage } from 'modules/Editor/store';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { undoAction, redoAction } from './history.actions';
import { historyStore } from './historyStore';
import { isEmpty, isNotEmpty } from './utils';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';

/**
 * A custom hook for managing infographic history
 *
 * @param store - A history store
 * @returns The history store manager
 */
export function useInfographiHistoryManager<T>(store: HistoryStore<T>): HistoryManager<T> {
  const dispatch = useAppDispatch();

  const reduxStore = useAppStore();
  const infograph = useAppSelector(selectInfograph);
  const activePageId = useAppSelector(selectActivePage);

  const [state, setState] = useState({ canUndo: false, canRedo: false });

  const { boundingBox } = useBoundingBox();

  useEffect(() => {
    // Add initial history if store.present state is {}
    // Note: we could move this logic to initial load function later
    if (isEmpty(store.present) && isNotEmpty(infograph.id)) {
      store.clear();
      store.present = infograph;
    } else {
      setState({ canUndo: store.past.length > 0, canRedo: store.future.length > 0 });
    }
  }, [infograph, store]);

  const getStore = useCallback((): HistoryStore<T> => {
    return store;
  }, [store]);

  // if the page doesn't exist anymore unset the active page
  const resetActivePage = useCallback(() => {
    const pageOrder = (store.present as InfographState).pageOrder;

    const storeHasActivePage = pageOrder.find((id: string) => id === activePageId);
    if (!storeHasActivePage) dispatch(setActivePage({ pageId: pageOrder[0] }));
  }, [activePageId, dispatch, store]);

  const resetActiveWidget = useCallback(() => {
    const widgets = (store.present as InfographState).widgets;
    const widgetLayerOrder = (store.present as InfographState).pages[activePageId]?.widgetLayerOrder;
    // If the currently active page is removed after redo,
    // (1. add blank page, 2.remove it, 3. undo, 4. select the restored page, 5. redo)
    // it throws the error from reading `widgetLayerOrder` of undefined page.
    // and lead to the empty editor view without canvas.
    if (!widgetLayerOrder) {
      return;
    }

    // we only need the active widget ids in here when this function is called
    // moving this outside will cause severe rendering issues with drag select
    const activeWidgetIds = (reduxStore.getState() as RootState).widgetControl.activeWidgetIds;
    const activeWidgets = activeWidgetIds.filter((id: WidgetId) => widgets[id] !== undefined);
    const pageGroupWidgets = widgetLayerOrder.filter(
      (id: WidgetId) => (widgets[id] as GroupWidgetData).memberWidgetIds,
    );

    // re-populate the groupIdCache with pageGroupWidgets
    pageGroupWidgets.forEach((groupId: WidgetId) => {
      groupIdCache.add(groupId, groupId, -1);
      (widgets[groupId] as GroupWidgetData).memberWidgetIds.forEach((id: WidgetId, idx: number) =>
        groupIdCache.add(id, groupId, idx),
      );
    });

    activeWidgets.forEach((id: WidgetId) => {
      // check if the active widget is a group member
      // if it is and the group doesn't exist anymore -> clear the group cache
      const groupId = groupIdCache.getParentIdNested(id);
      if (groupId && !widgets[groupId]) groupIdCache.clearGroupId(groupId);
    });

    const hasTextBaseWidget = activeWidgets.some((id: WidgetId) =>
      [WidgetType.Table, WidgetType.Text].includes(getWidgetTypeFromId(id)),
    );
    // Prosemirror widget has internal undo/redo in memory which has conflict with global undo/redo
    // TODO: improve following logic without setTimeout and move out resetActiveWidget logic from history
    if (hasTextBaseWidget) {
      dispatch(setActiveWidget([]));
    } else {
      dispatch(setActiveWidget(activeWidgets));
    }

    // update the bounding box position and size after history events
    setTimeout(() => {
      // Reselect prosemirror widget
      if (hasTextBaseWidget) {
        dispatch(setActiveWidget(activeWidgets));
      } else {
        boundingBox.updateRect();
      }
    }, 0);
  }, [activePageId, boundingBox, dispatch, store, reduxStore]);

  const undo = useCallback(() => {
    dispatch(undoAction());
    resetActiveWidget();
    resetActivePage();
    dispatchHistoryWindowEvent();
  }, [dispatch, resetActivePage, resetActiveWidget]);

  const redo = useCallback(() => {
    dispatch(redoAction());
    resetActiveWidget();
    resetActivePage();
    dispatchHistoryWindowEvent();
  }, [dispatch, resetActivePage, resetActiveWidget]);

  return {
    undo,
    redo,
    getStore,
    ...state,
  };
}

/**
 * A window event for history that can be listened to by other components in the editor
 * E.g. listened to by editor to update bounding box rect after undo/redo
 *
 */
const dispatchHistoryWindowEvent = () => {
  const event = new Event('history');
  window.dispatchEvent(event);
};

/**
 * A public history manager context uses for history control
 */
export const HistoryManagerContext = createContext<HistoryManager<InfographState>>({
  undo() {},
  redo() {},
  canUndo: false,
  canRedo: false,
  getStore: () => undefined,
});

/**
 * Return the history manager provider component
 *
 * @param props - The provider props
 * @param props.children - A ReactNode
 * @returns The history manager provider
 */
export const HistoryManagerProvider = ({ children }: { children: ReactNode }) => {
  const manager = useInfographiHistoryManager<InfographState>(historyStore);
  return <HistoryManagerContext.Provider value={manager}>{children}</HistoryManagerContext.Provider>;
};

/**
 * A history hook
 *
 * @returns The history manager
 */
export const useHistory = (): HistoryManager<InfographState> => {
  const history = useContext(HistoryManagerContext);
  return history;
};
