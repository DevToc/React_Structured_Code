import { Key, Step } from 'constants/keyboard';
import { Direction } from 'constants/bounding-box';
import { WidgetType } from 'types/widget.types';
import { WidgetId } from 'types/idTypes';
import { useEventListener } from 'hooks/useEventListener';
import { removeWidget, removePage, moveWidgetInLayer, updateWidget } from 'modules/Editor/store/infographSlice';
import { WidgetDirection } from 'modules/Editor/store/infographSlice.types';
import { selectPageOrder, selectWidgets, selectPage } from 'modules/Editor/store/infographSelector';
import { getNextResponsiveWidgetMember } from 'modules/Editor/store/widgetControlSlice.helpers';
import {
  setNextActiveWidget,
  setPreviousActiveWidget,
  groupSelectedWidgets,
  unGroupSelectedWidgets,
} from 'modules/Editor/store/store';
import {
  selectActiveWidgetIds,
  selectHasActiveWidget,
  selectActiveWidgetType,
  selectActiveWidgets,
} from 'modules/Editor/store/widgetSelector';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { toggleSlideView } from 'modules/Editor/store/editorSettingsSlice';
import {
  selectIsSlideView,
  selectHasKeyboardIgnore,
  selectAllowedKeyboardKeys,
  selectFocusArea,
} from 'modules/Editor/store/selectEditorSettings';
import {
  addNewWidget,
  addNewPage,
  useAppDispatch,
  useAppSelector,
  duplicatePage,
  setActiveWidget,
  setActivePage,
} from 'modules/Editor/store';
import { useHistory } from 'modules/Editor/store/history/historyManager';
import { shouldIgnoreEventTarget } from 'modules/Editor/Editor.helpers';
import { createCopyWidgets, parseCopyWidgets, createCopyPage } from '../Clipboard';
import { useBoundingBox } from '../BoundingBox/useBoundingBox';
import { hasCustomWidgetKeyOverride } from './KeyboardShortcut.helpers';
import { FocusArea } from 'modules/Editor/store/editorSettingsSlice.types';
import { useFocus } from '../Focus';
import { PageDirection } from 'modules/Editor/store/pageControlSlice.types';
import { getFocusedPageNumber } from 'modules/Editor/store/pageControlSlice.helper';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';

