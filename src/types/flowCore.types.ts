import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Alignment, LineWidgetData, Side } from 'widgets/LineWidget/LineWidget.types';
import { AllWidgetData, NewWidget } from 'widgets/Widget.types';
import { WidgetId } from './idTypes';
import { Subset } from './object.types';

export enum PortTypes {
  Creator = 'creator',
  Connector = 'connector',
}

export enum OnChangeEventTypes {
  Update = 'update',
  Done = 'done',
}

export type UpdateLineWidget = { widgetId: WidgetId; widgetData: Subset<LineWidgetData> };

export type PortProps = {
  size: number;
  isHover: boolean;
};

export type PortSelectorProps = {
  size: number;
};

export type PortState = {
  widgetId: WidgetId;
  side: Side;
  alignment: Alignment;
};

export type WrapperPos = {
  leftPx: number;
  topPx: number;
  widthPx: number;
  heightPx: number;
};

export type PortWrapperData = {
  widgetId: WidgetId;
  position: WrapperPos;
};

export type NodeCreatorModalData = {
  widgetId: WidgetId;
  position: WrapperPos;
  lineWidgetData: NewWidget;
};

/**
 * FlowCoreContext
 */
export type GetConnectedLinesType = (widgetId: WidgetId, target: HTMLElement) => UpdateLineWidget[];

export type OnChangeEvent = (type: OnChangeEventTypes, matrix: DOMMatrix, target: HTMLElement) => void | LineWidgetData;

export type SubscriberGetLineDataType = (matrix: DOMMatrix, target: HTMLElement) => LineWidgetData;

export type SubscriptionType = [WidgetId, OnChangeEvent];

export type ConnectedWidgetData = { widgetId: WidgetId; widgetData: AllWidgetData };

export type ConnectedLineData = { [key: string]: string[] };

export type ConnectedLineElements = { [key: string]: HTMLElement[] };

export interface FlowCoreContextGetterI {
  isEnabled: boolean;
  isObserving: boolean;
  connectedLineElements?: ConnectedLineElements;
  connectedWidgetData?: ConnectedWidgetData[];
  flowCoreEvent: {
    onChange: (widgetId: WidgetId, callback: OnChangeEvent) => void;
  };
}

export interface FlowCoreContextSetterI {
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
}

type FlowCoreStartType = () => void;

type FlowCoreStopType = () => void;

type DupliCateWidgetType = (widgetId: WidgetId, lineWidgetData: NewWidget) => void;

export interface FlowCoreContextI extends FlowCoreContextGetterI, FlowCoreContextSetterI {
  start: FlowCoreStartType;
  stop: FlowCoreStopType;
  getConnectedLines: GetConnectedLinesType;
  duplicateWidget: DupliCateWidgetType;
}

export interface FlowCoreProviderProps {
  children: ReactNode;
}

/**
 * For PortRenderer
 */

export interface PortContextGetterI {
  connectorPortData: PortWrapperData | null;
  creatorPortData: PortWrapperData | null;
  selectedPort: PortState | null;
  nodeModalData: NodeCreatorModalData | null;
}

export interface PortContextSetterI {
  setSelectedPort: Dispatch<SetStateAction<PortState | null>>;
}

export interface PortContextI extends PortContextGetterI, PortContextSetterI {
  render: (targetElm: HTMLElement | null, type: PortTypes) => void;
  clear: () => void;
  renderModal: (nodeCreatorModalData: NodeCreatorModalData | null) => void;
  closeModal: () => void;
}

export interface PortProviderProps {
  children: ReactNode;
}

export interface PortRendererProps {
  zoom: number;
}
