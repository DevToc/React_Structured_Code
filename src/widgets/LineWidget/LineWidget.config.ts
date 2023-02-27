import { DeltaPos, LineWidgetTypes, LineWidgetDashArrayTypes, ArrowStyleTypes } from './LineWidget.types';
import { Key } from '../../constants/keyboard';

export const BOUNDING_BOX_CONFIG = {
  hideDefaultLines: true,
  resizable: false,
  rotatable: false,
};

export const DEFAULT_DELTA_POS: DeltaPos = {
  xPx: 0,
  yPx: 0,
};

// For the line renderer
export const DEFAULT_TYPE = LineWidgetTypes.straight;
export const DEFAULT_WIDTH = 400;
export const DEFAULT_HEIGHT = 400;
export const DEFAULT_FILL_COLOR = '#000';
export const DEFAULT_STROKE_WIDTH = 3;
export const DEFAULT_STROKE_DASH_TYPE = LineWidgetDashArrayTypes.solid;
export const DEFAULT_STROKE_START_ARROW_STYLE = ArrowStyleTypes.none;
export const DEFAULT_STROKE_END_ARROW_STYLE = ArrowStyleTypes.none;
export const DEFAULT_SHIFT_SNAP_ANGLE = 45;
export const DEFAULT_STROKE_SELECTION_TARGET = 10;

// For the custom handler
export const DEFAULT_CUSTOM_HANDLE_SIZE = 10;

// Minimum width or height that a line widget can have
export const MIN_WIDGET_SIZE = 20;

export const HANDLER_PADDING = 0;

export const KEYBOARD_CONFIG = {
  excludeSpecific: [Key.Enter],
};
