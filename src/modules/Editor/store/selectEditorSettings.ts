import { RootState } from './store';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';
import { FocusArea, DownloadModalTrigger } from './editorSettingsSlice.types';
import { Key } from 'constants/keyboard';

const selectZoom = (state: RootState): number => state.editorSettings.zoom;
const selectIsSlideView = (state: RootState): boolean => state.editorSettings.isSlideView;
const selectAccessibilityViewIndex = (state: RootState) => state.editorSettings.accessibilityViewIndex;
const selectIsWidgetSettingsView = (state: RootState): boolean => state.editorSettings.isWidgetSettingsView;
const selectIsAccessibilityView = (state: RootState): boolean =>
  state.editorSettings.accessibilityViewIndex !== AccessibilityViewIndex.CLOSED;
const selectHasKeyboardIgnore = (state: RootState): boolean => state.editorSettings.hasKeyboardIgnore;
const selectAllowedKeyboardKeys = (state: RootState): Key[] => state.editorSettings.allowedKeyboardKeys;
const selectFocusArea = (state: RootState): FocusArea => state.editorSettings.focusArea;
const selectIsDownloadModalOpen = (state: RootState): boolean => state.editorSettings.downloadModal.isOpen;
const selectDownloadModalTrigger = (state: RootState): DownloadModalTrigger =>
  state.editorSettings.downloadModal.trigger;
const selectOriginalEditorId = (state: RootState) => state.editorSettings.originalEditorId;
const selectChartSettingsTabIndex = (state: RootState) => state.editorSettings.chartWidgetSettingsTabIndex;

export {
  selectZoom,
  selectIsSlideView,
  selectAccessibilityViewIndex,
  selectIsAccessibilityView,
  selectHasKeyboardIgnore,
  selectAllowedKeyboardKeys,
  selectFocusArea,
  selectIsDownloadModalOpen,
  selectDownloadModalTrigger,
  selectOriginalEditorId,
  selectIsWidgetSettingsView,
  selectChartSettingsTabIndex,
};
