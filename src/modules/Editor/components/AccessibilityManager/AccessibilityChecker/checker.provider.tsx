import { ReactElement, ReactNode, useReducer } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { AccessibilitySettingsContext, initAccessibilitySettingsState } from '../AccessibilityManager.config';
import { checkerReducer } from './checker.reducers';

const initState = cloneDeep(initAccessibilitySettingsState);

const CheckerSettingsProvider = ({ children }: { children?: ReactNode }): ReactElement => {
  const [state, dispatch] = useReducer(checkerReducer, initState);
  return (
    <AccessibilitySettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </AccessibilitySettingsContext.Provider>
  );
};

export { CheckerSettingsProvider };
