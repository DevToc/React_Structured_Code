import {
  OnDragStart as OnDragStartEvent,
  OnDrag as OnDragEvent,
  OnDragEnd as OnDragEndEvent,
  OnResizeStart as OnResizeStartEvent,
  OnResize as OnResizeEvent,
  OnResizeEnd as OnResizeEndEvent,
  OnRotateStart as OnRotateStartEvent,
  OnRotate as OnRotateEvent,
  OnRotateEnd as OnRotateEndEvent,
  OnDragGroupStart as OnDragGroupStartEvent,
  OnDragGroup as OnDragGroupEvent,
  OnDragGroupEnd as OnDragGroupEndEvent,
  OnResizeGroupStart as OnResizeGroupStartEvent,
  OnResizeGroup as OnResizeGroupEvent,
  OnResizeGroupEnd as OnResizeGroupEndEvent,
  OnRotateGroupStart as OnRotateGroupStartEvent,
  OnRotateGroup as OnRotateGroupEvent,
  OnRotateGroupEnd as OnRotateGroupEndEvent,
  OnScroll as OnScrollEvent,
  OnScrollGroup as OnScrollGroupEvent,
  OnClickGroup as OnClickGroupEvent,
} from 'react-moveable';
import { WidgetId } from 'types/idTypes';
import { WidgetType, Widget } from 'types/widget.types';

type SelectoTarget = HTMLElement | SVGElement;

type Snap = {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
};

type pageScroll = [number, number];

type SmartGuideConfig = {
  zIndex?: number;
  zoomPercent?: number;
  enableSnap?: boolean;
  useCenter?: boolean;
};

type computeType = OnDragStartEvent | OnDragGroupStartEvent | OnResizeStartEvent;
type matchType = OnDragGroupEvent | OnDragEvent | OnResizeGroupEvent | OnResizeEvent;
type matchDragParamsType = {
  e: OnDragEvent | OnDragGroupEvent;
  pageScrollAdjustment?: pageScroll;
};
type matchResizeParamsType = {
  e: OnResizeEvent | OnResizeGroupEvent;
  frame: FrameValue;
};

type Compute = (e: computeType, type: string) => void;
type Match = (params: matchDragParamsType | matchResizeParamsType) => Snap;
type Hide = () => void;
type SmartGuide = { compute: Compute; match: Match; hide: Hide };
type SetSmartGuideConfig = (value: SmartGuideConfig) => void;

type OnDragStart = (e: OnDragStartEvent) => void;
type CustomOnDragStart = { event: OnDragStartEvent; onDragStart: OnDragStart };
type CustomOnDragStartFn = (arg: CustomOnDragStart) => void;

type OnDrag = (e: OnDragEvent) => void;
type CustomOnDrag = { event: OnDragEvent; onDrag: OnDrag };
type CustomOnDragFn = (arg: CustomOnDrag) => void;

type OnDragEnd = (e: OnDragEndEvent) => void;
type CustomOnDragEnd = { event: OnDragEndEvent; onDragEnd: OnDragEnd; isGroup: boolean; smartGuide: SmartGuide };
type CustomOnDragEndFn = (arg: CustomOnDragEnd) => void;

type OnResizeStart = (e: OnResizeStartEvent) => void;
type CustomOnResizeStart = { event: OnResizeStartEvent; onResizeStart: OnResizeStart; isGroup: boolean };
type CustomOnResizeStartFn = (arg: CustomOnResizeStart) => void;
type OnResize = (e: OnResizeEvent) => void;
// TODO: probably shouldn't pass widgetData like this
type OnResizeEnd = (e: OnResizeEndEvent, widgetData?: object) => void;
type CustomOnResize = {
  event: OnResizeEvent;
  onResize: OnResize;
  isGroup: boolean;
  isResponsiveGroup: boolean;
  frameMap: Frame;
  smartGuide: SmartGuide;
};
type CustomOnResizeFn = (arg: CustomOnResize) => void;

