import { CSSProperties } from 'react';
import {
  ConnectedLineData,
  ConnectedLineElements,
  ConnectedWidgetData,
  PortState,
  WrapperPos,
} from 'types/flowCore.types';
import { WidgetId } from 'types/idTypes';
import { WidgetsMap } from 'types/infographTypes';
import { Widget, WidgetType } from 'types/widget.types';
import { Alignment, LineWidgetData, Pos, Side } from 'widgets/LineWidget/LineWidget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { AllWidgetData } from 'widgets/Widget.types';
import { WidgetBoundingBoxRef } from '../BoundingBox/useBoundingBox/useBoundingBox.types';
import { BUTTON_GRID_WIDGET_PADDING_PX, BUTTON_GRID_WIDGET_PX } from './FlowCore.config';

/**
 * Return the top and left value of the port renderer
 * @param wrapperPosition
 * @param side
 * @returns {CSSProperties}
 */
export const generateWrapperStyle = (
  wrapperPosition: WrapperPos,
  side: Side,
  zoom: number = 1,
  padding: number = 0,
): CSSProperties => {
  let topPx = wrapperPosition.topPx;
  let leftPx = wrapperPosition.leftPx;
  let widthPx = wrapperPosition.widthPx;
  let heightPx = wrapperPosition.heightPx;

  switch (side) {
    case Side.NORTH:
      leftPx += widthPx / 2;
      topPx -= padding;
      break;

    case Side.EAST:
      leftPx += widthPx + padding;
      topPx += heightPx / 2;
      break;

    case Side.SOUTH:
      leftPx += widthPx / 2;
      topPx += heightPx + padding;
      break;

    case Side.WEST:
      leftPx -= padding;
      topPx += heightPx / 2;
      break;
  }

  return {
    top: `${topPx * zoom}px`,
    left: `${leftPx * zoom}px`,
  };
};

/**
 * Computes the offset of the LineCreator's padding style from the normal style.
 * @param wrapperPosition
 * @param side
 * @param zoom
 * @param padding
 * @returns
 */
export const getWrapperOffset = (
  wrapperPosition: WrapperPos,
  side: Side,
  zoom: number = 1,
  padding: number = 0,
): Pos => {
  const wrapperStyle = generateWrapperStyle(wrapperPosition, side, zoom);
  const wrapperWithPaddingStyle = generateWrapperStyle(wrapperPosition, side, zoom, padding);
  return {
    xPx: parseFloat(wrapperWithPaddingStyle.left as string) - parseFloat(wrapperStyle.left as string),
    yPx: parseFloat(wrapperWithPaddingStyle.top as string) - parseFloat(wrapperStyle.top as string),
  };
};
/**
 * Return the portState data by side and widget Id
 * @param side
 * @returns {PortState}
 */
export const generatePortState = (side: Side, widgetId: WidgetId): PortState => ({
  widgetId,
  side: side,
  alignment: Alignment.CENTER,
});

/**
 * Return the connected line data list as {key:data[]}
 * @param widgets
 * @returns {ConnectedLineData}
 */
export const getConnectedLineDatas = (widgets: WidgetsMap): ConnectedLineData => {
  return Object.entries(widgets)
    .filter(([widgetId]) => getWidgetTypeFromId(widgetId) === WidgetType.Line)
    .reduce((prev: ConnectedLineData, [widgetId, data]: [string, Widget | AllWidgetData]): ConnectedLineData => {
      const parsedData = data as LineWidgetData;
      if (parsedData?.startPort?.widgetId && typeof parsedData?.startPort?.widgetId === 'string') {
        prev[parsedData?.startPort?.widgetId]
          ? prev[parsedData?.startPort?.widgetId].push(widgetId)
          : (prev[parsedData?.startPort?.widgetId] = [widgetId]);
      }
      if (parsedData?.endPort?.widgetId) {
        prev[parsedData?.endPort?.widgetId]
          ? prev[parsedData?.endPort?.widgetId].push(widgetId)
          : (prev[parsedData?.endPort?.widgetId] = [widgetId]);
      }
      return prev;
    }, {});
};

