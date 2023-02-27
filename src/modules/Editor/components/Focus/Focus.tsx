import { useLayoutEffect, useCallback } from 'react';

import { FocusArea } from '../../store/editorSettingsSlice.types';
import { setFocusArea } from '../../store/editorSettingsSlice';
import { selectActiveWidgets } from '../../store/widgetSelector';
import { selectFocusArea } from '../../store/selectEditorSettings';
import { useAppSelector, useAppDispatch } from '../../store';
import { useEventListener } from '../../../../hooks/useEventListener';
import { useFocus } from './useFocus';
import { isElementInToolbarFocused } from './Focus.helpers';

interface FocusInEvent extends FocusEvent {
  path: HTMLElement[] | undefined;
}

/**
 *  Handles global focus events in the editor
 */
export const Focus = () => {
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const focusArea = useAppSelector(selectFocusArea);

  const dispatch = useAppDispatch();
  const { setWidgetFocus } = useFocus();

  const onSetFocusArea = (focusArea: FocusArea) => dispatch(setFocusArea(focusArea));

  const onFocusIn = (event: Event) => {
    const e = event as FocusInEvent;
    if (!activeWidgets.length) return;

    if (e.path && isElementInToolbarFocused(e.path)) {
      if (focusArea === FocusArea.Toolbar) return;
      onSetFocusArea(FocusArea.Toolbar);
    } else if (focusArea === FocusArea.Toolbar) onSetFocusArea(FocusArea.Default);
  };

  // If a widget becomes active => set focus on widget
  const onSetWidgetFocus = useCallback(() => {
    if (activeWidgets && activeWidgets.length === 1) setWidgetFocus(activeWidgets[0].id);
  }, [activeWidgets, setWidgetFocus]);

  useEventListener('focusin', onFocusIn);
  // Layout effect required set focus after the widget ref has been set / updated
  useLayoutEffect(onSetWidgetFocus, [onSetWidgetFocus]);

  return <></>;
};
