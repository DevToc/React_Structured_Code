import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { RootState } from './store';

export const selectColorVisionMode = (state: RootState) => state.editorSettings.colorVisionMode;

export const selectLanguageUpdatedOnce = (state: RootState) => state.editorSettings.languageUpdatedOnce;

export const selectActiveWidgetMenu = (state: RootState) => state.editorSettings.activeWidgetMenu;

export const selectIsWidgetMenuActive = (state: RootState) =>
  state.editorSettings.activeWidgetMenu !== WIDGET_MENU_OPTIONS.NONE;
