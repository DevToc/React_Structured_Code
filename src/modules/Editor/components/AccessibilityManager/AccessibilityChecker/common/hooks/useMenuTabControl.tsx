import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { setAccessibilityViewIndex } from 'modules/Editor/store/editorSettingsSlice';
import { selectAccessibilityViewIndex } from 'modules/Editor/store/selectEditorSettings';
import { useCallback } from 'react';
import { AccessibilityMenuTabIndex } from '../../../AccessibilityManager.types';

interface AccessibilityMenuTabControl {
  tabIndex: AccessibilityMenuTabIndex;
  setTabIndex: (index: number) => void;
}

/**
 * Hook to set accessibility menu tab index
 */
const useMenuTabControl = (): AccessibilityMenuTabControl => {
  const dispatch = useAppDispatch();
  const accessibilityViewIndex = useAppSelector(selectAccessibilityViewIndex);

  const setTabIndex = useCallback(
    (index: number) => {
      dispatch(setAccessibilityViewIndex(index));
    },
    [dispatch],
  );

  return {
    tabIndex: accessibilityViewIndex as number,
    setTabIndex,
  };
};

export { useMenuTabControl };
