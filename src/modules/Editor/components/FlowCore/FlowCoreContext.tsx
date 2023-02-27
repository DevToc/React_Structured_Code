import { createContext, useRef, useCallback, useMemo, useState, useEffect } from 'react';
import clonedeep from 'lodash.clonedeep';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useBoundingBox } from '../BoundingBox/useBoundingBox';
import { selectActiveWidgetIds } from '../../store/widgetSelector';
import {
  ConnectedWidgetData,
  FlowCoreContextI,
  FlowCoreProviderProps,
  GetConnectedLinesType,
  OnChangeEvent,
  OnChangeEventTypes,
  SubscriptionType,
  UpdateLineWidget,
} from 'types/flowCore.types';
import { getConnectedLineDatas, getConnectedLineElements, getConnectedWidgetData } from './FlowCore.helpers';
import {
  MUTATION_OBSERVER_CONFIG,
  MUTATION_OBSERVER_CONFIG_WITH_SUBTREE,
  OBSERVING_SUBTREE_WIDGET_LIST,
  RESPONSIVE_WIDGET_LIST,
} from './FlowCore.config';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { AllWidgetData, NewWidget } from 'widgets/Widget.types';
import { usePrevious } from 'hooks/usePrevious';
import { WIDGETBASE_CLASS } from 'constants/bounding-box';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { addNewWidget } from 'modules/Editor/store';
import { selectWidgets } from 'modules/Editor/store/infographSelector';
import { getDOMMatrix, getParentWidgetElement } from 'utils/dom';
import { WidgetId } from 'types/idTypes';
import WidgetObserverManager from './WidgetObserverManager';
import { useHistory } from 'modules/Editor/store/history/historyManager';
import { Alignment, LineWidgetData, Side } from 'widgets/LineWidget/LineWidget.types';
import { WidgetsMap } from 'types/infographTypes';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';
import { getClipboardGroupWidgets } from '../Clipboard/Clipboard.helpers';

export const FlowCoreContext = createContext<FlowCoreContextI>({
  isEnabled: false,
  isObserving: false,
  flowCoreEvent: { onChange: () => {} },
  start: () => {},
  stop: () => {},
  setIsEnabled: () => {},
  getConnectedLines: () => [],
  duplicateWidget: () => {},
});

