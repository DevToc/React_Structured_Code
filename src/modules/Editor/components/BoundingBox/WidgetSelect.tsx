import { useEffect, useRef } from 'react';
import Selecto, { OnSelect, OnDragStart, OnSelectEnd, OnScroll } from 'react-selecto';

import { useEventListener } from 'hooks/useEventListener';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { setActiveWidget } from 'modules/Editor/store';
import { ActiveWidgetIds } from 'modules/Editor/store/widgetControlSlice';
import { selectActiveWidgetIds, selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { SCROLL_CONTAINER_ID } from '../PageArea/PageArea.config';
import { SELECTO_TARGET_CLASS } from 'constants/bounding-box';
import { getWidgetTargetIds } from './BoundingBox.helpers';
import { SelectoTarget } from './BoundingBox.types';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { detectPortContainer } from 'utils/dom';
import { useFocus } from '../Focus';

interface WidgetSelectProps {
  moveableRef: any;
  targets: HTMLElement[];
  selectoRef: any;
}

// the margin to the edges where select to scroll would trigger
const SELECT_SCROLL_THRESHOLD = 30;
const SELECT_SCROLL_THROTTLE = 100;
const SELECT_SCROLL_STEP = 40;

// Handles widget selection:
//  - on click: selects the widgets
//  - mousedown + drag: area selects the widgets
export const WidgetSelect = ({ moveableRef, targets, selectoRef }: WidgetSelectProps) => {
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const hasGroupSelected = activeWidgets.length && activeWidgets.filter((aW) => !!aW.groupMembers.length).length > 0;
  const dispatch = useAppDispatch();
  const mouseDown = useRef(false);

  const onMouseDown = () => {
    mouseDown.current = true;
  };

  const onMouseUp = () => {
    mouseDown.current = false;
  };

  useEventListener('mousedown', onMouseDown);
  useEventListener('mouseup', onMouseUp);

  useEffect(() => {
    if (!selectoRef || !selectoRef.current) return;
    // To sync up selected targets' state of selecto ref
    // when unselecting all active widgets.
    if (activeWidgets.length === 0 && selectoRef.current.getSelectedTargets().length > 0) {
      selectoRef.current.setSelectedTargets([]);
    }
  }, [activeWidgets, selectoRef]);

  const setActiveWidgets = (targets: SelectoTarget[]): void => {
    const selectedIds: ActiveWidgetIds = getWidgetTargetIds(targets);
    if (!selectedIds.length && !activeWidgetIds.length) return;

    dispatch(setActiveWidget(selectedIds));
  };

  const onDragStart = (e: OnDragStart): void => {
    const portContainer = detectPortContainer(e.clientX, e.clientY);
    if (portContainer) return e.stop();

    const moveable = moveableRef.current;
    const target = e.inputEvent.target;
    const isShift = e.inputEvent.shiftKey;

    const isMoveable = moveable.isMoveableElement(target);
    if (isMoveable) return e.stop();

    if (!hasGroupSelected) return;
    if (isShift) return;

    // TODO: improve this
    // Selecto blocks click events for group targets (= widgets).
    // This is a workaround to allow click events to be passed to group member widgets
    // and at the same time select dragging from widgets in a group.

    // Safari doesn't have path
    const inputPath = e.inputEvent.path || (e.inputEvent.composedPath && e.inputEvent.composedPath()) || [];

    for (const el of inputPath) {
      if (el && el.id && groupIdCache.hasParentWidget(el.id)) {
        dispatch(setActiveWidget(el.id));
        // see https://github.com/daybrush/moveable/issues/481
        setTimeout(() => {
          // e.isDragStart is true for on quick
          // check if the mouse is still down before triggering drag start of widget
          if (!mouseDown.current) return;
          moveable.dragStart(e.inputEvent);
        }, 0);

        return;
      }
    }
  };

  const onSelect = (e: OnSelect): void => {
    setActiveWidgets(e.selected);
  };

  const onSelectEnd = (e: OnSelectEnd): void => {
    const moveable = moveableRef.current;

    // Case 1: If single selected id and single moveable ref target id are different, active the single selected id
    // Case 2: Deselect if no element is selected
    const isSingleSelected = e.selected.length === 1 && moveable.refTargets.length === 1;
    const hasMatch = isSingleSelected && e.selected[0].id === moveable.refTargets[0].id;
    const isSelected = e.selected?.length > 0;
    if ((isSingleSelected && !hasMatch) || !isSelected) setActiveWidgets(e.selected);

    if (e.isDragStart) {
      e.inputEvent.preventDefault();

      // see https://github.com/daybrush/moveable/issues/481
      setTimeout(() => {
        // e.isDragStart is true for on quick
        // check if the mouse is still down before triggering drag start of widget, touch events should be fine
        if (!mouseDown.current && !/touch/g.test(e.inputEvent.type)) return;
        moveable.dragStart(e.inputEvent);
      }, 0);
    }
  };

  const { pageScrollContainerRef } = useFocus();
  // cast pageScrollContainerRef?.current type from HTMLDIVElement to HTMLElement to match the type of scrollOptions
  const pageScrollContainer = pageScrollContainerRef?.current as HTMLElement;
  const scrollOptions = {
    container: pageScrollContainer,
    throttle: SELECT_SCROLL_THROTTLE,
    threshold: SELECT_SCROLL_THRESHOLD,
  };

  const onScroll = (e: OnScroll): void => {
    if (pageScrollContainerRef?.current)
      pageScrollContainerRef.current.scrollBy(e.direction[0] * SELECT_SCROLL_STEP, e.direction[1] * SELECT_SCROLL_STEP);
  };

  return (
    <>
      <Selecto
        ref={selectoRef}
        dragContainer={`#${SCROLL_CONTAINER_ID}`}
        selectableTargets={[`.${SELECTO_TARGET_CLASS}`]}
        toggleContinueSelect={['shift']}
        hitRate={0}
        ratio={0}
        selectByClick={true}
        selectFromInside={false}
        onDragStart={onDragStart}
        onSelect={onSelect}
        onSelectEnd={onSelectEnd}
        scrollOptions={scrollOptions}
        onScroll={onScroll}
      />
    </>
  );
};
