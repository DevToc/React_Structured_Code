import { ReactNode, useReducer } from 'react';
import { AccessibilitySettingsContext } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.config';
import { AccessibilitySettingsState } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';

export const MockAccessibilitySettingsProvider = ({
  initState,
  children,
}: {
  initState: AccessibilitySettingsState;
  children?: ReactNode;
}) => {
  const mockReducer = jest.fn(() => ({ ...initState }));
  const [state, dispatch] = useReducer(mockReducer, initState);
  return (
    <AccessibilitySettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </AccessibilitySettingsContext.Provider>
  );
};
