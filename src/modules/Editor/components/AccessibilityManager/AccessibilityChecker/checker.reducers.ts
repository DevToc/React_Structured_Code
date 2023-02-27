import cloneDeep from 'lodash.clonedeep';
import { AccessibilitySettingsState, CheckerActions, CheckerActionType } from '../AccessibilityManager.types';
import { initAccessibilitySettingsState } from '../AccessibilityManager.config';

/**
 * TODO: use immerjs over plain literal state
 * @param state
 * @param action
 * @returns
 */
function checkerReducer(state: AccessibilitySettingsState, action: CheckerActions): AccessibilitySettingsState {
  switch (action.type) {
    case CheckerActionType.ToggleShowChecker:
      return { ...state, showChecker: !state.showChecker };

    case CheckerActionType.MarkChecker:
      if (action.checker && state.checkers[action.checker] !== undefined) {
        const newState = cloneDeep(state);

        newState.checkers[action.checker] = {
          ...newState.checkers[action.checker],
          isMarkAsResolved: !newState.checkers[action.checker]?.isMarkAsResolved,
        };

        return newState;
      }
      return state;

    case CheckerActionType.RefreshChecker:
      return { ...state, checkers: cloneDeep(initAccessibilitySettingsState.checkers) };

    case CheckerActionType.ResetChecker:
      if (action.checker && state.checkers[action.checker] !== undefined) {
        state.checkers[action.checker] = cloneDeep(initAccessibilitySettingsState.checkers[action.checker]);
        return { ...state };
      }
      return state;

    case CheckerActionType.UpdateChecker:
      if (action.checker && state.checkers[action.checker] !== undefined && action.data) {
        state.checkers[action.checker] = {
          ...cloneDeep(state.checkers[action.checker]),
          ...cloneDeep(action.data),
        };
        return { ...state };
      }
      return state;

    default:
      throw new Error(`Invalid Checker Action`);
  }
}

export { checkerReducer };
