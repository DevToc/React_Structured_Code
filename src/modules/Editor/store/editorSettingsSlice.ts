import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'constants/keyboard';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { FocusArea, DownloadModalTrigger, ColorVisionMode } from './editorSettingsSlice.types';

export interface EditorSettingsState {
  zoom: number;
  isSlideView: boolean;
  accessibilityViewIndex: AccessibilityViewIndex;
  /**
   * Apply different visual simulator filter to page canvas, default to none.
   */
  colorVisionMode: ColorVisionMode;

  // Set to TRUE if the right side menu widget settings is open
  isWidgetSettingsView: boolean;

  // current left menu opened;
  activeWidgetMenu: WIDGET_MENU_OPTIONS;

  hasKeyboardIgnore: boolean;
  allowedKeyboardKeys: Key[];
  focusArea: FocusArea;
  downloadModal: { isOpen: boolean; trigger: DownloadModalTrigger };
  originalEditorId?: string;
  chartWidgetSettingsTabIndex: number;

  /**
   * flag to indicate language set by user manually once
   */
  languageUpdatedOnce: boolean;
}

export const initialState: EditorSettingsState = {
  zoom: 1,
  isSlideView: false,
  accessibilityViewIndex: AccessibilityViewIndex.CLOSED,
  colorVisionMode: ColorVisionMode.none,
  activeWidgetMenu: WIDGET_MENU_OPTIONS.NONE,
  isWidgetSettingsView: false,
  hasKeyboardIgnore: false,
  allowedKeyboardKeys: [],
  focusArea: FocusArea.Default,
  downloadModal: {
    isOpen: false,
    trigger: DownloadModalTrigger.Default,
  },
  originalEditorId: '',

  // Saved here due to requirement on keeping the same tab when opening settings from another data table chart widget.
  chartWidgetSettingsTabIndex: 0,

  languageUpdatedOnce: false,
};

export const editorSettings = createSlice({
  name: 'editorSettings',
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    toggleSlideView: (state) => {
      state.isSlideView = !state.isSlideView;
      if (state.isSlideView) {
        state.isWidgetSettingsView = false;
        state.accessibilityViewIndex = AccessibilityViewIndex.CLOSED;
      }
    },
    setAccessibilityViewIndex: (state, action: PayloadAction<AccessibilityViewIndex>) => {
      state.accessibilityViewIndex = action.payload;

      // Close any open side panels if the a11y menu is opened
      if (action.payload !== AccessibilityViewIndex.CLOSED) {
        state.isWidgetSettingsView = false;
        state.isSlideView = false;
      }
    },
    setColorVisionMode: (state, action: PayloadAction<ColorVisionMode>) => {
      state.colorVisionMode = action.payload;
    },
    dangerouslySetHasKeyboardIgnore: (
      state,
      action: PayloadAction<{ hasKeyboardIgnore: boolean; allowedKeyboardKeys?: Key[] }>,
    ) => {
      const { hasKeyboardIgnore, allowedKeyboardKeys } = action.payload;
      state.hasKeyboardIgnore = hasKeyboardIgnore;
      state.allowedKeyboardKeys = allowedKeyboardKeys || [];
    },
    setFocusArea: (state, action: PayloadAction<FocusArea>) => {
      state.focusArea = action.payload;
    },
    setDownloadModal: (state, action: PayloadAction<{ isOpen: boolean; trigger?: DownloadModalTrigger }>) => {
      const { isOpen, trigger = DownloadModalTrigger.Default } = action.payload;
      state.downloadModal.isOpen = isOpen;
      state.downloadModal.trigger = trigger;
    },
    setOriginalEditorId: (state, action: PayloadAction<string>) => {
      state.originalEditorId = action.payload;
    },
    setWidgetSettingsView: (state, action: PayloadAction<boolean>) => {
      state.isWidgetSettingsView = action.payload;

      // Close any open side panels if opening widget settings view
      if (action.payload) {
        state.accessibilityViewIndex = AccessibilityViewIndex.CLOSED;
        state.isSlideView = false;
      }
    },
    setActiveWidgetMenu: (state, action: PayloadAction<WIDGET_MENU_OPTIONS>) => {
      if (action.payload === state.activeWidgetMenu) state.activeWidgetMenu = WIDGET_MENU_OPTIONS.NONE;
      else state.activeWidgetMenu = action.payload;
    },
    setChartSettingsTabIndex: (state, action: PayloadAction<{ tabIndex: number }>) => {
      const { tabIndex } = action.payload;
      state.chartWidgetSettingsTabIndex = tabIndex;
    },
    setLanguageUpdatedOnce: (state, action: PayloadAction<boolean>) => {
      state.languageUpdatedOnce = action.payload;
    },
  },
});

export const {
  setZoom,
  toggleSlideView,
  setAccessibilityViewIndex,
  setColorVisionMode,
  dangerouslySetHasKeyboardIgnore,
  setFocusArea,
  setDownloadModal,
  setOriginalEditorId,
  setWidgetSettingsView,
  setChartSettingsTabIndex,
  setLanguageUpdatedOnce,
  setActiveWidgetMenu,
} = editorSettings.actions;

export default editorSettings.reducer;