export const FlowCoreProvider = ({ children }: FlowCoreProviderProps): JSX.Element => {
  const [isEnabled, setIsEnabled] = useState(false);
  const lastIsEnabled = usePrevious(isEnabled);
  const [isObserving, setIsObserving] = useState(false);
  const observerManagerInstance = useRef<WidgetObserverManager>(new WidgetObserverManager(MUTATION_OBSERVER_CONFIG));
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const widgets = useAppSelector(selectWidgets);
  const activePageId = useAppSelector(selectActivePage);
  const lastActivePageId = usePrevious(activePageId);
  const { widgetRefs } = useBoundingBox();

  const { getStore } = useHistory();

  const dispatch = useAppDispatch();

  const subscriptionList = useRef<SubscriptionType[]>([]);

  const flowCoreEvent = useMemo(() => {
    return {
      onChange: (widgetId: WidgetId, callback: OnChangeEvent) => {
        const subscriber = subscriptionList.current.find(([subWidgetId]) => subWidgetId === widgetId);
        if (subscriber) {
          subscriber[1] = callback;
        } else {
          subscriptionList.current.push([widgetId, callback]);
        }
      },
    };
  }, []);

  // Filter the removed widget data
  const widgetIds = Object.keys(widgetRefs);
  const renderedWidgets = Object.keys(widgets)
    .filter((widgetId) => widgetIds.includes(widgetId))
    .reduce((prev: WidgetsMap, cur: WidgetId) => {
      prev[cur] = widgets[cur];
      return prev;
    }, {});
  const connectedLineData = getConnectedLineDatas(renderedWidgets);
  const connectedLineElements = getConnectedLineElements(renderedWidgets, widgetRefs);
  const connectedWidgetData = useMemo<ConnectedWidgetData[]>(
    () => getConnectedWidgetData(renderedWidgets, connectedLineData),
    [connectedLineData, renderedWidgets],
  );

  // Calculate the matrix of the target using mutationObserver, and trigger callback to the updateConnectedLine of the connected line widget.
  const mutationCallback = useCallback<MutationCallback>(
    (mutationList) => {
      if (mutationList.length) {
        // Since this is an asynchronous function to use getComputedStyled() for single element
        // so only the first record will be executed when it triggered
        const mutation = mutationList[0];
        if (!['attributes', 'childList', 'characterData'].includes(mutation.type)) return;

        let target = mutation.target;
        switch (mutation.type) {
          case 'characterData':
            // For OBSERVING_SUBTREE_WIDGET_LIST
            const parentElement = target.parentElement as HTMLElement;
            target = parentElement.closest(`.${WIDGETBASE_CLASS}`) as HTMLElement;

            break;
          case 'attributes':
          case 'childList':
            // Get widget base for table, text widget that is using subtree: true
            if (!(target as HTMLElement).classList.contains(WIDGETBASE_CLASS)) {
              target = (target as HTMLElement).closest(`.${WIDGETBASE_CLASS}`) as HTMLElement;
            }
            break;
        }

        if (!(target instanceof HTMLElement)) return;

        const widgetId = target.id;

        const allTargetWidgetData = observerManagerInstance.current.getAllByParentWidgetId(widgetId);
        if (!allTargetWidgetData) return;

        const matrix = getDOMMatrix(target);

        allTargetWidgetData.forEach((targetWidgetData) => {
          connectedLineData[targetWidgetData.widgetId].forEach((lineWidgetId) => {
            const subscriber = subscriptionList.current.find(([widgetId]) => widgetId === lineWidgetId);
            if (subscriber && typeof subscriber?.[1] === 'function') {
              const setDelta = subscriber[1];
              setDelta(OnChangeEventTypes.Update, matrix, targetWidgetData.element);
            }
          });
        });
      }
    },
    [connectedLineData],
  );

  const handleGetConnectedLines = useCallback<GetConnectedLinesType>(
    (widgetId, target): UpdateLineWidget[] => {
      if (!isEnabled) return [];

      const connectedLineIds = connectedLineData?.[widgetId];
      if (!connectedLineIds || connectedLineIds.length === 0) return [];

      // Generate line data
      const removeSelectedLine = (lineWidgetId: string) => !activeWidgetIds.includes(lineWidgetId);
      const getSubscriber = (lineWidgetId: string): SubscriptionType =>
        subscriptionList.current.find(([widgetId]) => widgetId === lineWidgetId) as SubscriptionType;
      const matrix = getDOMMatrix(target as HTMLElement);
      const result = connectedLineIds
        .filter(removeSelectedLine) // For handling multi selection
        .map(getSubscriber)
        .filter((subscriber) => subscriber)
        .map(([widgetId, generateLineWidgetData]) => ({
          widgetId: widgetId,
          widgetData: generateLineWidgetData(OnChangeEventTypes.Done, matrix, target) as LineWidgetData,
        }));

      return result;
    },
    [isEnabled, activeWidgetIds, connectedLineData],
  );

  // Manage separately to change the observing state according to the bounding box event
  // boundingBox._moveable.isDragging() is function so it's hard to track the updated isDragging state
  const handleSetIsObserving = useCallback(
    (value: boolean) => {
      if (!isEnabled) return;

      setIsObserving(value);
    },
    [isEnabled, setIsObserving],
  );

  // Duplicate the widget data
  const handleDuplicateWidget = useCallback(
    (widgetId: WidgetId, lineWidgetData: NewWidget) => {
      const isResponsiveWidget = RESPONSIVE_WIDGET_LIST.includes(getWidgetTypeFromId(widgetId));

      const copiedWidget = clonedeep(renderedWidgets[widgetId]) as AllWidgetData;
      const newWidgetData = {
        widgetType: getWidgetTypeFromId(widgetId),
        widgetData: copiedWidget,
      };
      const newLineWidgetData = lineWidgetData;

      const startPort = (newLineWidgetData.widgetData as LineWidgetData).startPort;
      if (!startPort) return;

      // TODO: fix this comment: Calculate new position for newWidgetData
      // Will be flowTypePlugin
      const calculateNewWidgetPos = (newWidgetData: any, newLineWidgetData: any, side: Side) => {
        const lineEndX = newLineWidgetData.endPos.xPx + newLineWidgetData.leftPx;
        const lineEndY = newLineWidgetData.endPos.yPx + newLineWidgetData.topPx;
        let topPx = 0;
        let leftPx = 0;
        if (side === Side.EAST) {
          topPx = lineEndY - newWidgetData.heightPx / 2;
          leftPx = lineEndX - newWidgetData.widthPx;
        } else if (side === Side.WEST) {
          topPx = lineEndY - newWidgetData.heightPx / 2;
          leftPx = lineEndX;
        } else if (side === Side.NORTH) {
          topPx = lineEndY;
          leftPx = lineEndX - newWidgetData.widthPx / 2;
        } else if (side === Side.SOUTH) {
          topPx = lineEndY - newWidgetData.heightPx;
          leftPx = lineEndX - newWidgetData.widthPx / 2;
        }

        return {
          topPx,
          leftPx,
        };
      };
      const getOppositeSide = (side: Side): Side => {
        if (side === Side.EAST) {
          return Side.WEST;
        } else if (side === Side.WEST) {
          return Side.EAST;
        } else if (side === Side.NORTH) {
          return Side.SOUTH;
        } else if (side === Side.SOUTH) {
          return Side.NORTH;
        }
        return Side.CENTER;
      };

      const newPosition = calculateNewWidgetPos(
        newWidgetData.widgetData,
        newLineWidgetData.widgetData,
        getOppositeSide(startPort.side),
      );

      if (newPosition) {
        newWidgetData.widgetData.leftPx = newPosition.leftPx;
        newWidgetData.widgetData.topPx = newPosition.topPx;
      }

      // Unlock
      newWidgetData.widgetData.isLocked = false;

      let result: NewWidget | NewWidget[] = newWidgetData;

      if (isResponsiveWidget) {
        const groupMemberIds = (renderedWidgets[widgetId] as ResponsiveWidgetBaseData)?.memberWidgetIds;
        const groupWidgets = getClipboardGroupWidgets(groupMemberIds, widgetId, true, widgets);
        const newResponsiveWidgetData = {
          widgetType: getWidgetTypeFromId(widgetId),
          widgetData: copiedWidget,
          groupWidgets: groupWidgets,
          isResponsiveGroup: true,
        };
        result = [newResponsiveWidgetData];
      }

      dispatch(addNewWidget(result));

      // Fetch the added widget ID from the history to connect the line.
      const past = getStore()?.past;
      if (!past) return;
      const addedWidgetInfo = past[past.length - 1]?.patches.find((patch) => patch.path[0] === 'widgets')?.path;
      if (addedWidgetInfo) {
        (newLineWidgetData.widgetData as LineWidgetData).endPort = {
          widgetId: addedWidgetInfo[1] as WidgetId,
          side: getOppositeSide(startPort.side),
          alignment: Alignment.CENTER,
        };
        dispatch(addNewWidget(newLineWidgetData));
      }
    },
    [renderedWidgets, widgets, dispatch, getStore],
  );

  // Reset the observerManagerInstance when the flowMode disabled
  useEffect(() => {
    if (lastIsEnabled !== isEnabled && isEnabled === false) {
      observerManagerInstance?.current.reset();
    }
  }, [lastIsEnabled, isEnabled]);

  // Connect/Disconnect mutation observer regarding to the selected widget IDs
  useEffect(() => {
    if (!isEnabled) return;

    // Reset the observer manager instance
    if (lastActivePageId !== activePageId) {
      observerManagerInstance.current.reset();
      return;
    }

    // Ignore group or multi-selection
    const ignoreGroupSelection = activeWidgetIds
      .filter((widgetId) => connectedLineData?.[widgetId])
      .some((widgetId) => connectedLineData[widgetId].some((lineWidgetId) => activeWidgetIds.includes(lineWidgetId)));
    if (ignoreGroupSelection) {
      observerManagerInstance.current.disconnectAll();
      return;
    }

    activeWidgetIds.forEach((widgetId) => {
      // Check it exists in the observer manager
      if (!connectedLineData?.[widgetId]) return;
      const connectedLineIds = connectedLineData?.[widgetId];
      connectedLineIds.forEach((lineWidgetId) => {
        const isSubscribed = subscriptionList.current.some(([widgetId]) => widgetId === lineWidgetId);
        if (observerManagerInstance?.current && isSubscribed) {
          const element = widgetRefs[widgetId]?.element;
          const responsiveWidgetElement = getParentWidgetElement(element) ?? undefined;

          observerManagerInstance.current.add(
            widgetId,
            element,
            mutationCallback,
            responsiveWidgetElement,
            responsiveWidgetElement?.id,
          );
        }
      });

      if (isObserving) {
        // Observe widget when it calls startFlowMode()
        const hasConnectedLine = connectedLineIds?.length > 0;
        if (!hasConnectedLine) return;
        if (OBSERVING_SUBTREE_WIDGET_LIST.includes(getWidgetTypeFromId(widgetId))) {
          observerManagerInstance?.current?.observe(widgetId, MUTATION_OBSERVER_CONFIG_WITH_SUBTREE);
        } else {
          observerManagerInstance?.current?.observe(widgetId);
        }
      } else {
        // Update callback when it calls stopFlowMode()
        connectedLineIds.forEach((lineWidgetId) => {
          const isSubscribed = subscriptionList.current.some(([widgetId]) => widgetId === lineWidgetId);
          if (observerManagerInstance?.current && isSubscribed) {
            observerManagerInstance.current.setCallback(widgetId, mutationCallback);
          }
        });
      }
    });
  }, [
    isEnabled,
    isObserving,
    activePageId,
    lastActivePageId,
    activeWidgetIds,
    widgetRefs,
    connectedLineData,
    mutationCallback,
  ]);

  const value = useMemo(
    () => ({
      isEnabled,
      isObserving,
      connectedLineElements,
      connectedWidgetData,
      flowCoreEvent,
      setIsEnabled: setIsEnabled,
      setIsObserving: handleSetIsObserving,
      getConnectedLines: handleGetConnectedLines,
      start: () => handleSetIsObserving(true),
      stop: () => handleSetIsObserving(false),
      duplicateWidget: handleDuplicateWidget,
    }),
    [
      isEnabled,
      isObserving,
      connectedLineElements,
      connectedWidgetData,
      flowCoreEvent,
      setIsEnabled,
      handleSetIsObserving,
      handleGetConnectedLines,
      handleDuplicateWidget,
    ],
  );

  return <FlowCoreContext.Provider value={value}>{children}</FlowCoreContext.Provider>;
};
