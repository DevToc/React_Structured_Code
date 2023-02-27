import { createContext, useContext, ReactNode, useRef, useCallback } from 'react';

import { WidgetId } from 'types/idTypes';
import { EDITOR_ACTIVE_PAGE_FOCUS_ID } from '../../Editor.config';
import { useAppSelector, useAppStore, RootState } from 'modules/Editor/store';
import { useBoundingBox } from '../BoundingBox/useBoundingBox';
import { FocusContextI } from './Focus.types';
import { selectPageOrder } from 'modules/Editor/store/infographSelector';
import { selectShouldScrollToWidget } from 'modules/Editor/store/widgetSelector';

const defaultFocusContext = {
  widgetToolbarRef: null,
  widgetToolbarPortalRef: null,
  widgetSideMenuSettingsPortalRef: null,
  pageScrollContainerRef: null,
  activePageRef: null,
  fileMenuRef: null,
  closeAccessibilityMenuRef: null,
  setWidgetToolbarFocus: () => {},
  setCanvasFocus: () => {},
  setWidgetFocus: (id: WidgetId) => {},
  isCanvasFocused: () => false,
  isWidgetFocused: () => false,
  isPageSlideFocused: () => false,
  blur: () => {},
};
const FocusContext = createContext<FocusContextI>(defaultFocusContext);

const FOCUSABLE_ELS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const widgetToolbarRef = useRef<HTMLDivElement>(null);
  const widgetToolbarPortalRef = useRef<HTMLDivElement>(null);
  const widgetSideMenuSettingsPortalRef = useRef<HTMLDivElement>(null);
  const pageScrollContainerRef = useRef<HTMLDivElement>(null);
  const activePageRef = useRef<HTMLDivElement>(null);
  const fileMenuRef = useRef<HTMLButtonElement>(null);
  const closeAccessibilityMenuRef = useRef<HTMLButtonElement>(null);

  const { widgetRefs } = useBoundingBox();
  const pageOrder = useAppSelector(selectPageOrder);
  const shouldScrollToWidget = useAppSelector(selectShouldScrollToWidget);
  const store = useAppStore();

  const setWidgetToolbarFocus = useCallback(() => {
    if (!widgetToolbarRef.current) return;

    // focus first item
    const focusEls = widgetToolbarRef.current.querySelectorAll(FOCUSABLE_ELS);
    if (focusEls && focusEls.length) (focusEls[0] as HTMLElement)?.focus();
  }, []);

  const setCanvasFocus = useCallback(() => {
    if (!activePageRef.current) return;

    activePageRef.current.focus();
  }, []);

  const isCanvasFocused = useCallback((): boolean => {
    const activeFocusElement = document.activeElement;
    return activeFocusElement?.id === EDITOR_ACTIVE_PAGE_FOCUS_ID;
  }, []);

  const isPageSlideFocused = useCallback((): boolean => {
    const activeElementId = document.activeElement?.id;
    if (!activeElementId) return false;

    return pageOrder.includes(activeElementId);
  }, [pageOrder]);

  const isWidgetFocused = useCallback(
    (id?: WidgetId): boolean => {
      // we only need the active widget ids in here when this function is called
      // moving this outside will cause severe rendering issues with drag select
      const activeWidgetIds = (store.getState() as RootState).widgetControl.activeWidgetIds;

      const activeElementId = document.activeElement?.id;
      if (!activeElementId) return false;

      if (id) return id === activeElementId;
      return activeWidgetIds.includes(activeElementId);
    },
    [store],
  );

  const setWidgetFocus = useCallback(
    (widgetId: WidgetId) => {
      const widgetBaseEl = widgetRefs[widgetId]?.element || document.getElementById(widgetId);
      if (widgetBaseEl) widgetBaseEl.focus({ preventScroll: !shouldScrollToWidget });
    },
    [widgetRefs, shouldScrollToWidget],
  );

  const blur = useCallback((): void => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) activeElement.blur();
  }, []);

  return (
    <FocusContext.Provider
      value={{
        widgetToolbarRef,
        widgetToolbarPortalRef,
        widgetSideMenuSettingsPortalRef,
        pageScrollContainerRef,
        activePageRef,
        fileMenuRef,
        closeAccessibilityMenuRef,
        setWidgetToolbarFocus,
        isCanvasFocused,
        setCanvasFocus,
        isWidgetFocused,
        setWidgetFocus,
        isPageSlideFocused,
        blur,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};

/**
 *  Hook for setting focus to editor areas (and widgets), and for checking if an area is currently focused
 */
export const useFocus = (): FocusContextI => {
  const focusContext = useContext(FocusContext);

  return focusContext;
};
