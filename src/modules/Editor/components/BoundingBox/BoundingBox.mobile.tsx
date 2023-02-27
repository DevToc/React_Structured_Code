import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import Moveable, { OnClick as MoveableClickEvent } from 'react-moveable';
import styled from '@emotion/styled';
import Selecto from 'react-selecto';

import { WidgetId } from 'types/idTypes';
import { useWindowSize } from 'hooks/useWindowSize';
import { useSmartGuide } from 'hooks/useSmartGuide';
import { useEventListener } from 'hooks/useEventListener';
import { MOVEABLE_LOCK_CLASS } from 'constants/bounding-box';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { parseStrictNumber } from 'utils/number';
import { isSideHandle } from 'utils/boundingBox';
import {
  selectIsAccessibilityView,
  selectIsSlideView,
  selectIsWidgetSettingsView,
  selectZoom,
} from 'modules/Editor/store/selectEditorSettings';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { selectActiveWidgetIds, selectCropId, selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { updateWidget, UpdateWidget } from 'modules/Editor/store/infographSlice';
import { selectWidget, selectInfographSize } from 'modules/Editor/store/infographSelector';

import {
  getWidgetElements,
  getWidgetHandles,
  getWidgetResizable,
  getWidgetRotatable,
  getHideDefaultLines,
  checkActiveWidgetIdByTarget,
  extendWidgetCreator,
  getRotatDegFromStyle,
  getDirectionAsString,
  getKeepAspectRatioHandles,
  isTargetStyleNumber,
} from './BoundingBox.helpers';
import { DEFAULT_SNAP_DATA } from './BoundingBox.config';
import {
  OnDragStartEvent,
  OnDragEvent,
  OnDragEndEvent,
  OnResizeStartEvent,
  OnResizeEvent,
  OnResizeEndEvent,
  OnRotateStartEvent,
  OnRotateEvent,
  OnRotateEndEvent,
  OnDragGroupStartEvent,
  OnDragGroupEvent,
  OnDragGroupEndEvent,
  OnResizeGroupStartEvent,
  OnResizeGroupEvent,
  OnResizeGroupEndEvent,
  OnRotateGroupStartEvent,
  OnRotateGroupEvent,
  OnRotateGroupEndEvent,
  OnClickGroupEvent,
  WidgetEvent,
  Frame,
  pageScroll,
  BoundingBoxStatus,
  OnScrollEvent,
  OnScrollGroupEvent,
} from './BoundingBox.types';
import { Snap } from './BoundingBox.types';
import { useBoundingBox, useExtendBoundingBoxWithMoveable } from './useBoundingBox/useBoundingBox';
import { useFocus } from '../Focus';
import { WidgetSelect } from './WidgetSelect';
import { useFlowCore, useFlowMode, usePortRender, usePortValue } from '../FlowCore';
import { PortTypes } from 'types/flowCore.types';

type StyledMoveableType = {
  activeGroupIdx: number;
  isGroup: boolean;
};

const StyledMoveable = styled(Moveable)<StyledMoveableType>`
  // Override the z-index of Moveable so that it appears below Chakra modals
  z-index: var(--vg-zIndices-boundingBox) !important;

  // Nested bounding boxes
  .moveable-control-box {
    .moveable-line,
    .moveable-direction {
      height: 0.5px;
    }
  }

  .moveable-line.moveable-direction:hover {
    cursor: move;
  }

  //  Active nested bounding box
  .moveable-control-box:nth-of-type(${(props) => props.activeGroupIdx + 1}) {
    .moveable-line,
    .moveable-direction {
      height: 2px;
    }
  }

  // disable pointer events for groups - this is needed for the bounding box to be clickable
  .moveable-area {
    pointer-events: ${(props) => (props.isGroup ? 'none' : 'auto')};
  }

  // add pseudo element for anchor/handle highlighting on mobile
  .moveable-resizable {
    position: relative;

    &::before {
      content: '';
      border-radius: 50%;
      width: 42px;
      height: 42px;
      top: -16px;
      left: -16px;
      background-color: hsla(0, 0%, 100%, 0.4);
      box-shadow: 0 0 4px 1px rgb(47 64 80 / 25%);
      position: absolute;
      pointer-events: none;
      transition: all 0.3s ease-in-out;
      transform: scale(0);
    }

    &:active {
      &::before {
        transform: scale(1);
      }
    }
  }
`;

// Index for widget that is not part of a group
const NON_GROUP_MEMBER_IDX = -1;
// page scroll step when dragging widget to the edges
const PAGE_SCROLL_STEP = 20;
// page would scroll when dragging to this margin around the edges
const PAGE_SCROLL_THRESHOLD = 40;

export const BoundingBoxMobile = () => {
  const lastSnapPosition = useRef<Snap | null>();
  const moveableRef: any = useRef(null);
  const selectoRef = useRef<Selecto | null>(null);
  const { pageScrollContainerRef } = useFocus();
  // keep track of the amount of pageScroll on X and Y axis while dragging
  const pageScrollOnDrag = useRef<pageScroll>([0, 0]);
  // keep track of original scrollHeight and scrollWidth for pageScrollContainer when drag starts
  const originalScrollDimensions = useRef<pageScroll>([0, 0]);
  // currently only use to check if the status is onDrag for drag to scroll
  const boundingBoxStatus = useRef<keyof typeof BoundingBoxStatus | null>(null);

  const [frameMap] = useState<Frame>(() => new Map());
  const [targets, setTargets] = useState<HTMLElement[]>([]);

  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const hasMemberWidgets =
    activeWidgets.length === 1 && (!!activeWidgets[0].groupId || !!activeWidgets[0].responsiveGroupId);
  const activeGroupIdx = hasMemberWidgets ? groupIdCache.getGroupIdx(activeWidgets[0].id) : NON_GROUP_MEMBER_IDX;

  const isSingleWidget = activeWidgets.length === 1;
  const selectedWidgetId = isSingleWidget ? activeWidgets[0].responsiveGroupId || activeWidgets[0].id : '';
  const selectedSingleWidget = useAppSelector(selectWidget(selectedWidgetId));
  const zoom = useAppSelector(selectZoom);
  const infoGraphSize = useAppSelector(selectInfographSize);
  const cropId = useAppSelector(selectCropId);

  const windowSize = useWindowSize();
  const dispatch = useAppDispatch();

  const [renderPort, clearPort] = usePortRender();
  const [startFlowMode, stopFlowMode] = useFlowMode();
  const creatorPortData = usePortValue('creatorPortData');
  const { getConnectedLines } = useFlowCore();

  const widgetHandles = getWidgetHandles(activeWidgets, selectedSingleWidget);
  const isResizable = getWidgetResizable(activeWidgetIds);
  const isRotatable = getWidgetRotatable(activeWidgetIds);
  const hideDefaultLines = getHideDefaultLines(activeWidgetIds);
  const keepAspectRatioHandles = getKeepAspectRatioHandles(activeWidgetIds);

  // If isAspectRatioLocked is true, will override keepRatio in Moveable props
  const [keepRatio, setKeepRatio] = useState<boolean>(false);
  const isAspectRatioLocked = activeWidgetIds.length > 1;

  const isLocked = !!selectedSingleWidget?.isLocked;
  const hasTarget = !cropId;

  const hasAccessibilityView = useAppSelector(selectIsAccessibilityView);
  const hasWidgetSettingsView = useAppSelector(selectIsWidgetSettingsView);

  const [setSmartGuideConfig, compute, match, hide] = useSmartGuide(
    document.getElementById('smartguide-container') as HTMLElement,
    {
      zIndex: 1003,
      enableSnap: true,
      zoomPercent: zoom * 100,
    },
  );

  const { widgetRefs, boundingBox } = useBoundingBox();
  useExtendBoundingBoxWithMoveable({ boundingBox, moveableRef });

  const onClickGroup = (e: OnClickGroupEvent): void => {
    selectoRef?.current?.clickTarget(e.inputEvent, e.inputTarget);
  };

  const isSlideView = useAppSelector(selectIsSlideView);

  useEffect(() => {
    if (!moveableRef || !moveableRef.current) return;

    moveableRef.current.updateRect();
    setSmartGuideConfig({ zoomPercent: zoom * 100 });
  }, [zoom, windowSize, setSmartGuideConfig, hasAccessibilityView, hasWidgetSettingsView, infoGraphSize, isSlideView]);

  // Selection is kept after undo/redo - and if a widget changes position/size the bounding box rect is not updated
  useEventListener('history', () => {
    setTimeout(() => moveableRef.current?.updateRect(), 0);
  });

  const getStartFrame = (e: OnDragStartEvent | OnResizeStartEvent | OnRotateStartEvent) => {
    const target = e.target;
    if (!frameMap.has(target)) {
      frameMap.set(target, {
        translate: [0, 0],
        rotate: 0,
      });
    }

    const rotateDeg = getRotatDegFromStyle(target.style);
    if (!Number.isNaN(rotateDeg)) {
      frameMap.set(target, {
        translate: [0, 0],
        rotate: rotateDeg || 0,
      });
    }

    return frameMap.get(target);
  };

  const saveWidget = useCallback(
    (widgetId: string, widgetData: object): void => {
      if (!widgetId) return;
      if (!widgetData) return;

      dispatch(updateWidget({ widgetId, widgetData }));
    },
    [dispatch],
  );

  const getPageScrollPosition = pageScrollContainerRef?.current
    ? (e: { scrollContainer: HTMLElement; direction: number[] }): number[] => {
        return [pageScrollContainerRef.current!.scrollTop, pageScrollContainerRef.current!.scrollLeft];
      }
    : undefined;

  // Determine if there is enough space for a full scrollStep, if not adjust the actual scrollX
  const calculateActualScrollX = (scrollStep: number, direction: number): number => {
    if (!pageScrollContainerRef?.current) return 0;
    const pageScrollEl = pageScrollContainerRef.current;
    const { scrollLeft, clientWidth } = pageScrollEl;
    // when page scrolls to the right, pageScrollEl.scrollWidth could be increased while dragging, use the original scrollWidth for consistent calculation
    const scrollWidth = originalScrollDimensions.current[0];

    // direction -1 means drag to left and 1 means to the right
    if (direction === -1 && scrollLeft - scrollStep >= 0) {
      return scrollStep;
    } else if (direction === -1 && scrollLeft - scrollStep < 0) {
      return scrollLeft;
    } else if (direction === 1 && scrollWidth - (scrollLeft + clientWidth) - scrollStep >= 0) {
      return scrollStep;
    } else {
      return scrollWidth - (scrollLeft + clientWidth);
    }
  };

  // Determine if there is enough space for a full scrollStep, if not adjust the actual scrollY
  const calculateActualScrollY = (scrollStep: number, direction: number): number => {
    if (!pageScrollContainerRef?.current) return 0;
    const pageScrollEl = pageScrollContainerRef.current;
    const { scrollTop, clientHeight } = pageScrollEl;
    // when page scrolls to the bottom, pageScrollEl.scrollHeight could be increased while dragging, use the original scrollHeight for consistent calculation
    const scrollHeight = originalScrollDimensions.current[1];

    // direction -1 means drag to top and 1 means to the bottom
    if (direction === -1 && scrollTop - scrollStep >= 0) {
      return scrollStep;
    } else if (direction === -1 && scrollTop - scrollStep < 0) {
      return scrollTop;
    } else if (direction === 1 && scrollHeight - (scrollTop + clientHeight) - scrollStep >= 0) {
      return scrollStep;
    } else {
      return scrollHeight - (scrollTop + clientHeight);
    }
  };

  const onScroll = (e: OnScrollEvent): void => {
    // only allow page to scroll when dragging for now
    // only allow scroll either on X or Y axis, diagonal scrolling would cause issues with updating widget UI while dragging
    if (boundingBoxStatus.current !== BoundingBoxStatus.onDrag || e.direction[0] * e.direction[1] !== 0) return;
    const pageScrollX = e.direction[0] * calculateActualScrollX(PAGE_SCROLL_STEP, e.direction[0]);
    const pageScrollY = e.direction[1] * calculateActualScrollY(PAGE_SCROLL_STEP, e.direction[1]);
    if ((Math.abs(pageScrollX) === 0 && Math.abs(pageScrollY) === 0) || !pageScrollContainerRef) return;
    pageScrollOnDrag.current[0] += pageScrollX;
    pageScrollOnDrag.current[1] += pageScrollY;
    pageScrollContainerRef.current?.scrollBy(pageScrollX, pageScrollY);
  };

  const onScrollGroup = (e: OnScrollGroupEvent): void => {
    // only allow page to scroll when dragging for now
    // only allow scroll either on X or Y axis, diagonal scrolling would cause issues with updating widget UI while dragging
    if (boundingBoxStatus.current !== BoundingBoxStatus.onDrag || e.direction[0] * e.direction[1] !== 0) return;
    const pageScrollX = e.direction[0] * calculateActualScrollX(PAGE_SCROLL_STEP, e.direction[0]);
    const pageScrollY = e.direction[1] * calculateActualScrollY(PAGE_SCROLL_STEP, e.direction[1]);
    if ((Math.abs(pageScrollX) === 0 && Math.abs(pageScrollY) === 0) || !pageScrollContainerRef) return;
    pageScrollOnDrag.current[0] += pageScrollX;
    pageScrollOnDrag.current[1] += pageScrollY;
    pageScrollContainerRef.current?.scrollBy(pageScrollX, pageScrollY);
  };

  const onDragStart = (e: OnDragStartEvent): void => {
    // Start observing of connected lines
    startFlowMode();

    const frame = getStartFrame(e);
    e.set(frame.translate);

    // SmartGuide
    lastSnapPosition.current = DEFAULT_SNAP_DATA;
    compute(e, 'drag');

    // PortRenderer
    clearPort();

    // Update boudingBox status, initialize pageScrollOnDrag and originalScrollDimensions
    boundingBoxStatus.current = BoundingBoxStatus.onDrag;

    pageScrollOnDrag.current = [0, 0];
    if (pageScrollContainerRef?.current)
      originalScrollDimensions.current = [
        pageScrollContainerRef.current.scrollWidth,
        pageScrollContainerRef.current.scrollHeight,
      ];
  };

  const onDrag = (e: OnDragEvent): void => {
    // Prevent port rendering when Select+Drag
    if (creatorPortData !== null) clearPort();

    const target = e.target;
    const frame = frameMap.get(target);
    const pageScrollAdjustment = pageScrollOnDrag.current;
    // SmartGuide
    lastSnapPosition.current = match({ e, pageScrollAdjustment });

    frame.translate = e.beforeTranslate;
    const translateX = `${lastSnapPosition.current?.x ?? frame.translate[0] + pageScrollAdjustment[0] / zoom}px`;
    const translateY = `${lastSnapPosition.current?.y ?? frame.translate[1] + pageScrollAdjustment[1] / zoom}px`;
    const rotate = `${frame.rotate}deg`;
    target.style.transform = `translate(${translateX}, ${translateY}) rotate(${rotate})`;
  };

  const onDragEnd = (e: OnDragEndEvent): void => {
    // SmartGuide
    hide();
    const target = e.target;
    const frame = frameMap.get(target);
    // Generate connected line data before updating the style
    const connectedLineDatas = getConnectedLines(target.id, target as HTMLElement);
    const pageScrollAdjustment = pageScrollOnDrag.current;
    const newLeftPx =
      parseStrictNumber(target.style.left) +
      (lastSnapPosition.current?.x ?? frame.translate[0] + pageScrollAdjustment[0] / zoom);
    const newTopPx =
      parseStrictNumber(target.style.top) +
      (lastSnapPosition.current?.y ?? frame.translate[1] + pageScrollAdjustment[1] / zoom);

    // Update style
    target.style.left = `${newLeftPx}px`;
    target.style.top = `${newTopPx}px`;
    frame.translate = [0, 0];

    // Reset transform value
    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;

    // Reset pageScrollOnDrag
    boundingBoxStatus.current = null;
    pageScrollOnDrag.current = [0, 0];

    if (checkActiveWidgetIdByTarget(activeWidgetIds, target)) {
      let batchUpdateWidgetList: UpdateWidget[] = [
        {
          widgetId: target.id,
          widgetData: {
            leftPx: newLeftPx,
            topPx: newTopPx,
          },
        },
      ];
      batchUpdateWidgetList = batchUpdateWidgetList.concat(connectedLineDatas);
      dispatch(updateWidget(batchUpdateWidgetList));
    }

    stopFlowMode();

    // Render the port: line creator
    renderPort(e.target as HTMLElement, PortTypes.Creator);
  };

  const onResizeStart = (e: OnResizeStartEvent): void => {
    // Start observing of connected lines
    startFlowMode();

    // PortRenderer
    clearPort();

    const frame = getStartFrame(e);
    if (e.dragStart) e.dragStart.set(frame.translate);

    // SmartGuide
    lastSnapPosition.current = DEFAULT_SNAP_DATA;
    compute(e, 'resize');

    // If direction is specified in keepAspectRatioHandles, then widget should scale
    const direction = getDirectionAsString(e.direction);
    if (
      !!keepAspectRatioHandles &&
      keepAspectRatioHandles.includes?.(direction) &&
      widgetHandles.includes?.(direction)
    ) {
      setKeepRatio(true);
    } else {
      setKeepRatio(false);
    }
  };

  const onResize = (e: OnResizeEvent): void => {
    const target = e.target;
    const frame = frameMap.get(target);
    const snapData = match({ e, frame });

    frame.translate = [snapData.x as number, snapData.y as number];
    const currentWidth = parseFloat(target.style.width);
    const isWidthDifferent = currentWidth !== snapData.width;
    // Ignore to update current widget style if value is a string(auto, fit-content, min-content, max-content, etc)
    if (!Number.isNaN(currentWidth) && isWidthDifferent) {
      target.style.width = `${snapData.width}px`;
    }
    const currentHeight = parseFloat(target.style.height);
    const isHeightDifferent = currentHeight !== snapData.height;
    if (!Number.isNaN(currentHeight) && isHeightDifferent) {
      target.style.height = `${snapData.height}px`;
    }

    const isDimensionDifferent = isWidthDifferent || isHeightDifferent;
    if (isDimensionDifferent) {
      const translateX = `${frame.translate[0]}px`;
      const translateY = `${frame.translate[1]}px`;
      const rotate = `${frame.rotate}deg`;
      target.style.transform = `translate(${translateX}, ${translateY}) rotate(${rotate})`;
    }
  };

  const onResizeEnd = (e: OnResizeEndEvent, widgetData = {}): void => {
    const target = e.target;
    const frame = frameMap.get(target);

    // Generate connected line data before updating the style
    const connectedLineDatas = getConnectedLines(target.id, target as HTMLElement);

    const lastEvent = e.lastEvent;
    if (lastEvent) {
      /**
       * Use the clientWidth/Height instead of the style.width/height to allow string values of the width/height style.
       * However, DO NOT use the clientTop and clientLeft, it returns unexpected value.
       */
      const newLeftPx = parseStrictNumber(target.style.left) + (lastSnapPosition.current?.x ?? frame.translate[0]);
      const newTopPx = parseStrictNumber(target.style.top) + (lastSnapPosition.current?.y ?? frame.translate[1]);
      const newWidthPx = target.clientWidth;
      const newHeightPx = target.clientHeight;

      // Update style
      target.style.left = `${newLeftPx}px`;
      target.style.top = `${newTopPx}px`;

      // Ignore to update current widget style if value is a string(auto, fit-content, min-content, max-content, etc)
      if (!Number.isNaN(parseFloat(target.style.width))) target.style.width = `${newWidthPx}px`;
      if (!Number.isNaN(parseFloat(target.style.height))) target.style.height = `${newHeightPx}px`;

      // Reset transform value
      frame.translate = [0, 0];
      e.target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;

      if (checkActiveWidgetIdByTarget(activeWidgetIds, target)) {
        let batchUpdateWidgetList: UpdateWidget[] = [
          {
            widgetId: target.id,
            widgetData: {
              leftPx: newLeftPx,
              topPx: newTopPx,
              widthPx: newWidthPx,
              heightPx: newHeightPx,
              ...widgetData,
            },
          },
        ];
        batchUpdateWidgetList = batchUpdateWidgetList.concat(connectedLineDatas);
        dispatch(updateWidget(batchUpdateWidgetList));
      }
    }

    // Reset
    hide();
    stopFlowMode();

    // Render the port: line creator
    renderPort(e.target as HTMLElement, PortTypes.Creator);
  };

  const onRotateStart = (e: OnRotateStartEvent): void => {
    const frame = getStartFrame(e);
    e.set(frame.rotate);
  };

  const onRotate = (e: OnRotateEvent): void => {
    const target = e.target;
    const frame = frameMap.get(target);
    frame.rotate = e.beforeRotate;

    // Ignore to update current widget style if value is a string(auto, fit-content, min-content, max-content, etc)
    if (!Number.isNaN(parseFloat(target.style.width))) target.style.width = `${e.drag.width}px`;
    if (!Number.isNaN(parseFloat(target.style.height))) target.style.height = `${e.drag.height}px`;

    target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${e.beforeRotate}deg)`;
  };

  const onRotateEnd = (e: OnRotateEndEvent): void => {
    const target = e.target;
    const frame = frameMap.get(target);

    if (checkActiveWidgetIdByTarget(activeWidgetIds, target)) {
      saveWidget(target.id, {
        rotateDeg: frame.rotate,
      });
    }
  };

  const onDragGroupStart = (e: OnDragGroupStartEvent): void => {
    // Start observing of connected lines
    startFlowMode();

    e.events.forEach((ev: OnDragStartEvent) => {
      const frame = getStartFrame(ev);

      ev.set(frame.translate);
    });

    // SmartGuide
    lastSnapPosition.current = DEFAULT_SNAP_DATA;
    compute(e, 'drag');

    // PortRenderer
    clearPort();

    // Update boudingBox status, initialize pageScrollOnDrag and originalScrollDimensions
    boundingBoxStatus.current = BoundingBoxStatus.onDrag;

    pageScrollOnDrag.current = [0, 0];
    if (pageScrollContainerRef?.current)
      originalScrollDimensions.current = [
        pageScrollContainerRef.current.scrollWidth,
        pageScrollContainerRef.current.scrollHeight,
      ];
  };

  const onDragGroup = (e: OnDragGroupEvent): void => {
    // NOTE: Prevent port rendering when Select+Drag
    if (creatorPortData !== null) clearPort();

    // SmartGuide
    const pageScrollAdjustment = pageScrollOnDrag.current;
    lastSnapPosition.current = match({ e, pageScrollAdjustment });

    const onDragGroupWidget = (ev: OnDragEvent): void => {
      const target = ev.target;
      const frame = frameMap.get(target);
      const pageScrollAdjustment = pageScrollOnDrag.current;

      frame.translate = ev.beforeTranslate;

      const translateX = `${lastSnapPosition.current?.x ?? frame.translate[0] + pageScrollAdjustment[0] / zoom}px`;
      const translateY = `${lastSnapPosition.current?.y ?? frame.translate[1] + pageScrollAdjustment[1] / zoom}px`;
      const rotate = `${frame.rotate}deg`;

      target.style.transform = `translate(${translateX}, ${translateY}) rotate(${rotate})`;
    };

    e.events.forEach((ev: OnDragEvent) => {
      if (ev) {
        const target = ev.target;
        const widgetId = target.id;
        const widgetRef = widgetRefs[widgetId];
        const customWidgetDrag = widgetRef ? widgetRef[WidgetEvent.onDrag] : null;
        e.target = target;

        /**
         * Members of a responsive widget should not be translated as their positions should be relative to the
         * parent container.
         * Only the parent should be translated.
         */
        if (groupIdCache.isResponsiveGroupMember(widgetId)) {
          return;
        }

        if (customWidgetDrag) {
          customWidgetDrag({
            event: e,
            [WidgetEvent.onDrag]: onDragGroupWidget,
            target,
            isGroup: true,
          });
        } else {
          onDragGroupWidget(ev);
        }
      }
    });
  };

  const onDragGroupEnd = (e: OnDragGroupEndEvent): void => {
    let batchUpdateWidgetList: UpdateWidget[] = [];

    // SmartGuide
    hide();

    const onDragGroupEndWidget = (e: OnDragGroupEndEvent): void => {
      const target = e.target;
      const frame = frameMap.get(target);
      const pageScrollAdjustment = pageScrollOnDrag.current;
      const newLeftPx =
        parseStrictNumber(target.style.left) +
        (lastSnapPosition.current?.x ?? frame.translate[0] + pageScrollAdjustment[0] / zoom);
      const newTopPx =
        parseStrictNumber(target.style.top) +
        (lastSnapPosition.current?.y ?? frame.translate[1] + pageScrollAdjustment[1] / zoom);

      // Generate connected line data before updating the style
      const connectedLineDatas = getConnectedLines(target.id, target as HTMLElement);

      // Update style
      target.style.left = `${newLeftPx}px`;
      target.style.top = `${newTopPx}px`;
      frame.translate = [0, 0];

      // Reset transform value
      target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;

      if (checkActiveWidgetIdByTarget(activeWidgetIds, target)) {
        batchUpdateWidgetList.push({
          widgetId: target.id,
          widgetData: {
            leftPx: newLeftPx,
            topPx: newTopPx,
          },
        });
        batchUpdateWidgetList = batchUpdateWidgetList.concat(connectedLineDatas);
      }
    };

    const saveWidget = (widgetId: WidgetId, data: object) => {
      batchUpdateWidgetList.push({ widgetId, widgetData: data });
    };

    e.targets.forEach((target) => {
      const widgetId = target.id;
      const widgetRef = widgetRefs[widgetId];
      const customWidgetDragEnd = widgetRef ? widgetRef[WidgetEvent.onDragEnd] : null;
      e.target = target;

      if (customWidgetDragEnd) {
        customWidgetDragEnd({
          event: e,
          [WidgetEvent.onDragEnd]: onDragGroupEndWidget,
          target,
          saveWidget,
          isGroup: true,
        });
      } else {
        onDragGroupEndWidget(e);
      }
    });

    // Reset pageScrollOnDrag
    boundingBoxStatus.current = null;
    pageScrollOnDrag.current = [0, 0];

    stopFlowMode();

    dispatch(updateWidget(batchUpdateWidgetList));

    // Render the port: line creator
    const isSingleSelected = activeWidgets.length === 1;
    if (isSingleSelected) {
      const responsiveGroupElm = e.targets.find((targetElm) => targetElm.id === activeWidgets[0].responsiveGroupId);
      if (responsiveGroupElm) {
        renderPort(responsiveGroupElm as HTMLElement, PortTypes.Creator);
      }
    }
  };

  const onResizeGroupStart = (e: OnResizeGroupStartEvent): void => {
    // Start observing of connected lines
    startFlowMode();

    const onResizeGroupStartWidget = (ev: OnResizeStartEvent): void => {
      const frame = getStartFrame(ev);

      ev.dragStart && ev.dragStart.set(frame.translate);
    };

    e.events.forEach((ev: OnResizeStartEvent) => {
      const target = ev.target;
      const widgetId = target.id;
      const widgetRef = widgetRefs[widgetId];

      const customWidgetResizeStart = widgetRef ? widgetRef[WidgetEvent.onResizeStart] : null;
      if (customWidgetResizeStart) {
        customWidgetResizeStart({
          event: ev,
          [WidgetEvent.onResizeStart]: onResizeGroupStartWidget,
          frameMap,
          isGroup: true,
        });
      } else {
        onResizeGroupStartWidget(ev);
      }
    });

    // PortRenderer
    clearPort();
  };

  // TODO: connect with smartguide
  const onResizeGroup = (e: OnResizeGroupEvent): void => {
    const onResizeGroupWidget = (ev: OnResizeEvent) => {
      const target = ev.target;
      const frame = frameMap.get(target);

      frame.translate = ev.drag.beforeTranslate;

      // Ignore to update current widget style if value is a string(auto, fit-content, min-content, max-content, etc)
      if (isTargetStyleNumber(target.style.width)) target.style.width = `${ev.width}px`;
      if (isTargetStyleNumber(target.style.height)) target.style.height = `${ev.height}px`;

      // Member widgets of responsive groupd should not be translated as they are relative to the container
      const widgetId = target.id;
      if (groupIdCache.isResponsiveGroupMember(widgetId)) return;

      const translateX = ev.drag.beforeTranslate[0];
      // responsive groups have side-handles (unlike normal groups) - resize from side should not move the y-position of a widget
      const hasFixedY = groupIdCache.isResponsiveWidgetBase(widgetId) && isSideHandle(ev.direction);
      const translateY = hasFixedY ? 0 : ev.drag.beforeTranslate[1];

      ev.target.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${frame.rotate}deg)`;
    };

    e.events.forEach((ev: OnResizeEvent) => {
      const target = ev.target;
      const widgetId = target.id;
      const widgetRef = widgetRefs[widgetId];

      const customWidgetResize = widgetRef ? widgetRef[WidgetEvent.onResize] : null;
      if (customWidgetResize) {
        customWidgetResize({
          event: ev,
          [WidgetEvent.onResize]: onResizeGroupWidget,
          frameMap,
          isGroup: true,
          isResponsiveGroup: groupIdCache.isResponsiveGroupMember(widgetId),
        });
      } else onResizeGroupWidget(ev);
    });
  };

  const onResizeGroupEnd = (e: OnResizeGroupEndEvent): void => {
    let batchUpdateWidgetList: UpdateWidget[] = [];

    const onResizeGroupEndWidget = (e: OnResizeEndEvent, widgetData = {}) => {
      const target = e.target;
      const widgetId = target.id;
      const frame = frameMap.get(target);

      // Generate connected line data before updating the style
      const connectedLineDatas = getConnectedLines(widgetId, target as HTMLElement);

      const translateX = frame.translate[0];
      const hasFixedY =
        groupIdCache.isResponsiveWidgetBase(widgetId) && e.lastEvent && isSideHandle(e.lastEvent.direction);
      const translateY = hasFixedY ? 0 : frame.translate[1];

      const newLeftPx = parseStrictNumber(target.style.left) + translateX;
      const newTopPx = parseStrictNumber(target.style.top) + translateY;
      const newWidthPx = target.clientWidth;
      const newHeightPx = target.clientHeight;

      // Update style
      target.style.left = `${newLeftPx}px`;
      target.style.top = `${newTopPx}px`;

      // Ignore to update current widget style if value is a string(auto, fit-content, min-content, max-content, etc)
      if (isTargetStyleNumber(target.style.width)) target.style.width = `${newWidthPx}px`;
      if (isTargetStyleNumber(target.style.height)) target.style.height = `${newHeightPx}px`;

      // Reset transform value
      frame.translate = [0, 0];
      target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;

      if (checkActiveWidgetIdByTarget(activeWidgetIds, target)) {
        batchUpdateWidgetList.push({
          widgetId,
          widgetData: {
            leftPx: newLeftPx,
            topPx: newTopPx,
            widthPx: newWidthPx,
            heightPx: newHeightPx,
            ...widgetData,
          },
        });
        batchUpdateWidgetList = batchUpdateWidgetList.concat(connectedLineDatas);
      }
    };

    const saveWidget = (widgetId: WidgetId, data: object) => {
      batchUpdateWidgetList.push({ widgetId, widgetData: data });
    };

    e.targets.forEach((target: HTMLElement | SVGElement) => {
      const widgetId = target.id;
      const widgetRef = widgetRefs[widgetId];
      const customWidgetResizeEnd = widgetRef ? widgetRef[WidgetEvent.onResizeEnd] : null;
      e.target = target;

      if (customWidgetResizeEnd) {
        customWidgetResizeEnd({
          event: e,
          [WidgetEvent.onResizeEnd]: onResizeGroupEndWidget,
          target,
          saveWidget,
          isGroup: true,
        });
      } else onResizeGroupEndWidget(e);
    });

    dispatch(updateWidget(batchUpdateWidgetList));

    stopFlowMode();

    // Render the port: line creator
    const isSingleSelected = activeWidgets.length === 1;
    if (isSingleSelected) {
      const responsiveGroupElm = e.targets.find((targetElm) => targetElm.id === activeWidgets[0].responsiveGroupId);
      if (responsiveGroupElm) {
        renderPort(responsiveGroupElm as HTMLElement, PortTypes.Creator);
      }
    }
  };

  const onRotateGroupStart = (e: OnRotateGroupStartEvent): void => {
    e.events.forEach((ev: OnRotateStartEvent, i) => {
      const frame = getStartFrame(ev);

      ev.set(frame.rotate);
      ev.dragStart && ev.dragStart.set(frame.translate);
    });
  };

  const onRotateGroup = (e: OnRotateGroupEvent): void => {
    e.events.forEach((ev: OnRotateEvent, i) => {
      const target = ev.target;
      const frame = frameMap.get(target);

      frame.translate = ev.drag.beforeTranslate;
      frame.rotate = ev.rotate;

      ev.target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${ev.rotate}deg)`;
    });
  };

  const onRotateGroupEnd = (e: OnRotateGroupEndEvent): void => {
    const batchUpdateWidgetList: UpdateWidget[] = [];

    const onRotateGroupEndWidget = (e: OnRotateGroupEndEvent) => {
      const target = e.target;
      const frame = frameMap.get(target);
      const newLeftPx = parseStrictNumber(target.style.left) + frame.translate[0];
      const newTopPx = parseStrictNumber(target.style.top) + frame.translate[1];

      // Update style
      target.style.left = `${newLeftPx}px`;
      target.style.top = `${newTopPx}px`;
      frame.translate = [0, 0];

      // Reset transform value
      target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`;

      if (checkActiveWidgetIdByTarget(activeWidgetIds, target)) {
        batchUpdateWidgetList.push({
          widgetId: target.id,
          widgetData: {
            leftPx: newLeftPx,
            topPx: newTopPx,
            rotateDeg: frame.rotate,
          },
        });
      }
    };

    const saveWidget = (widgetId: WidgetId, data: object) => {
      batchUpdateWidgetList.push({ widgetId, widgetData: data });
    };

    e.targets.forEach((target) => {
      const widgetId = target.id;
      const widgetRef = widgetRefs[widgetId];
      const customWidgetRotateEnd = widgetRef ? widgetRef[WidgetEvent.onRotateEnd] : null;
      e.target = target;

      if (customWidgetRotateEnd) {
        customWidgetRotateEnd({
          event: e,
          [WidgetEvent.onRotateEnd]: onRotateGroupEndWidget,
          target,
          saveWidget,
          isGroup: true,
        });
      } else onRotateGroupEndWidget(e);
    });

    dispatch(updateWidget(batchUpdateWidgetList));
  };

  const extendWidget = extendWidgetCreator({ activeWidgetIds, widgetRefs, frameMap, compute, match, hide, saveWidget });

  useLayoutEffect(() => {
    setTargets(getWidgetElements(activeWidgetIds, widgetRefs));
  }, [activeWidgetIds, widgetRefs]);

  return (
    <>
      <StyledMoveable
        flushSync={flushSync}
        ref={moveableRef}
        target={hasTarget ? targets : []}
        renderDirections={widgetHandles}
        className={isLocked ? MOVEABLE_LOCK_CLASS : ''}
        // boolean options
        origin={false}
        draggable={!isLocked}
        resizable={isResizable && !isLocked}
        rotatable={isRotatable && !isLocked}
        keepRatio={isAspectRatioLocked || keepRatio}
        hideDefaultLines={hideDefaultLines}
        // TODO: make it configurable?
        edgeDraggable={true}
        // single widget
        // FIXME: Workaround for moveable touch event issue preventing editable content from working
        // Issue link: https://github.com/daybrush/moveable/issues/298
        onClick={(e: MoveableClickEvent) => {
          if (e.inputEvent?.type === 'touchend') {
            if (e.inputTarget instanceof HTMLElement) {
              e.inputTarget?.click();
            }
          }
        }}
        onDragStart={extendWidget(onDragStart, WidgetEvent.onDragStart)}
        onDrag={extendWidget(onDrag, WidgetEvent.onDrag)}
        onDragEnd={extendWidget(onDragEnd, WidgetEvent.onDragEnd)}
        onResizeStart={extendWidget(onResizeStart, WidgetEvent.onResizeStart)}
        onResize={extendWidget(onResize, WidgetEvent.onResize)}
        onResizeEnd={extendWidget(onResizeEnd, WidgetEvent.onResizeEnd)}
        onRotateStart={extendWidget(onRotateStart, WidgetEvent.onRotateStart)}
        onRotate={extendWidget(onRotate, WidgetEvent.onRotate)}
        onRotateEnd={extendWidget(onRotateEnd, WidgetEvent.onRotateEnd)}
        // widget group
        onClickGroup={onClickGroup}
        onDragGroupStart={onDragGroupStart}
        onDragGroup={onDragGroup}
        onDragGroupEnd={onDragGroupEnd}
        onResizeGroupStart={onResizeGroupStart}
        onResizeGroup={onResizeGroup}
        onResizeGroupEnd={onResizeGroupEnd}
        onRotateGroupStart={onRotateGroupStart}
        onRotateGroup={onRotateGroup}
        onRotateGroupEnd={onRotateGroupEnd}
        // custom styling override options
        activeGroupIdx={activeGroupIdx}
        isGroup={hasMemberWidgets}
        // scroll options
        scrollable={true}
        scrollContainer={pageScrollContainerRef?.current}
        scrollThreshold={PAGE_SCROLL_THRESHOLD}
        getScrollPosition={getPageScrollPosition}
        onScroll={onScroll}
        onScrollGroup={onScrollGroup}
      />
      <WidgetSelect selectoRef={selectoRef} moveableRef={moveableRef} targets={targets} />
    </>
  );
};
