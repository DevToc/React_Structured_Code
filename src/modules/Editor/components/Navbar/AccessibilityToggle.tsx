import { ReactElement } from 'react';
import { ReactComponent as AccessibleIcon } from 'assets/icons/toolbar/file/Acessible.svg';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';
import { useAppDispatch } from 'modules/Editor/store';
import { setAccessibilityViewIndex } from 'modules/Editor/store/editorSettingsSlice';

export const AccessibilityToggle = (): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <AccessibleIcon
      width={40}
      height={40}
      onClick={() => dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.EDIT))}
    />
  );
};
