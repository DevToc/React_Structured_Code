import { Widget, AccessibleElement } from '../../types/widget.types';
import { WidgetId } from '../../types/idTypes';

export enum LineWidgetTypes {
  straight = 'straight',
  stepped = 'stepped',
  curved = 'curved',
}

export enum LineWidgetDashArrayTypes {
  solid = 'solid',
  dotted = 'dotted',
  dashed = 'dashed',
  dashDot = 'dashDot',
  longDash = 'longDash',
  longDashDot = 'longDashDot',
}

export enum ArrowStyleTypes {
  none = 'none',
  basic = 'basic',
  long = 'long',
  sharp = 'sharp',
}

/**
 * PortPosition Component
 */
export enum Alignment {
  BEGIN = 'BEGIN',
  CENTER = 'CENTER',
  END = 'END',
}

export enum Side {
  CENTER = 'CENTER',
  EAST = 'EAST',
  WEST = 'WEST',
  SOUTH = 'SOUTH',
  NORTH = 'NORTH',
}

export type LineWidgetTypeKeys = keyof typeof LineWidgetTypes;
export type LineWidgetDashArrayTypeKeys = keyof typeof LineWidgetDashArrayTypes;
export type ArrowStyleTypeKeys = keyof typeof ArrowStyleTypes;

/**
 * Extra data which needs to be saved to backend
 */
export interface Pos {
  xPx: number;
  yPx: number;
}

export interface DeltaPos extends Pos {
  targetIndex?: number;
}

export interface AnglePos extends Pos {
  angle: number;
  distance: number;
}

// For connection lines
export interface PortData {
  widgetId: WidgetId;
  alignment: Alignment;
  side: Side;
  offsetPx?: number; // When using a detailed offset to the port location
  offsetDeg?: number; // for center
}

interface LineConnection {
  startPort: PortData | null;
  endPort: PortData | null;
}

export interface LineWidgetData extends Widget, AccessibleElement, LineConnection {
  type: LineWidgetTypes;
  startPos: Pos;
  midPosList: Pos[];
  endPos: Pos;
  strokeWidth: number;
  strokeColor: string;
  strokeDashType: LineWidgetDashArrayTypeKeys;
  startArrowStyle: ArrowStyleTypeKeys;
  endArrowStyle: ArrowStyleTypeKeys;
}

export interface StraightLineProps {
  widgetId?: WidgetId;
  widthPx?: number;
  heightPx?: number;
  posList: Pos[];
  strokeWidth: number;
  strokeColor: string;
  strokeDashType: LineWidgetDashArrayTypeKeys;
  startArrowStyle: ArrowStyleTypeKeys;
  endArrowStyle: ArrowStyleTypeKeys;
  delta?: DeltaPos;
  isReadonly?: boolean;
}

export interface DragHandlerProps extends LineConnection {
  widgetId?: string;
  leftPx: number;
  topPx: number;
  startPort: PortData | null;
  endPort: PortData | null;
  posList: Pos[];
  zoom: number;
  handlerSize: number;
  activeHandlerIndex: number;
  setFocus: Function;
  delta: DeltaPos;
  setDelta: Function;
  updateData: Function;
}

export enum WidgetState {
  Default = 'default',
  Active = 'active',
  Edit = 'edit',
}
export interface LineWidgetControlKeyboardShortcutsProps {
  setWidgetState: (arg: WidgetState) => void;
  widgetState: WidgetState;
  setFocus: Function;
  onKeyEvent: Function;
}
export interface SetFocusProps {
  moveNext?: boolean;
  movePrev?: boolean;
  index?: number;
  isWidget?: boolean;
}
