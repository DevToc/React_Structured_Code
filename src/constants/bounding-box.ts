export const HANDLE = {
  ALL: ['n', 'nw', 'ne', 's', 'se', 'sw', 'e', 'w'],
  LEFT_RIGHT: ['e', 'w'],
  CORNERS: ['nw', 'ne', 'se', 'sw'],
  SIDE_CORNERS: ['e', 'w', 'nw', 'ne', 'se', 'sw'],
  NONE: [],
};

export enum Direction {
  NORTH = 'NORTH',
  NORTH_EAST = 'NORTH_EAST',
  NORTH_WEST = 'NORTH_WEST',
  EAST = 'EAST',
  WEST = 'WEST',
  SOUTH = 'SOUTH',
  SOUTH_WEST = 'SOUTH_WEST',
  SOUTH_EAST = 'SOUTH_EAST',
}

export const DIRECTION_MAP = {
  [Direction.NORTH]: [0, -1],
  [Direction.NORTH_EAST]: [1, -1],
  [Direction.NORTH_WEST]: [-1, -1],
  [Direction.EAST]: [1, 0],
  [Direction.WEST]: [-1, 0],
  [Direction.SOUTH]: [0, 1],
  [Direction.SOUTH_WEST]: [-1, 1],
  [Direction.SOUTH_EAST]: [1, 1],
};

export const LOCK_COLOR = 'var(--vg-colors-red-400)';
export const WIDGETBASE_CLASS = 'widget-container';
export const WIDGET_LOCK_CLASS = 'widget-locked';
export const MOVEABLE_LOCK_CLASS = 'moveable-locked';
export const BOUNDING_BOX_CLASS = 'moveable-control-box';
export const SELECTO_TARGET_CLASS = 'widget-selecto-target';
export const PORT_CONTAINER_CLASS = 'port-container';
export const PORT_SELECTOR_CLASS = 'port-selector';
