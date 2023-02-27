import { createRef, memo, MouseEvent, ReactElement, RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { DragHandler } from 'modules/common/components/DragHandler';
import { addNewWidget, useAppDispatch } from 'modules/Editor/store';
import { OnDrag, OnDragEnd, OnDragStart } from 'react-moveable';
import { PortRendererProps, PortTypes } from 'types/flowCore.types';
import { detectPortElement, detectWidgetElement, getDOMMatrix, getParentWidgetElement } from 'utils/dom';
import Straight from 'widgets/LineWidget/LineRenders/Straight';
import { DEFAULT_DELTA_POS } from 'widgets/LineWidget/LineWidget.config';
import { calculateTargetPoint, calculateWidgetRect, generateDefaultData } from 'widgets/LineWidget/LineWidget.helpers';
import { Alignment, DeltaPos, LineWidgetTypes, Side } from 'widgets/LineWidget/LineWidget.types';
import { generateWrapperStyle, getWrapperOffset } from '../FlowCore.helpers';
import { useNodeModalRender, usePortRender, usePortValue } from '../FlowModeAPI';
import { CREATOR_HANDLE_SELECTOR_SIZE, HANDLE_ICON_SIZE, HANDLE_SIDE_LIST, LINE_CREATOR_PADDING } from '../Port.config';
import PortSelector from './PortSelector';
import PortWrapper from './PortWrapper';
import { ReactComponent as PlusCircleIcon } from 'assets/icons/plusCircle.svg';
import { ReactComponent as PlusCircleOutlineIcon } from 'assets/icons/plusCircleOutline.svg';
import { usePrevious } from 'hooks/usePrevious';

// NOTE: It's only for the straight line.
// This default posList constant value will be refactored when I implement a stepped or curved line
const DEFAULT_POS_LIST = [
  { xPx: 0, yPx: 0 },
  { xPx: 0, yPx: 0 },
];

function LineCreator({ zoom }: PortRendererProps): ReactElement {
  const [renderNodeModal, closeNodeModal] = useNodeModalRender();
  const dispatch = useAppDispatch();

  const [delta, setDelta] = useState<DeltaPos>(DEFAULT_DELTA_POS);
  const [isHover, setIsHover] = useState(false);

  const targetHandlerElmRefs = useRef<RefObject<HTMLDivElement>[]>(HANDLE_SIDE_LIST.map(() => createRef()));
  const currentSide = useRef<Side | null>(null);
  const isDragging = useRef(false);
  const showNodeCreatorModal = useRef(false);

  // PortContext
  const portData = usePortValue('creatorPortData');
  const lastPortData = usePrevious(portData);
  const selectedPort = usePortValue('selectedPort');
  const [renderPort, clearPort] = usePortRender();

  if (currentSide.current && portData !== lastPortData) {
    showNodeCreatorModal.current = false;
    currentSide.current = null;
  }

  // Generate the port wrapper positions using the portData.position
  const sideHandlerList = useMemo(
    () =>
      portData
        ? HANDLE_SIDE_LIST.map((side) => ({
            side,
            style: generateWrapperStyle(portData.position, side, zoom),
            styleWithPadding: generateWrapperStyle(portData.position, side, zoom, LINE_CREATOR_PADDING / zoom),
            offset: getWrapperOffset(portData.position, side, zoom, LINE_CREATOR_PADDING / zoom),
          }))
        : [],
    [portData, zoom],
  );

  const handleDragStart = useCallback(
    (e: OnDragStart) => {
      isDragging.current = true;

      const portSide = e.target.dataset?.portSide as Side;
      if (!portSide) return e.stopDrag();

      e.target.style.pointerEvents = 'none';

      currentSide.current = portSide;
      setDelta(DEFAULT_DELTA_POS);

      closeNodeModal();
    },
    [closeNodeModal],
  );

  const handleDrag = useCallback(
    (e: OnDrag, translate: OnDrag['translate']) => {
      const selectedHandler = sideHandlerList.find((data) => data.side === currentSide.current);
      if (!portData || !selectedHandler) return e.stopDrag();

      // Detect widget elements that require port rendering
      const targetWidgetBaseElement = detectWidgetElement(e.clientX, e.clientY);
      const portElement = detectPortElement(e.clientX, e.clientY);

      // Ignore port rendering when trying to connect itself
      const ignoreConnectorWidget = portData.widgetId === targetWidgetBaseElement?.id;
      if (!portElement) {
        let targetElement = targetWidgetBaseElement && !ignoreConnectorWidget ? targetWidgetBaseElement : null;

        // Responsive widget use the root widget as target.
        if (targetElement) {
          const responsiveWidgetElement = getParentWidgetElement(targetElement);
          targetElement = responsiveWidgetElement || targetElement;
        }
        renderPort(targetElement, PortTypes.Connector);
      }

      // Update line path
      setDelta({
        targetIndex: DEFAULT_POS_LIST.length - 1,
        xPx: translate[0] + selectedHandler.offset.xPx,
        yPx: translate[1] + selectedHandler.offset.yPx,
      });
    },
    [sideHandlerList, portData, renderPort, currentSide],
  );

  const handleDragEnd = useCallback(
    (e: OnDragEnd) => {
      const selectedHandler = sideHandlerList.find((data) => data.side === currentSide.current);
      if (!(selectedHandler && delta && currentSide.current && DEFAULT_POS_LIST && portData)) return;

      const originStyle = generateWrapperStyle(portData.position, currentSide.current);
      const originWrapperPos = {
        xPx: parseInt(originStyle.left as string),
        yPx: parseInt(originStyle.top as string),
      };

      // If the port exists, update the delta value so that the arrow moves to the center of the port
      let scaledDelta = {
        targetIndex: delta.targetIndex,
        xPx: delta.xPx / zoom,
        yPx: delta.yPx / zoom,
      };

      if (selectedPort) {
        const targetWidgetElement = document.querySelector(
          `.page-container .widget-container[id="${selectedPort.widgetId}"]`,
        ) as HTMLDivElement;
        if (targetWidgetElement) {
          const matrix = getDOMMatrix(targetWidgetElement);
          const portPos = calculateTargetPoint(targetWidgetElement, matrix, selectedPort);
          const lastPosIndex = portPos.length - 1;
          const offsetX = DEFAULT_POS_LIST[lastPosIndex].xPx + scaledDelta.xPx + originWrapperPos.xPx - portPos[0];
          const offsetY = DEFAULT_POS_LIST[lastPosIndex].yPx + scaledDelta.yPx + originWrapperPos.yPx - portPos[1];

          scaledDelta.xPx -= offsetX;
          scaledDelta.yPx -= offsetY;
        }
      }

      const lineWidgetData = calculateWidgetRect(
        originWrapperPos.xPx,
        originWrapperPos.yPx,
        scaledDelta,
        DEFAULT_POS_LIST,
      );
      const widgetData = generateDefaultData(LineWidgetTypes.straight, {
        ...lineWidgetData,
        startPort: {
          widgetId: portData.widgetId,
          alignment: Alignment.CENTER,
          side: currentSide.current,
        },
        endPort: selectedPort,
      });

      if (widgetData && selectedPort) {
        // If there is a port that can be connected, add a new line
        dispatch(addNewWidget(widgetData));

        // Reset
        currentSide.current = null;
        setDelta(DEFAULT_DELTA_POS);
        clearPort();
      } else {
        // Render the new widget creator modal if there is no port to connect
        if (!selectedPort) {
          const endX = lineWidgetData.leftPx + lineWidgetData.endPos.xPx;
          const endY = lineWidgetData.topPx + lineWidgetData.endPos.yPx;
          renderNodeModal({
            widgetId: portData.widgetId,
            position: {
              leftPx: endX,
              topPx: endY,
              widthPx: 0,
              heightPx: 0,
            },
            lineWidgetData: widgetData,
          });

          showNodeCreatorModal.current = true;
        }
      }

      isDragging.current = false;
    },
    [zoom, delta, portData, selectedPort, currentSide, sideHandlerList, dispatch, clearPort, renderNodeModal],
  );

  // Manage hover state
  const handleMouseOut = () => setIsHover(false);
  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    const portSide = e.currentTarget.dataset?.portSide as Side;
    if (!portSide || showNodeCreatorModal.current || isDragging.current) return;

    // Update currentSide
    if (currentSide.current !== portSide) currentSide.current = portSide;

    // Initilize the last delta state
    setDelta(DEFAULT_DELTA_POS);
    setIsHover(true);
  };

  return (
    <Box>
      {sideHandlerList.map(({ side, style, styleWithPadding }, index) => (
        <div key={side}>
          {
            <div>
              <PortWrapper
                ref={targetHandlerElmRefs.current[index]}
                style={styleWithPadding}
                data-port-side={side}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                {!isDragging.current && !showNodeCreatorModal.current && (
                  <Box
                    position='absolute'
                    color='upgrade.blue.500'
                    left={`${(-HANDLE_ICON_SIZE - 1) / 2}px`}
                    top={`${(-HANDLE_ICON_SIZE - 1) / 2}px`}
                    width={`${HANDLE_ICON_SIZE}px`}
                    height={`${HANDLE_ICON_SIZE}px`}
                  >
                    {isHover && currentSide.current === side ? (
                      <PlusCircleIcon width='100%' height='100%' />
                    ) : (
                      <PlusCircleOutlineIcon width='100%' height='100%' />
                    )}
                  </Box>
                )}
                <PortSelector data-port-side={side} size={CREATOR_HANDLE_SELECTOR_SIZE} />
              </PortWrapper>

              {targetHandlerElmRefs.current[index] ? (
                <DragHandler
                  targetRef={targetHandlerElmRefs.current[index]}
                  onDragStart={handleDragStart}
                  onDrag={handleDrag}
                  onDragEnd={handleDragEnd}
                  enableSmartGuide={false}
                />
              ) : null}
            </div>
          }
          <PortWrapper key={side} style={style}>
            {side === currentSide.current && (
              <Straight
                posList={DEFAULT_POS_LIST}
                delta={isDragging.current || showNodeCreatorModal.current ? delta : DEFAULT_DELTA_POS}
                strokeWidth={3 * zoom}
                strokeColor={'black'}
                strokeDashType={'solid'}
                startArrowStyle={'none'}
                endArrowStyle={'none'}
              ></Straight>
            )}
          </PortWrapper>
        </div>
      ))}
    </Box>
  );
}

export default memo(LineCreator);
