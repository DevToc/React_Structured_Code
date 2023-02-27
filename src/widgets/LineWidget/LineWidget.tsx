import { ReactElement, useEffect, useState, useMemo, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

import {
  CustomOnResize,
  CustomOnResizeEnd,
  CustomOnRotateEnd,
} from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import {
  useEditor,
  useWidget,
  WidgetToolbar,
  WidgetBase,
  WidgetBaseProp,
  ReadOnlyWidgetBase,
  TransparentImg,
} from 'widgets/sdk';
import { Pos, DeltaPos, LineWidgetData, WidgetState, SetFocusProps } from './LineWidget.types';
import { DEFAULT_DELTA_POS } from './LineWidget.config';
import { LINE_TYPE_MAP } from './LineRenders';
import { LINE_HANDLER_MAP } from './LineHandlers';
import {
  mergePosList,
  getStartPos,
  getMidPosList,
  getEndPos,
  getStepByKeyEvent,
  getPosByKeyEvent,
  getHandleSize,
  calculatePosByRatio,
  calculateWidgetRect,
  calculatePosListByAngle,
  calculateTargetPoint,
} from './LineWidget.helpers';
import { LineWidgetToolbarMenu } from './LineWidgetToolbar';
import { LineWidgetControlKeyboardShortcuts } from './LineWidgetControlKeyboardShortcuts';
import { Key } from '../../constants/keyboard';
import { useFlowCoreValue } from 'modules/Editor/components/FlowCore';
import { usePrevious } from 'hooks/usePrevious';
import { OnChangeEventTypes } from 'types/flowCore.types';

const LineWidget = (): ReactElement => {
  const {
    leftPx,
    topPx,
    widthPx,
    heightPx,
    startPos,
    midPosList,
    endPos,
    type,
    strokeWidth,
    strokeColor,
    strokeDashType,
    startArrowStyle,
    endArrowStyle,
    rotateDeg,
    widgetId,
    startPort,
    endPort,
    updateWidget,
  } = useWidget<LineWidgetData>();

  const [delta, setDelta] = useState<DeltaPos>(DEFAULT_DELTA_POS);
  const posListProps = useMemo(() => mergePosList(startPos, midPosList, endPos), [startPos, midPosList, endPos]);
  const [posListState, setPosListState] = useState(posListProps);
  const prevPosListProps = usePrevious(posListState);
  const [activeHandlerIndex, setActiveHandlerIndex] = useState<number>(-1);
  const [widgetState, setWidgetState] = useState(WidgetState.Default);

  const {
    zoom,
    isWidgetSelected,
    isGroupMember,
    setWidgetFocus,
    blur,
    enableEditorKeyboardShortcuts,
    disableEditorKeyboardShortcuts,
  } = useEditor();

  const handlerSize = useMemo(() => getHandleSize(zoom), [zoom]);
  const Line = useMemo(() => LINE_TYPE_MAP[type] as React.ElementType, [type]);
  const LineHandler = useMemo(() => LINE_HANDLER_MAP[type] as React.ElementType, [type]);

  const isPosListStateUpdated = useMemo(() => prevPosListProps !== posListState, [prevPosListProps, posListState]);
  const posList = useMemo(() => {
    let result = isPosListStateUpdated ? posListState : posListProps;

    if (rotateDeg !== 0) {
      result = calculatePosListByAngle(widthPx, heightPx, result, rotateDeg);
    }

    return result;
  }, [rotateDeg, widthPx, heightPx, isPosListStateUpdated, posListProps, posListState]);

  const flowCoreEvent = useFlowCoreValue('flowCoreEvent');

  const calculateDelta = useCallback(
    (matrix: DOMMatrix, target: HTMLElement): DeltaPos => {
      const observingWidgetId = target.id;
      const isStartPort = startPort?.widgetId === observingWidgetId;
      const isEndPort = endPort?.widgetId === observingWidgetId;
      const targetPortData = isStartPort ? startPort : isEndPort ? endPort : null;

      const targetIndex = isStartPort ? 0 : isEndPort ? posList.length - 1 : null;
      if (targetIndex === null || targetPortData === null) return DEFAULT_DELTA_POS;

      const targetPoint = calculateTargetPoint(target, matrix, targetPortData);
      const linePoint = [leftPx + posList[targetIndex].xPx, topPx + posList[targetIndex].yPx];
      const customDelta = [targetPoint[0] - linePoint[0], targetPoint[1] - linePoint[1]];

      const result = {
        targetIndex,
        xPx: customDelta[0],
        yPx: customDelta[1],
      };
      return result;
    },
    [startPort, endPort, leftPx, topPx, posList],
  );

  // NOTE: Do not use 'delta'
  // Since the delta value is state so that it has the race condition issue with moveablajs events
  const generateLineWidgetData = useCallback(
    (matrix: DOMMatrix, target: HTMLElement) => {
      const calcDelta = calculateDelta(matrix, target);
      const result = calculateWidgetRect(leftPx, topPx, calcDelta, posList);
      setDelta(DEFAULT_DELTA_POS);
      return result;
    },
    [leftPx, topPx, posList, calculateDelta, setDelta],
  );

  // Subscribe this line widget events to the FlowCoreContext
  useEffect(() => {
    flowCoreEvent.onChange(widgetId, (type, matrix, target) => {
      if (type === OnChangeEventTypes.Update) {
        // Update: The event type that is called from the Mutation Callback when dragging the connected widget
        setDelta(calculateDelta(matrix, target));
      } else if (type === OnChangeEventTypes.Done) {
        // Done: A callback function called from onDragEnd or onResizeEnd, which calculates and returns the current line widget data.
        return generateLineWidgetData(matrix, target);
      }
    });
  }, [widgetId, flowCoreEvent, calculateDelta, generateLineWidgetData]);

  // Custom update data function for custom handlers of the line widget
  const handleUpdateData = useCallback(
    (data: LineWidgetData) => {
      updateWidget(data);
      setDelta(DEFAULT_DELTA_POS);
    },
    [updateWidget],
  );

  // Move custom handler through key event
  const handleKeyEvent = useCallback(
    (key: Key, isShift: boolean) => {
      const delta: DeltaPos = {
        targetIndex: activeHandlerIndex,
        ...getPosByKeyEvent(key, getStepByKeyEvent(isShift)),
      };
      const newWidgetData = calculateWidgetRect(leftPx, topPx, delta, posList);
      if (newWidgetData) {
        handleUpdateData(newWidgetData);
        setPosListState(mergePosList(newWidgetData.startPos, newWidgetData.midPosList, newWidgetData.endPos));
      }
    },
    [leftPx, topPx, posList, activeHandlerIndex, handleUpdateData],
  );

  // Custom onResize handler to update the arrow line positions to allow for live rendering
  const customOnResize = useCallback(
    ({ event, onResize }: CustomOnResize) => {
      // Ignore keyboard shortcut
      if (!event?.inputEvent) return;

      const ratio = event.width / widthPx;
      const scaledStartPos: Pos = calculatePosByRatio(startPos, ratio);
      const scaledMidPosList: Pos[] = midPosList.map((pos) => calculatePosByRatio(pos, ratio));
      const scaledEndPos: Pos = calculatePosByRatio(endPos, ratio);
      const scaledPosList: Pos[] = mergePosList(scaledStartPos, scaledMidPosList, scaledEndPos);
      const rotatedPosList = calculatePosListByAngle(widthPx, heightPx, scaledPosList, -rotateDeg);

      setPosListState(rotatedPosList);

      onResize(event);
    },
    [startPos, midPosList, endPos, widthPx, heightPx, rotateDeg],
  );

  // trigger onResizeEnd with resized pos data.
  const customOnResizeEnd = useCallback(
    ({ event, onResizeEnd }: CustomOnResizeEnd) => {
      // Ignore keyboard shortcut
      if (!event?.inputEvent) return;

      onResizeEnd(event, {
        startPos: getStartPos(posList),
        midPosList: getMidPosList(posList),
        endPos: getEndPos(posList),
      });
    },
    [posList],
  );

  /**
   * Do not trigger onRotateEnd to prevent to save from the bounding box event
   */
  const customOnRotateEnd = useCallback(
    ({ event, onRotateEnd, isGroup }: CustomOnRotateEnd) => {
      // For the group rotate event, use the rotate event in the bounding box
      if (isGroup) {
        onRotateEnd(event);
        return;
      }

      const angle = event.lastEvent.rotate;
      const newPosList = calculatePosListByAngle(widthPx, heightPx, posList, angle);
      const newWidgetData = calculateWidgetRect(leftPx, topPx, delta, newPosList);
      if (newWidgetData) {
        newWidgetData.rotateDeg = 0;
        handleUpdateData(newWidgetData);

        // Reset bounding box changes
        event.target.style.transform = '';
      }
    },
    [posList, delta, heightPx, widthPx, leftPx, topPx, handleUpdateData],
  );

  const handleFocus = useCallback(
    ({ moveNext, movePrev, index, isWidget }: SetFocusProps) => {
      // Reset the activeElement
      blur();

      // Change focus to the widget
      if (isWidget) {
        setWidgetFocus();
        setActiveHandlerIndex(-1);
        if (widgetState !== WidgetState.Active) setWidgetState(WidgetState.Active);
        return;
      }

      // Change focus to the custom handler
      if (moveNext) {
        const nextIndex = posList.length <= activeHandlerIndex + 1 ? 0 : activeHandlerIndex + 1;
        setActiveHandlerIndex(nextIndex);
      } else if (movePrev) {
        const prevIndex = activeHandlerIndex - 1 < 0 ? posList.length - 1 : activeHandlerIndex - 1;
        setActiveHandlerIndex(prevIndex);
      } else if (typeof index === 'number') {
        setActiveHandlerIndex(index);
      }
      setWidgetState(WidgetState.Edit);
    },
    [widgetState, activeHandlerIndex, posList, setWidgetFocus, blur],
  );

  /**
   * Change the widgetState and activeElement(focus) according to the isWidgetSelected
   * Default - Rendered widget without focusing
   * Active - Selected widget with focusing
   * Edit - Selected the custom handler with focusing
   */
  useEffect(() => {
    // Check whether to use key event according to the widgetState
    if (widgetState === WidgetState.Default || widgetState === WidgetState.Active) enableEditorKeyboardShortcuts();
    if (isWidgetSelected && widgetState === WidgetState.Edit) disableEditorKeyboardShortcuts();

    // Change the widgetState and initialize the handler index according to the current state
    if (!isWidgetSelected && widgetState !== WidgetState.Default) setWidgetState(WidgetState.Default);
    if (isWidgetSelected && widgetState === WidgetState.Default) {
      setWidgetState(WidgetState.Active);
      setActiveHandlerIndex(-1);
    }
  }, [isWidgetSelected, widgetState, enableEditorKeyboardShortcuts, disableEditorKeyboardShortcuts]);

  return (
    <WidgetBase
      onResize={customOnResize}
      onResizeEnd={customOnResizeEnd}
      onRotateEnd={customOnRotateEnd}
      disableSingleSelect
    >
      {/* pointerEvents is disabled to use the custom selection area in the line renderer */}
      <Box
        w='100%'
        h='100%'
        position='relative'
        data-testid='line-widget'
        pointerEvents='none'
        style={{ transform: isPosListStateUpdated ? 'rotate(0deg)' : `rotate(${-rotateDeg}deg)` }}
      >
        <WidgetToolbar>
          <LineWidgetToolbarMenu />
        </WidgetToolbar>
        {isWidgetSelected && (
          <LineWidgetControlKeyboardShortcuts
            setFocus={handleFocus}
            setWidgetState={setWidgetState}
            widgetState={widgetState}
            onKeyEvent={handleKeyEvent}
          />
        )}
        <Line
          posList={posList}
          widgetId={widgetId}
          widthPx={widthPx}
          heightPx={heightPx}
          delta={delta}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          strokeDashType={strokeDashType}
          startArrowStyle={startArrowStyle}
          endArrowStyle={endArrowStyle}
        />

        {/* Drag handler */}
        {isWidgetSelected && !isGroupMember && (
          <LineHandler
            widgetId={widgetId}
            posList={posList}
            leftPx={leftPx}
            topPx={topPx}
            delta={delta}
            zoom={zoom}
            handlerSize={handlerSize}
            activeHandlerIndex={activeHandlerIndex}
            startPort={startPort}
            endPort={endPort}
            setFocus={handleFocus}
            setDelta={setDelta}
            updateData={handleUpdateData}
          />
        )}
      </Box>
    </WidgetBase>
  );
};

const ReadOnlyLineWidget = ({ includeAltTextImg }: WidgetBaseProp): ReactElement => {
  const {
    widthPx,
    heightPx,
    startPos,
    midPosList,
    endPos,
    type,
    strokeWidth,
    strokeColor,
    strokeDashType,
    startArrowStyle,
    endArrowStyle,
    widgetId,
  } = useWidget<LineWidgetData>();

  const posList = useMemo(() => mergePosList(startPos, midPosList, endPos), [startPos, midPosList, endPos]);
  const Line = LINE_TYPE_MAP[type] as React.ElementType;

  return (
    <ReadOnlyWidgetBase>
      <Box w='100%' h='100%' position='relative' data-testid='line-widget'>
        {includeAltTextImg && <TransparentImg />}
        <Line
          posList={posList}
          widgetId={widgetId}
          widthPx={widthPx}
          heightPx={heightPx}
          delta={DEFAULT_DELTA_POS}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          strokeDashType={strokeDashType}
          startArrowStyle={startArrowStyle}
          endArrowStyle={endArrowStyle}
          isReadonly
        />
      </Box>
    </ReadOnlyWidgetBase>
  );
};

export { LineWidget, ReadOnlyLineWidget };