// All the global editor keyboard shortcuts are handled here
export const KeyboardShortcut = () => {
  const dispatch = useAppDispatch();
  const { undo, redo } = useHistory();
  const { boundingBox } = useBoundingBox();
  const {
    setWidgetToolbarFocus,
    isCanvasFocused,
    setCanvasFocus,
    isWidgetFocused,
    setWidgetFocus,
    isPageSlideFocused,
  } = useFocus();

  const activeWidgets = useAppSelector(selectActiveWidgets);
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const hasActiveWidget = useAppSelector(selectHasActiveWidget);
  const activeWidgetType = useAppSelector(selectActiveWidgetType);
  const widgets = useAppSelector(selectWidgets);

  const activePageId = useAppSelector(selectActivePage);
  const activePage = useAppSelector(selectPage(activePageId));
  const pageOrder = useAppSelector(selectPageOrder);

  const isSlideView = useAppSelector(selectIsSlideView);
  const hasKeyboardIgnore = useAppSelector(selectHasKeyboardIgnore);
  const allowedKeyboardKeys = useAppSelector(selectAllowedKeyboardKeys);

  const focusArea = useAppSelector(selectFocusArea);

  const hasSingleWidgetSelected = activeWidgets?.length === 1;

  const singleGroupSelected =
    activeWidgets.length === 1 && activeWidgets[0].groupMembers.length > 0 && !!activeWidgets[0].groupId;
  const hasUngroup = singleGroupSelected;
  const hasGroup = activeWidgets.length > 1;
  const isToolbarFocused = focusArea === FocusArea.Toolbar;

  const isGroupContainerActive = hasActiveWidget && activeWidgetType === WidgetType.Group;
  const isResponsiveContainerActive =
    hasActiveWidget && hasSingleWidgetSelected && activeWidgets[0].responsiveGroupId === activeWidgets[0].id;

  const removeActiveWidgets = (): void => {
    dispatch(setActiveWidget([]));
    dispatch(removeWidget({ pageId: activePageId, widgetIds: activeWidgetIds }));
  };

  const unselectAll = () => {
    if (isWidgetFocused()) setCanvasFocus();
    dispatch(setActiveWidget([]));
  };

  const onSetNextActiveWidget = () => dispatch(setNextActiveWidget());
  const onSetPreviousActiveWidget = () => dispatch(setPreviousActiveWidget());
  const selectAll = () => dispatch(setActiveWidget({ allPageWidgets: true }));
  const onToggleSlideView = () => dispatch(toggleSlideView());

  const removeActivePage = (): void => {
    const isLast = activePageId === pageOrder[pageOrder.length - 1];
    const direction = isLast ? PageDirection.previous : PageDirection.next;

    dispatch(setActivePage({ direction }));
    dispatch(removePage({ pageId: activePageId }));
  };

  const moveWidget = (key: Key, px: Step = Step.Small) => {
    const move: { deltaX?: number; deltaY?: number } = {};

    if (key === Key.DownArrow) move.deltaY = px;
    if (key === Key.UpArrow) move.deltaY = -px;
    if (key === Key.LeftArrow) move.deltaX = -px;
    if (key === Key.RightArrow) move.deltaX = px;

    return boundingBox.move(move);
  };

  const resizeWidget = (key: Key, px: Step, side = Direction.SOUTH_EAST) => {
    const widget = widgets[activeWidgetIds[0]];
    const keepRatio = !!(activeWidgetIds.length > 1 || widget.isAspectRatioLocked);
    const resize = { deltaWidth: 0, deltaHeight: 0, keepRatio, side };

    if (key === Key.DownArrow || key === Key.RightArrow) {
      resize.deltaWidth = px;
      resize.deltaHeight = px;
    }

    if (key === Key.UpArrow || key === Key.LeftArrow) {
      resize.deltaWidth = -px;
      resize.deltaHeight = -px;
    }

    return boundingBox.resize(resize);
  };

  const rotateWidget = (key: Key, px: Step = Step.Small) => {
    const rotate = { deltaRotate: 0 };
    if (key === Key.LeftArrow) rotate.deltaRotate = -px;
    if (key === Key.RightArrow) rotate.deltaRotate = px;

    return boundingBox.rotate(rotate);
  };

  const onAddPage = () => dispatch(addNewPage({ insertAfterId: activePageId }));
  const nextPage = () => dispatch(setActivePage({ direction: PageDirection.next }));
  const previousPage = () => dispatch(setActivePage({ direction: PageDirection.previous }));
  const onSwitchPage = (pageNumber: number) => dispatch(setActivePage({ direction: PageDirection.manual, pageNumber }));

  const onDuplicateWidget = () => {
    const copyWidgets = createCopyWidgets(activeWidgets, widgets, activePageId);
    const newWidgets = parseCopyWidgets(copyWidgets, activePageId);

    dispatch(addNewWidget(newWidgets));
  };

  const onDuplicatePage = () => {
    const [pageClipboard] = createCopyPage(activePage, widgets);
    dispatch(duplicatePage({ insertAfterId: activePageId, pageClipboard }));
  };

  const moveWidgetLayerPosition = (direction: WidgetDirection) => {
    const moveWidgetObj = { pageId: activePageId, widgetId: activeWidgetIds[0], direction };
    dispatch(moveWidgetInLayer(moveWidgetObj));
  };

  const toggleWidgetLock = () => {
    const widgetId = activeWidgetIds[0];
    const widget = widgets[widgetId];

    const updatedWidget = { widgetId, widgetData: { isLocked: !widget.isLocked } };
    dispatch(updateWidget(updatedWidget));
  };

  const onGroup = () => dispatch(groupSelectedWidgets(activeWidgets));
  const onUnGroup = () => {
    const groupId = activeWidgets[0]?.groupId;
    if (groupId) dispatch(unGroupSelectedWidgets(groupId));
  };

  const onToggleGroup = () => {
    if (hasUngroup) return onUnGroup();
    if (hasGroup) return onGroup();
  };

  const onKeyDown = (e: KeyboardEvent | Event) => {
    const event = e as KeyboardEvent;
    const target = event.target as HTMLElement;
    const key: Key = event.which || event.keyCode;

    const isMod: boolean = event.metaKey || event.ctrlKey;
    const isShift: boolean = event.shiftKey;
    const isAlt: boolean = event.altKey;
    const isWidgetFocus = isWidgetFocused();

    const isToolbarExit = isToolbarFocused && key === Key.Escape;
    if (!isToolbarExit && shouldIgnoreEventTarget(target)) return;
    if (hasKeyboardIgnore && !allowedKeyboardKeys.includes(key)) return;
    if (hasCustomWidgetKeyOverride(key, activeWidgetType)) return;

    switch (key) {
      case Key.Delete:
      case Key.Backspace:
        if (isSlideView && !hasActiveWidget) return removeActivePage();
        removeActiveWidgets();
        break;
      case Key.Period:
        if (hasSingleWidgetSelected) {
          e.preventDefault();

          if (isMod) return moveWidgetLayerPosition(WidgetDirection[isShift ? 'Front' : 'Up']);

          break;
        }

        break;
      case Key.Comma:
        if (hasSingleWidgetSelected) {
          e.preventDefault();

          if (isMod) return moveWidgetLayerPosition(WidgetDirection[isShift ? 'Back' : 'Down']);

          break;
        }
        break;
      case Key.Escape:
        if (isToolbarFocused && hasSingleWidgetSelected) {
          return setWidgetFocus(activeWidgets[0]?.id);
        }

        // if a group member focused -> set focus back to the group container
        if (
          isWidgetFocus &&
          hasSingleWidgetSelected &&
          !isGroupContainerActive &&
          // Check that single responsive widget parent is not selected OR
          // A responsive widget inside a group is selected
          (!isResponsiveContainerActive || (isResponsiveContainerActive && activeWidgets[0].groupId)) &&
          !!activeWidgets[0].groupMembers.length
        ) {
          // If responsive widget member is selected, escape should focus on parent (responsiveGroupId)
          const isResponsiveWidgetMemberSelected =
            activeWidgets[0].responsiveGroupId && activeWidgets[0].responsiveGroupId !== activeWidgets[0].id;
          const nextId = isResponsiveWidgetMemberSelected
            ? activeWidgets[0].responsiveGroupId
            : activeWidgets[0].groupId || activeWidgets[0].responsiveGroupId;
          dispatch(setActiveWidget(nextId));
          return setWidgetFocus(nextId);
        }
        unselectAll();
        break;
      case Key.Plus:
        if (isMod) {
          console.log('TODO: Zoom In');
        }
        break;
      case Key.Minus:
        if (isMod) {
          console.log('TODO: Zoom out');
        }
        break;
      case Key.ForwardSlash:
        if (isMod) onToggleSlideView();
        break;
      case Key.DownArrow:
      case Key.UpArrow:
      case Key.RightArrow:
      case Key.LeftArrow:
        e.preventDefault();

        if ((!hasActiveWidget || isSlideView) && isAlt) {
          if (key === Key.DownArrow) return nextPage();
          if (key === Key.UpArrow) return previousPage();
        }

        const isVertical = key === Key.UpArrow || key === Key.DownArrow;
        const isHorizontal = key === Key.LeftArrow || key === Key.RightArrow;

        if (isMod && isAlt) return resizeWidget(key, Step.Medium);
        if (isMod && isShift && isVertical) return resizeWidget(key, Step.Medium, Direction.SOUTH);
        if (isMod && isShift && isHorizontal) return resizeWidget(key, Step.Medium, Direction.EAST);

        if (isAlt && isHorizontal && isShift) return rotateWidget(key, Step.Large);
        if (isAlt && isHorizontal) return rotateWidget(key, Step.Small);

        if (isMod && isVertical) return resizeWidget(key, Step.Small, Direction.SOUTH);
        if (isMod && isHorizontal) return resizeWidget(key, Step.Small, Direction.EAST);

        if (isShift) return moveWidget(key, Step.Medium);

        return moveWidget(key, 1);
      case Key.Enter:
        if (isMod && (isCanvasFocused() || isSlideView)) return onAddPage();
        if (!isMod) {
          if (isCanvasFocused()) return onSetNextActiveWidget();

          if (isPageSlideFocused()) {
            const pageNumberToMove = getFocusedPageNumber(pageOrder);

            if (pageNumberToMove) {
              return onSwitchPage(pageNumberToMove);
            }
          }
        }

        if (hasSingleWidgetSelected && isWidgetFocus) {
          e.preventDefault();

          // focus the first group member if the group container is active / focused
          if (activeWidgets[0].groupMembers.length && (isGroupContainerActive || isResponsiveContainerActive)) {
            let nextId = activeWidgets[0].groupMembers[0];

            // responsive widget members can be hidden find the first visible member
            if (isResponsiveContainerActive) {
              const responsiveWidgetBase = widgets[activeWidgets[0].id] as ResponsiveWidgetBaseData;
              const { memberWidgetIds } = responsiveWidgetBase;
              nextId = getNextResponsiveWidgetMember(memberWidgetIds, widgets, memberWidgetIds[0]) as WidgetId;
            }

            dispatch(setActiveWidget(nextId));
            return setWidgetFocus(activeWidgets[0]?.id);
          }

          return setWidgetToolbarFocus();
        }
        break;
      case Key.Tab:
        if (hasSingleWidgetSelected) {
          if (isWidgetFocus && isShift) {
            e.preventDefault();
            return onSetPreviousActiveWidget();
          }
          if (isWidgetFocus) {
            e.preventDefault();
            return onSetNextActiveWidget();
          }
        }
        break;
      case Key.Z:
        if (isMod && !isShift) {
          e.preventDefault();
          undo();
        }
        if (event.metaKey && isShift) {
          e.preventDefault();
          redo();
        }
        break;
      case Key.Y:
        if (isMod) {
          e.preventDefault();
          redo();
        }
        break;
      case Key.A:
        if (isMod) {
          e.preventDefault();
          selectAll();
        }
        break;
      case Key.L:
        if (isMod && isAlt && hasSingleWidgetSelected) {
          e.preventDefault();
          return toggleWidgetLock();
        }
        break;
      case Key.D:
        if (isMod) {
          event.preventDefault();
          if (hasActiveWidget) return onDuplicateWidget();
          if (isCanvasFocused() || isSlideView) return onDuplicatePage();
        }
        break;
      case Key.T:
        if (isMod && isAlt && hasSingleWidgetSelected && isWidgetFocus) {
          e.preventDefault();
          return setWidgetToolbarFocus();
        }
        break;
      case Key.G:
        if (isMod && isAlt) return onToggleGroup();
        break;
    }
  };

  useEventListener('keydown', onKeyDown);

  return <></>;
};
