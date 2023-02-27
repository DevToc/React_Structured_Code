import { useRef, useEffect, useState, useCallback, createRef, RefObject } from 'react';
import { OnDragStart, OnDrag, OnDragEnd } from 'react-moveable';
import styled from '@emotion/styled';

import { DragHandler } from '../../../modules/common/components/DragHandler';
import { Pos, DeltaPos } from '../LineWidget.types';
import { DragHandlerProps } from '../LineWidget.types';
import { PortTypes } from 'types/flowCore.types';
import { DEFAULT_DELTA_POS, HANDLER_PADDING } from '../LineWidget.config';
import { useFlowCoreValue, usePortRender, usePortValue } from 'modules/Editor/components/FlowCore';
import { calculateTargetPoint, calculateWidgetRect, getClosestPosByAngle } from '../LineWidget.helpers';

import { detectPortElement, detectWidgetElement, getDOMMatrix, getParentWidgetElement } from 'utils/dom';

interface HandleProps {
  left: number;
  top: number;
  width: number;
  height: number;
  border: string;
}

const HandleWrapper = styled.div`
  position: absolute;
  background-color: transparent;
  z-index: var(--vg-zIndices-lineWidgetHandle);
`;
const Handle = styled.div<HandleProps>`
  background-color: #fff;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border: ${(props) => props.border};

  &:focus {
    outline: unset;
    box-shadow: var(--vg-shadows-outline);
  }
`;