type CustomOnResizeEnd = {
  event: OnResizeEndEvent;
  onResizeEnd: OnResizeEnd;
  smartGuide: SmartGuide;
  isGroup: boolean;
  saveWidget: (widgetId: WidgetId, widgetData: object) => void;
};
type CustomOnResizeEndFn = (arg: CustomOnResizeEnd) => void;

type OnRotateStart = (e: OnRotateStartEvent) => void;
type CustomOnRotateStart = { event: OnRotateStartEvent; onRotateStart: OnRotateStart };
type CustomOnRotateStartFn = (arg: CustomOnRotateStart) => void;

type OnRotate = (e: OnRotateEvent) => void;
type CustomOnRotate = { event: OnRotateEvent; onRotate: OnRotate };
type CustomOnRotateFn = (arg: CustomOnRotate) => void;

type OnRotateEnd = (e: OnRotateEndEvent) => void;
type CustomOnRotateEnd = { event: OnResizeEndEvent; onRotateEnd: OnRotateEnd; isGroup: boolean };
type CustomOnRotateEndFn = (arg: CustomOnRotateEnd) => void;

type customHandleFunction = (w: Widget) => string[];

enum WidgetHandleDirection {
  NW = 'nw',
  NE = 'ne',
  SW = 'sw',
  SE = 'se',
  N = 'n',
  E = 'e',
  S = 's',
  W = 'w',
}

type WidgetControlDirection = {
  customHandle?: string[] | customHandleFunction;
  resizable?: boolean;
  rotatable?: boolean;
  hideDefaultLines?: boolean;
  keepAspectRatioHandles?: string[];
};

type WidgetBoundingBoxConfig = {
  [key in WidgetType]?: WidgetControlDirection;
};

interface FrameMap<K, V> extends Map<K, V> {
  get(key: K): V;
}

interface FrameValue {
  translate: number[];
  rotate: number;
}

type Frame = FrameMap<HTMLElement | SVGElement, FrameValue>;

export interface WidgetRefConfig extends BoundingBoxFunction {
  element: HTMLElement;
}

export enum WidgetEvent {
  onDragStart = 'onDragStart',
  onDrag = 'onDrag',
  onDragEnd = 'onDragEnd',
  onResizeStart = 'onResizeStart',
  onResize = 'onResize',
  onResizeEnd = 'onResizeEnd',
  onRotateStart = 'onRotateStart',
  onRotate = 'onRotate',
  onRotateEnd = 'onRotateEnd',
}

export enum BoundingBoxStatus {
  onDrag = 'onDrag',
  onResize = 'onResize',
  onRotate = 'onRotate',
}

export type BoundingBoxFunction = {
  // TODO: improve types to work with arguments from exposeToWidgetFunctionCreator
  // optional functions to access, extend and/or override Bounding Box default functions
  [key in WidgetEvent]?: (arg: any) => void;
};

export type {
  SelectoTarget,
  Snap,
  pageScroll,
  SmartGuideConfig,
  computeType,
  matchType,
  OnDragStartEvent,
  OnDragStart,
  OnDrag,
  OnDragEvent,
  OnClickGroupEvent,
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
  OnDragEnd,
  OnResizeStart,
  OnResize,
  OnResizeEnd,
  OnRotateStart,
  OnRotate,
  OnRotateEnd,
  OnScrollEvent,
  OnScrollGroupEvent,
  CustomOnResizeStart,
  CustomOnDragStart,
  CustomOnDragStartFn,
  CustomOnDrag,
  CustomOnDragFn,
  CustomOnDragEnd,
  CustomOnDragEndFn,
  CustomOnResize,
  CustomOnResizeFn,
  CustomOnResizeEnd,
  CustomOnResizeEndFn,
  CustomOnRotateStart,
  CustomOnRotateStartFn,
  CustomOnRotate,
  CustomOnRotateFn,
  CustomOnRotateEnd,
  CustomOnRotateEndFn,
  CustomOnResizeStartFn,
  WidgetBoundingBoxConfig,
  WidgetControlDirection,
  SetSmartGuideConfig,
  matchDragParamsType,
  matchResizeParamsType,
  Compute,
  Match,
  Hide,
  Frame,
  FrameValue,
  WidgetHandleDirection,
};
