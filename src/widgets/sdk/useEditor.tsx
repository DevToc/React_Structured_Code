import { useCallback } from 'react';

import { AllWidgetUIControl } from 'widgets/Widget.types';
import {
  BoundingBoxRef,
  WidgetBoundingBoxRef,
} from 'modules/Editor/components/BoundingBox/useBoundingBox/useBoundingBox.types';
import { SetWidgetRef, CleanupWidgetBoundingBoxConfig } from 'widgets/Widget.types';
import { Key } from 'constants/keyboard';
import { FocusArea } from 'modules/Editor/store/editorSettingsSlice.types';

import { useWidget } from './useWidget';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { selectCropId } from 'modules/Editor/store/widgetSelector';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { dangerouslySetHasKeyboardIgnore, setActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSlice';
import { setCropId } from 'modules/Editor/store/widgetControlSlice';
import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox';
import { useFocus } from 'modules/Editor/components/Focus';
import { setWidgetSettingsView } from 'modules/Editor/store/editorSettingsSlice';
import { selectIsActiveWidget } from 'modules/Editor/store/widgetSelector';
import { selectFocusArea } from 'modules/Editor/store/selectEditorSettings';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { setNextActiveWidget } from 'modules/Editor/store/store';
import { setChartSettingsTabIndex } from 'modules/Editor/store/editorSettingsSlice';
import { selectChartSettingsTabIndex } from 'modules/Editor/store/selectEditorSettings';
import { setActiveWidgetToolbarState } from 'modules/Editor/store/widgetControlSlice';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { IconWidgetData } from 'widgets/IconWidget/IconWidget.types';

/**
 * A hook for reading and updating editor state in widgets
 * Anyhing that is related to editor state - That widgets need - should go through this hook ideally
 *
 * Implementation: combines different editor state (settings, bounding box, keyboard...) into one hook for widgets
 *
 * Example: const { zoom, isWidgetSelected, openWidgetSideMenu, ... } = useEditor();
 */

interface UseEditor {
  /**
   * general editor ui state
   */
  zoom: number;
  isCropView: boolean;
  // turn on/off crop view for widgets that support cropping
  disableCropView: () => void;
  toggleCropView: () => void;

  /**
   * widget specific editor state
   */
  isWidgetSelected: boolean;
  isGroupMember: boolean;
  // for saving chart widget side menu controls
  chartSettingsTabIndex: number;
  setChartWidgetSettingTabIndex: (index: number) => void;
  // Set toolbar functions from widget that can be used in the editor
  setWidgetToolbarState: (state: AllWidgetUIControl) => void;
  // Select the next widget in order (mainly used for custom keyboard navigation)
  onSetNextActiveWidget: () => void;
  // for widgets with a side menu
  openWidgetSideMenu: () => void;
  closeWidgetSideMenu: () => void;

  /**
   *  bounding box
   *
   * See: useBoundingBox.tsx
   */
  boundingBox: BoundingBoxRef;
  widgetRefs: WidgetBoundingBoxRef;
  setWidgetRef: SetWidgetRef;
  cleanupWidgetBoundingBoxConfig: CleanupWidgetBoundingBoxConfig;

  /**
   *  Keyboard
   */
  disableEditorKeyboardShortcuts: (arg?: { allowedKeyboardKeys?: Key[] }) => void;
  enableEditorKeyboardShortcuts: () => void;

  /**
   *  Focus
   */
  focusArea: FocusArea;
  isWidgetFocused: () => boolean;
  isCanvasFocused: () => boolean;
  setWidgetFocus: () => void;
  blur: () => void;
  setWidgetToolbarFocus: () => void;
  openReplaceWidgetMenu: () => void;
}

export const useEditor = (): UseEditor => {
  const { widgetId } = useWidget<IconWidgetData>();
  const dispatch = useAppDispatch();

  const isWidgetSelected = useAppSelector(selectIsActiveWidget(widgetId));
  const activeWidgetMenu = useAppSelector(selectActiveWidgetMenu);
  const cropId = useAppSelector(selectCropId);
  const zoom = useAppSelector(selectZoom);
  const focusArea = useAppSelector(selectFocusArea);
  const chartSettingsTabIndex = useAppSelector(selectChartSettingsTabIndex);

  const { boundingBox, widgetRefs, setWidgetRef, cleanupWidgetBoundingBoxConfig } = useBoundingBox();
  const { setWidgetFocus: setFocus, blur, setWidgetToolbarFocus, isWidgetFocused, isCanvasFocused } = useFocus();

  const setWidgetFocus = useCallback(() => setFocus(widgetId), [setFocus, widgetId]);

  const disableEditorKeyboardShortcuts = useCallback(
    ({ allowedKeyboardKeys = [] }: { allowedKeyboardKeys?: Key[] } = {}) => {
      dispatch(dangerouslySetHasKeyboardIgnore({ hasKeyboardIgnore: true, allowedKeyboardKeys }));
    },
    [dispatch],
  );

  const enableEditorKeyboardShortcuts = useCallback(() => {
    dispatch(dangerouslySetHasKeyboardIgnore({ hasKeyboardIgnore: false }));
  }, [dispatch]);

  const disableCropView = useCallback(() => dispatch(setCropId('')), [dispatch]);

  const toggleCropView = useCallback(() => {
    // enable crop view for this widget
    if (cropId && cropId === widgetId) return dispatch(setCropId(''));
    dispatch(setCropId(widgetId));
  }, [cropId, dispatch, widgetId]);

  const openWidgetSideMenu = useCallback(() => dispatch(setWidgetSettingsView(true)), [dispatch]);
  const closeWidgetSideMenu = useCallback(() => dispatch(setWidgetSettingsView(false)), [dispatch]);

  const setChartWidgetSettingTabIndex = useCallback(
    (index: number) => dispatch(setChartSettingsTabIndex({ tabIndex: index })),
    [dispatch],
  );

  const setWidgetToolbarState = useCallback(
    (controlAction: AllWidgetUIControl) => dispatch(setActiveWidgetToolbarState({ ...controlAction })),
    [dispatch],
  );
  const onSetNextActiveWidget = useCallback(() => dispatch(setNextActiveWidget()), [dispatch]);

  const openReplaceWidgetMenu = useCallback(() => {
    const shouldOpenReplaceMenu = activeWidgetMenu !== WIDGET_MENU_OPTIONS.REPLACE;
    shouldOpenReplaceMenu && dispatch(setActiveWidgetMenu(WIDGET_MENU_OPTIONS.REPLACE));
  }, [activeWidgetMenu, dispatch]);

  const isCropView = cropId === widgetId;
  const isGroupMember = groupIdCache.hasParentWidget(widgetId);

  return {
    zoom,
    isCropView,
    disableCropView,
    toggleCropView,
    isWidgetSelected,
    isGroupMember,
    chartSettingsTabIndex,
    setChartWidgetSettingTabIndex,
    setWidgetToolbarState,
    onSetNextActiveWidget,
    openWidgetSideMenu,
    closeWidgetSideMenu,
    boundingBox,
    widgetRefs,
    setWidgetRef,
    cleanupWidgetBoundingBoxConfig,
    disableEditorKeyboardShortcuts,
    enableEditorKeyboardShortcuts,
    focusArea,
    isWidgetFocused,
    isCanvasFocused,
    setWidgetFocus,
    blur,
    setWidgetToolbarFocus,
    openReplaceWidgetMenu,
  };
};
