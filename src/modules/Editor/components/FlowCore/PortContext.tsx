import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgetIds, selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import {
  NodeCreatorModalData,
  PortContextI,
  PortProviderProps,
  PortState,
  PortTypes,
  PortWrapperData,
} from 'types/flowCore.types';
import { WidgetType } from 'types/widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { useBoundingBox } from '../BoundingBox/useBoundingBox';
import { calculateAllParentWidgetOffset, getWidgetPosition } from 'utils/dom';
import { isBrowser } from 'constants/browser';

export const PortContext = createContext<PortContextI>({
  creatorPortData: null,
  connectorPortData: null,
  selectedPort: null,
  nodeModalData: null,
  setSelectedPort: () => {},
  render: () => {},
  clear: () => {},
  renderModal: () => {},
  closeModal: () => {},
});

/**
 * Manages state related to port rendering only
 *
 * @param {PortProviderProps}
 * @returns
 */
export const PortProvider = ({ children }: PortProviderProps): JSX.Element => {
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const { widgetRefs } = useBoundingBox();
  const [selectedPort, setSelectedPort] = useState<PortState | null>(null);
  const [creatorPortData, setCreatorPortData] = useState<PortWrapperData | null>(null);
  const [connectorPortData, setConnectorPortData] = useState<PortWrapperData | null>(null);
  const [nodeModalData, setNodeModalData] = useState<NodeCreatorModalData | null>(null);
  const isSingleSelect = useRef(false); // Use the useRef for the nextTick in the useEffect

  // Render the LineCreator or LineConnector port
  const handleRenderPort = useCallback(
    (targetElm: HTMLElement | null, type: PortTypes): void => {
      const widgetId = targetElm?.id;
      const isLineWidget = widgetId && getWidgetTypeFromId(widgetId) === WidgetType.Line;
      const isConnector = type === PortTypes.Connector;
      const resetPortConnector = isConnector && connectorPortData !== null && targetElm === null;
      const setPortData = isConnector ? setConnectorPortData : setCreatorPortData;
      let widgetPosition = null;

      if (targetElm === null) {
        if (isConnector) setPortData(widgetPosition);
        return;
      }

      // Calculate all parents offset for the group and responsive widget
      const wrapperPostiion = getWidgetPosition(targetElm);
      const parentOffset = calculateAllParentWidgetOffset(targetElm);
      wrapperPostiion.leftPx += parentOffset.leftPx;
      wrapperPostiion.topPx += parentOffset.topPx;
      if (widgetId && !isLineWidget && !resetPortConnector) {
        widgetPosition = {
          widgetId,
          position: wrapperPostiion,
        };
      }

      setPortData(widgetPosition);
    },
    [connectorPortData, setConnectorPortData],
  );

  // Reset the port rendering
  const resetPortContext = useCallback(() => {
    setSelectedPort(null);
    setCreatorPortData(null);
    setConnectorPortData(null);
    setNodeModalData(null);
  }, []);

  // Render line creator when the single widget is selected
  // In the BoundingBox event, it is difficult to control due to the Selecto and Moveable library race conditions
  useEffect(() => {
    isSingleSelect.current = activeWidgets.length === 1;
    if (!isSingleSelect.current) {
      resetPortContext();
      return;
    }

    const targetElement = widgetRefs[activeWidgetIds[0]]?.element;
    const widgetId = activeWidgetIds[0];
    const widgetType = getWidgetTypeFromId(widgetId);
    const isGroupWidget = widgetType === WidgetType.Group;
    const isLineWidget = widgetType === WidgetType.Line;
    if (isGroupWidget || isLineWidget) {
      resetPortContext();
      return;
    }

    // Use nextTick for undo/redo
    setTimeout(() => {
      if (!isSingleSelect.current) return;
      if (!targetElement) return;

      const targetPosition = getWidgetPosition(targetElement);

      // Safari browser has a bug regarding the width and height of the responsive widget
      // Chrome returns the rendered width and height via useResizeObserver but returns the width and height that is not updated in Safari
      if (isBrowser.SAFARI && widgetType === WidgetType.ResponsiveText) {
        const responsiveShapeElement = targetElement.querySelector('.widget-container svg') as SVGElement;
        if (responsiveShapeElement) {
          targetPosition.widthPx = responsiveShapeElement.getBoundingClientRect().width;
          targetPosition.heightPx = responsiveShapeElement.getBoundingClientRect().height;
        }
      }

      setCreatorPortData({
        widgetId: targetElement?.id,
        position: targetPosition,
      });
    }, 0);
  }, [activeWidgets, activeWidgetIds, widgetRefs, resetPortContext]);

  // Render the node creator modal component
  const handleRenderModal = useCallback(
    (nodeCreatorModalData: NodeCreatorModalData | null) => setNodeModalData(nodeCreatorModalData),
    [],
  );

  // Clear the node creator modal component
  const handleCloseModal = useCallback(() => setNodeModalData(null), []);

  const value = useMemo(
    () => ({
      connectorPortData,
      creatorPortData,
      selectedPort,
      nodeModalData,
      setSelectedPort,
      render: handleRenderPort,
      clear: resetPortContext,
      renderModal: handleRenderModal,
      closeModal: handleCloseModal,
    }),
    [
      connectorPortData,
      creatorPortData,
      selectedPort,
      nodeModalData,
      setSelectedPort,
      handleRenderPort,
      resetPortContext,
      handleRenderModal,
      handleCloseModal,
    ],
  );

  return <PortContext.Provider value={value}>{children}</PortContext.Provider>;
};