export const Straight = ({
  widgetId,
  leftPx,
  topPx,
  startPort,
  endPort,
  posList = [],
  zoom,
  handlerSize,
  activeHandlerIndex,
  setFocus,
  setDelta,
  updateData,
}: DragHandlerProps) => {
  const targetElmRefs = useRef<RefObject<HTMLDivElement>[]>(posList.map(() => createRef()));
  const targetHandlerElmRefs = useRef<RefObject<HTMLDivElement>[]>(posList.map(() => createRef()));
  const [, updateState] = useState<object>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const lastDelta = useRef<DeltaPos>(DEFAULT_DELTA_POS);
  const [renderPort, clearPort] = usePortRender();
  const selectedPort = usePortValue('selectedPort');
  const isFlowModeEnabled = useFlowCoreValue('isEnabled');

  // Return the current target index by using the element.
  const getTargetIndex = useCallback(
    (element: HTMLElement | SVGElement): number => {
      return targetHandlerElmRefs.current.findIndex((targetElm) => {
        return targetElm.current === element;
      });
    },
    [targetHandlerElmRefs],
  );

  // Return the string of current direction using the handler index
  const getCurrentDirection = useCallback(
    (index: number): string => (index === 0 ? 'start' : index === posList.length - 1 ? 'end' : ''),
    [posList],
  );

  const handleFocus = (activeHandlerIndex: number) => {
    const targetElement = targetElmRefs.current[activeHandlerIndex]?.current as HTMLDivElement;
    if (!targetElement) return;

    if (activeHandlerIndex >= 0) {
      targetElement.focus();
    } else {
      targetElement.blur();
    }
  };

  /**
   * Custom handler events
   */
  const handleDragStart = useCallback(
    (e: OnDragStart) => {
      setFocus({ index: getTargetIndex(e.target) });
      handleFocus(getTargetIndex(e.target));
    },
    [setFocus, getTargetIndex],
  );

  const handleDrag = useCallback(
    (e: OnDrag, translate: OnDrag['translate']) => {
      const targetIndex = getTargetIndex(e.target);
      if (targetIndex < 0) return;

      lastDelta.current = {
        targetIndex: targetIndex,
        xPx: translate[0],
        yPx: translate[1],
      };

      if (e.inputEvent.shiftKey) {
        const targetPos = getClosestPosByAngle(posList, targetIndex, translate);

        if (targetPos) {
          lastDelta.current.xPx = targetPos.xPx;
          lastDelta.current.yPx = targetPos.yPx;
          e.target.style.transform = `translate(${lastDelta.current.xPx}px, ${lastDelta.current.yPx}px)`;
        }
      }

      setDelta(lastDelta.current);

      if (!isFlowModeEnabled) return;

      // Rendering port connector
      const targetWidgetBaseElement = detectWidgetElement(e.clientX, e.clientY);
      const portElement = detectPortElement(e.clientX, e.clientY);

      // Ignore port rendering when trying to connect itself
      const connectedWidgetId = targetIndex === 0 ? endPort?.widgetId : startPort?.widgetId;
      const ignorePortRenderItself = connectedWidgetId && connectedWidgetId === targetWidgetBaseElement?.id;
      if (!portElement) {
        let targetElement = targetWidgetBaseElement && !ignorePortRenderItself ? targetWidgetBaseElement : null;

        // Responsive widget use the root widget as target.
        if (targetElement) {
          const responsiveWidgetElement = getParentWidgetElement(targetElement);
          targetElement = responsiveWidgetElement || targetElement;
        }

        renderPort(targetElement, PortTypes.Connector);
      }
    },
    [setDelta, posList, startPort, endPort, isFlowModeEnabled, getTargetIndex, renderPort],
  );

  const handleDragEnd = useCallback(
    (e: OnDragEnd) => {
      const isStartArrow = activeHandlerIndex === 0;
      const isEndArrow = activeHandlerIndex === posList.length - 1;

      // If the port exists, update the delta value so that the arrow moves to the center of the port
      if (selectedPort) {
        const targetWidgetElement = document
          .querySelector('.page-container')
          ?.querySelector(`.widget-container[id="${selectedPort.widgetId}"]`) as HTMLDivElement;
        const matrix = getDOMMatrix(targetWidgetElement);
        const portPos = calculateTargetPoint(targetWidgetElement, matrix, selectedPort);
        const posIndex = isStartArrow ? 0 : isEndArrow ? posList.length - 1 : -1;
        if (posIndex >= 0) {
          const offsetX = posList[posIndex].xPx + lastDelta.current.xPx + leftPx - portPos[0];
          const offsetY = posList[posIndex].yPx + lastDelta.current.yPx + topPx - portPos[1];
          lastDelta.current.xPx -= offsetX;
          lastDelta.current.yPx -= offsetY;
        }
      }

      let result = calculateWidgetRect(leftPx, topPx, lastDelta.current, posList);
      if (!result) return;

      result.rotateDeg = 0; // Reset rotate value

      e.target.style.transform = '';

      // Set the selected port data
      if (result && selectedPort) {
        let linePortData = {
          widgetId: selectedPort.widgetId,
          alignment: selectedPort.alignment,
          side: selectedPort.side,
        };

        if (isStartArrow) result.startPort = linePortData;
        if (isEndArrow) result.endPort = linePortData;
      } else {
        if (isStartArrow) result.startPort = null;
        if (isEndArrow) result.endPort = null;
      }

      clearPort();
      updateData(result);

      lastDelta.current = DEFAULT_DELTA_POS;
    },
    [leftPx, topPx, posList, updateData, activeHandlerIndex, selectedPort, clearPort],
  );

  useEffect(() => {
    handleFocus(activeHandlerIndex);
  }, [targetElmRefs, activeHandlerIndex]);

  // If useRef is used as an array, re-rendering does not work.
  // Therefore, it triggers a re-render manually when targetElmRefs changed.
  useEffect(() => {
    forceUpdate();
  }, [targetElmRefs, forceUpdate]);

  useEffect(() => {
    if (activeHandlerIndex >= 0) {
      (targetElmRefs.current[activeHandlerIndex]?.current as HTMLDivElement)?.focus();
    } else {
      (targetElmRefs.current[activeHandlerIndex]?.current as HTMLDivElement)?.blur();
    }
  }, [targetElmRefs, activeHandlerIndex]);

  return (
    <>
      {posList.map((pos: Pos, idx: number) => (
        <div key={`${widgetId}-${idx}`}>
          <HandleWrapper
            ref={targetHandlerElmRefs.current[idx]}
            style={{
              left: `${pos.xPx - handlerSize / 2 - HANDLER_PADDING}px`,
              top: `${pos.yPx - handlerSize / 2 - HANDLER_PADDING}px`,
              padding: `${HANDLER_PADDING}px`,
              width: `${handlerSize + HANDLER_PADDING * 2}px`,
              height: `${handlerSize + HANDLER_PADDING * 2}px`,
            }}
          >
            <Handle
              data-testid={'linewidget-customhandler'}
              ref={targetElmRefs.current[idx]}
              data-handler-direction={getCurrentDirection(idx)}
              data-handler-index={idx}
              tabIndex={-1}
              border={`${1 / zoom}px #4af solid`}
              left={pos.xPx - handlerSize / 2}
              top={pos.yPx - handlerSize / 2}
              width={handlerSize}
              height={handlerSize}
            ></Handle>
          </HandleWrapper>

          {targetElmRefs.current[idx].current ? (
            <DragHandler
              targetRef={targetHandlerElmRefs.current[idx]}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              zoom={zoom}
            />
          ) : null}
        </div>
      ))}
    </>
  );
};

export default Straight;
