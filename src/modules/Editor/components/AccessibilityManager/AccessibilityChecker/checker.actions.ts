import {
  AccessibilityCheckers,
  AllCheckerState,
  CheckerActions,
  CheckerActionType,
} from '../AccessibilityManager.types';

const toggleShowChecker = (): CheckerActions => ({ type: CheckerActionType.ToggleShowChecker });

const markChecker = (checker: AccessibilityCheckers): CheckerActions => ({
  type: CheckerActionType.MarkChecker,
  checker,
});

const updateChecker = <T extends AllCheckerState>(
  checker: AccessibilityCheckers,
  data: Partial<T>,
): CheckerActions => ({
  type: CheckerActionType.UpdateChecker,
  checker,
  data,
});

const refreshChecker = (): CheckerActions => ({ type: CheckerActionType.RefreshChecker });

const resetChecker = (checker: AccessibilityCheckers): CheckerActions => ({
  type: CheckerActionType.ResetChecker,
  checker,
});

export { toggleShowChecker, markChecker, refreshChecker, resetChecker, updateChecker };