/**
 * Return the connected line elements as {key:HTMLElement[]}
 * @param widgets
 * @param widgetRefs
 * @returns {ConnectedLineElements}
 */
export const getConnectedLineElements = (
  widgets: WidgetsMap,
  widgetRefs: WidgetBoundingBoxRef,
): ConnectedLineElements => {
  return Object.entries(widgets)
    .filter(([widgetId]) => getWidgetTypeFromId(widgetId) === WidgetType.Line && widgetRefs[widgetId]?.element)
    .reduce(
      (prev: ConnectedLineElements, [widgetId, data]: [string, Widget | AllWidgetData]): ConnectedLineElements => {
        const widgetElement = widgetRefs[widgetId]?.element;
        const parsedData = data as LineWidgetData;
        if (parsedData?.startPort?.widgetId && typeof parsedData?.startPort?.widgetId === 'string') {
          prev[parsedData?.startPort?.widgetId]
            ? prev[parsedData?.startPort?.widgetId].push(widgetElement)
            : (prev[parsedData?.startPort?.widgetId] = [widgetElement]);
        }
        if (parsedData?.endPort?.widgetId) {
          prev[parsedData?.endPort?.widgetId]
            ? prev[parsedData?.endPort?.widgetId].push(widgetElement)
            : (prev[parsedData?.endPort?.widgetId] = [widgetElement]);
        }
        return prev;
      },
      {},
    );
};

/**
 * Return the object list that has widgetId and widgetData
 *
 * @param widgets
 * @param connectedLineData
 * @returns {ConnectedWidgetData[]}
 */
export const getConnectedWidgetData = (
  widgets: WidgetsMap,
  connectedLineData: ConnectedLineData,
): ConnectedWidgetData[] =>
  Object.keys(connectedLineData)
    .filter((widgetId) => widgets[widgetId])
    .map((widgetId) => ({ widgetId: widgetId, widgetData: widgets[widgetId] as AllWidgetData }))
    .filter((data) => data?.widgetData) ?? [];

/**
 * Calculate the widget scale value so that the widget can be displayed inside the button
 *
 * @param heightPx
 * @param widthPx
 * @returns
 */
export const getWidgetScale = (heightPx: number, widthPx: number): number => {
  const isSmallerThanTumbnail =
    heightPx <= BUTTON_GRID_WIDGET_PX - BUTTON_GRID_WIDGET_PADDING_PX * 2 &&
    widthPx <= BUTTON_GRID_WIDGET_PX - BUTTON_GRID_WIDGET_PADDING_PX * 2;
  if (isSmallerThanTumbnail) return 1;

  const hScale = BUTTON_GRID_WIDGET_PX / heightPx;
  const wScale = BUTTON_GRID_WIDGET_PX / widthPx;

  return Math.min(wScale, hScale);
};

/**
 * Calculate the button widget left and top style after scaling the widget
 *
 * @param heightPx
 * @param widthPx
 * @returns
 */
export const getButtonWidgetStyle = (heightPx: number, widthPx: number) => {
  const scale = getWidgetScale(heightPx, widthPx);
  const isSmallerThanTumbnail = scale === 1;

  // Initial value is -1 due to the border size
  let topPx = -1,
    leftPx = -1;

  if (isSmallerThanTumbnail) {
    leftPx = (BUTTON_GRID_WIDGET_PX - widthPx * scale) / 2;
    topPx = (BUTTON_GRID_WIDGET_PX - heightPx * scale) / 2;
  } else {
    if (heightPx > widthPx) {
      leftPx = (BUTTON_GRID_WIDGET_PX - widthPx * scale) / 2;
    } else if (heightPx < widthPx) {
      topPx = (BUTTON_GRID_WIDGET_PX - heightPx * scale) / 2;
    }
  }

  return {
    left: `${leftPx + BUTTON_GRID_WIDGET_PADDING_PX}px`,
    top: `${topPx + BUTTON_GRID_WIDGET_PADDING_PX}px`,
  };
};
