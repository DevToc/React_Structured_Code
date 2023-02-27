import React from 'react';
import { WidgetId } from '../../../../types/idTypes';

export interface FocusContextI {
  widgetToolbarRef: React.RefObject<HTMLDivElement> | null;
  widgetToolbarPortalRef: React.RefObject<HTMLDivElement> | null;
  widgetSideMenuSettingsPortalRef: React.RefObject<HTMLDivElement> | null;
  pageScrollContainerRef: React.RefObject<HTMLDivElement> | null;
  activePageRef: React.RefObject<HTMLDivElement> | null;
  fileMenuRef: React.RefObject<HTMLButtonElement> | null;
  closeAccessibilityMenuRef: React.RefObject<HTMLButtonElement> | null;
  setWidgetToolbarFocus: () => void;
  setCanvasFocus: () => void;
  setWidgetFocus: (id: WidgetId) => void;
  isCanvasFocused: () => boolean;
  isWidgetFocused: () => boolean;
  isPageSlideFocused: () => boolean;
  blur: () => void;
}
