import { PageId, WidgetId } from 'types/idTypes';

type SelectionTarget = {
  pageId: PageId;
  widgetId: WidgetId;
};

enum AccessibilityCheckerStatus {
  warn = 'warn',
  reviewed = 'reviewed',
  ok = 'ok',
  fail = 'fail',
}

enum AccessibilityMenuTabIndex {
  checker = 0,
  readingOrder = 1,
  colorVision = 2,
}

enum AccessibilityCheckers {
  documentLanguage = 'documentLanguage',
  documentTitle = 'documentTitle',
  alternativeText = 'alternativeText',
  imageTexts = 'imageTexts',
  logicalReadingOrder = 'logicalReadingOrder',
  headings = 'headings',
  colorContrast = 'colorContrast',
  useOfColor = 'useOfColor',
  links = 'links',
  tables = 'tables',
  textSize = 'textSize',
}

/**
 * Tags for non essential widgets (image, icon, shape, line, chart)
 *
 * When `Alternative Text` checker tab is selected and open,
 * These tags should be displayed on those widgets.
 */
enum NonTextWidgetTag {
  Alt = 'Alt',
  Decorative = 'Decorative',
  MissingAlt = 'MissingAlt',
}

/**
 * Action type for checker reducer
 */
enum CheckerActionType {
  ToggleShowChecker,
  MarkChecker,
  RefreshChecker,
  ResetChecker,
  UpdateChecker,
}

interface ToggleShowChecker {
  type: CheckerActionType.ToggleShowChecker;
}

interface MarkChecker {
  type: CheckerActionType.MarkChecker;
  checker: AccessibilityCheckers;
}

interface RefreshChecker {
  type: CheckerActionType.RefreshChecker;
}

interface ResetChecker {
  type: CheckerActionType.ResetChecker;
  checker: AccessibilityCheckers;
}

interface UpdateChecker<T extends AllCheckerState> {
  type: CheckerActionType.UpdateChecker;
  checker: AccessibilityCheckers;
  data: Partial<T>;
}

type CheckerActions = ToggleShowChecker | MarkChecker | RefreshChecker | ResetChecker | UpdateChecker<AllCheckerState>;

interface CheckerState {
  isMarkAsResolved: boolean;
  requireManualCheck: boolean;
  issues?: {};
}

type InvalidWidgetList = {
  pageId: PageId;
  widgetId: WidgetId;
}[];

// TODO: add inividual specific checker state
interface DocumentLanguageCheckerState extends CheckerState {}
interface DocumentTitleCheckerState extends CheckerState {}
interface AlternativeCheckerState extends CheckerState {
  invalidWidgets?: InvalidWidgetList;
}
interface ImageTextsCheckerState extends CheckerState {}
interface LogicalReadingOrderCheckerState extends CheckerState {}
interface ColorContrastState extends CheckerState {
  invalidWidgets?: InvalidWidgetList;
}
interface HeadingCheckerState extends CheckerState {
  invalidWidgets?: InvalidWidgetList;
}
interface UseOfColorCheckerState extends CheckerState {}
interface LinkCheckerState extends CheckerState {
  invalidWidgets?: InvalidWidgetList;
}
interface TextSizeCheckerState extends CheckerState {
  invalidWidgets?: InvalidWidgetList;
}
interface TableCheckerState extends CheckerState {
  invalidWidgets?: InvalidWidgetList;
}

type AllCheckerState =
  | DocumentLanguageCheckerState
  | DocumentTitleCheckerState
  | AlternativeCheckerState
  | ImageTextsCheckerState
  | LogicalReadingOrderCheckerState
  | HeadingCheckerState
  | ColorContrastState
  | UseOfColorCheckerState
  | LinkCheckerState
  | TextSizeCheckerState;

interface AccessibilitySettingsState {
  showChecker: boolean;
  isInProgress: boolean;
  checkers: {
    [AccessibilityCheckers.documentLanguage]: DocumentLanguageCheckerState;
    [AccessibilityCheckers.documentTitle]: DocumentTitleCheckerState;
    [AccessibilityCheckers.alternativeText]: AlternativeCheckerState;
    [AccessibilityCheckers.imageTexts]: ImageTextsCheckerState;
    [AccessibilityCheckers.logicalReadingOrder]: LogicalReadingOrderCheckerState;
    [AccessibilityCheckers.colorContrast]: ColorContrastState;
    [AccessibilityCheckers.headings]: HeadingCheckerState;
    [AccessibilityCheckers.useOfColor]: UseOfColorCheckerState;
    [AccessibilityCheckers.links]: LinkCheckerState;
    [AccessibilityCheckers.tables]: TableCheckerState;
    [AccessibilityCheckers.textSize]: TextSizeCheckerState;
  };
}

type AllCheckerComponentType<K extends string, T> = { [P in K]: T };

export type {
  SelectionTarget,
  HeadingCheckerState,
  AccessibilitySettingsState,
  AllCheckerState,
  CheckerState,
  CheckerActions,
  AlternativeCheckerState,
  InvalidWidgetList,
  AllCheckerComponentType,
};

export {
  AccessibilityMenuTabIndex,
  AccessibilityCheckers,
  AccessibilityCheckerStatus,
  CheckerActionType,
  NonTextWidgetTag,
};
