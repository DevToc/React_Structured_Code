import { memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import isEqual from 'lodash.isequal';

import { detectPortElement, detectWidgetElement } from 'utils/dom';
import { Side } from 'widgets/LineWidget/LineWidget.types';
import { generatePortState, generateWrapperStyle } from '../FlowCore.helpers';
import { usePortValue, useSelectedPortState } from '../FlowModeAPI';
import { PORT_SELECTOR_CLASS } from 'constants/bounding-box';
import { CONNECTOR_HANDLE_SELECTOR_SIZE, HANDLE_HOVER_SIZE, HANDLE_SIDE_LIST, HANDLE_SIZE } from '../Port.config';
import PortWrapper from './PortWrapper';
import PortSelector from './PortSelector';
import Port from './Port';
import { PortRendererProps, PortState } from 'types/flowCore.types';

function LineConnector({ zoom }: PortRendererProps): ReactElement {
  const portData = usePortValue('connectorPortData');
  const [selectedPort, setSelectedPort] = useSelectedPortState();
  const lastSelectedPort = useRef<PortState | null>(null);
  const mouseMoveEvent = useRef((e: MouseEvent) => {});
  const sideHandlerList = useMemo(
    () =>
      portData
        ? HANDLE_SIDE_LIST.map((side) => ({
            side,
            style: generateWrapperStyle(portData.position, side, zoom),
          }))
        : [],
    [portData, zoom],
  );

  // MouseEnter
  const handleMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      lastSelectedPort.current = null;
      const portSide = e.currentTarget.dataset?.portSide;

      if (portData && portSide && Object.values(Side).includes(portSide as Side)) {
        // Create event
        window.removeEventListener('mousemove', mouseMoveEvent.current, true);

        const mouseMoveEventFn = (e: MouseEvent) => {
          // Detect widget elements that require port rendering
          const targetWidgetBaseElement = detectWidgetElement(e.clientX, e.clientY);
          const portElement = detectPortElement(e.clientX, e.clientY);

          const isMouseEnter = !!(portElement && targetWidgetBaseElement);
          const isMouseLeave = !portElement;

          if (isMouseEnter) {
            const currentSide = portElement?.dataset?.portSide as Side;
            const portState = generatePortState(currentSide, portData.widgetId);
            if (isEqual(lastSelectedPort.current, portState)) return;

            lastSelectedPort.current = portState;
            setSelectedPort(portState);
          } else if (isMouseLeave) {
            if (lastSelectedPort.current === null) return;

            setSelectedPort(null);
          }
        };
        mouseMoveEvent.current = mouseMoveEventFn;

        const removeMouseEventFn = () => {
          window.removeEventListener('mousemove', mouseMoveEventFn, true);
          window.removeEventListener('mouseup', removeMouseEventFn, true);
        };
        window.addEventListener('mousemove', mouseMoveEventFn, true);
        window.addEventListener('mouseup', removeMouseEventFn, true);
      } else {
        // reset
        window.removeEventListener('mousemove', mouseMoveEvent.current, true);
      }
    },
    [portData, setSelectedPort],
  );

  return (
    <Box>
      {sideHandlerList.map(({ side, style }) => (
        <PortWrapper key={side} style={style}>
          <Port
            size={selectedPort?.side === side ? HANDLE_HOVER_SIZE : HANDLE_SIZE}
            isHover={selectedPort?.side === side}
          />
          <PortSelector
            data-port-side={side}
            size={CONNECTOR_HANDLE_SELECTOR_SIZE}
            className={PORT_SELECTOR_CLASS}
            onMouseOver={handleMouseOver}
          />
        </PortWrapper>
      ))}
    </Box>
  );
}

export default memo(LineConnector);
