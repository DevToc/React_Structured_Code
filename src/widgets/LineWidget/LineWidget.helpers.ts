import { OnDrag } from 'react-moveable';
import {
  Pos,
  LineWidgetDashArrayTypes,
  LineWidgetDashArrayTypeKeys,
  ArrowStyleTypes,
  ArrowStyleTypeKeys,
  DeltaPos,
  AnglePos,
  LineWidgetData,
  LineWidgetTypeKeys,
  PortData,
  Side,
} from './LineWidget.types';
import { WidgetType } from '../../types/widget.types';
import {
  DEFAULT_TYPE,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_STROKE_DASH_TYPE,
  DEFAULT_STROKE_START_ARROW_STYLE,
  DEFAULT_STROKE_END_ARROW_STYLE,
  DEFAULT_SHIFT_SNAP_ANGLE,
  DEFAULT_CUSTOM_HANDLE_SIZE,
  MIN_WIDGET_SIZE,
} from './LineWidget.config';
import { Key, Step } from '../../constants/keyboard';
import { VERSION } from './LineWidget.upgrade';
import { parseStrictNumber } from '../../utils/number';

/**
 * @param  {Pos} sPos start position to calculate angle deg
 * @param  {Pos} ePos end position to calculate angle deg
 * @returns {number}  angle degree
 */
export const getDegBetweenTwoPos = (sPos: Pos, ePos: Pos): number => {
  const angleRadians = Math.atan2(ePos.yPx - sPos.yPx, ePos.xPx - sPos.xPx); // angle in radians
  const angleDeg = (angleRadians * 180) / Math.PI; // angle in degrees
  return angleDeg;
};

/**
 * @param  {Pos} pos          x,y position
 * @param  {number} angleDeg  angle degree value for
 * @param  {number} distance
 * @returns {Pos}
 */
export const getPointByAngleDistance = (pos: Pos, angleDeg: number, distance: number): Pos => ({
  xPx: parseStrictNumber(Math.cos((angleDeg * Math.PI) / 180) * distance + pos.xPx),
  yPx: parseStrictNumber(Math.sin((angleDeg * Math.PI) / 180) * distance + pos.yPx),
});

/**
 * startPadding과 endPadding을 계산하여 라인위젯의 포지션 리스트를 업데이트 합니다.
 *
 * @param  {Pos[]} posList        Origin position list
 * @param  {number} startPadding  padding value for the start arrow
 * @param  {number} endPadding    padding value for the end arrow
 * @returns {Pos[]}
 */
export const getPosListWithPadding = (posList: Pos[], startPadding: number, endPadding: number) => {
  const newStartPos = posList[0];
  const newStartNextpos = posList[1];
  const newEndPos = posList[posList.length - 1];
  const newEndPrevPos = posList[posList.length - 2];
  const startPosAngle = getDegBetweenTwoPos(newStartPos, newStartNextpos);
  const endPosAngle = getDegBetweenTwoPos(newEndPos, newEndPrevPos);
  const startPosTip = getPointByAngleDistance(newStartPos, startPosAngle, startPadding);
  const endPosTip = getPointByAngleDistance(newEndPos, endPosAngle, endPadding);

  return [
    { xPx: startPosTip.xPx, yPx: startPosTip.yPx },
    ...getMidPosList(posList),
    { xPx: endPosTip.xPx, yPx: endPosTip.yPx },
  ];
};

/**
 * Return the start position of the line widget
 *
 * @param posList
 * @returns startPos
 */
export const getStartPos = (posList: Pos[]): Pos => posList[0];

/**
 * Return the end position of the line widget
 * @param posList
 * @returns endPos
 */
export const getEndPos = (posList: Pos[]): Pos => posList[posList.length - 1];

/**
 * Return the mid position array of the line widget
 *
 * @param posList
 * @returns midPosList
 */
export const getMidPosList = (posList: Pos[]): Pos[] => posList.slice(1, posList.length - 1) ?? [];

/**
 * @param  {Pos} startPos
 * @param  {Pos[]} midPosList
 * @param  {Pos} endPos
 * @returns {Pos[]}
 */
export const mergePosList = (startPos: Pos, midPosList: Pos[], endPos: Pos): Pos[] => [startPos, ...midPosList, endPos];

/**
 * Return new pos data with ratio applied
 *
 * @param pos
 * @param ratio
 * @returns Pos
 */
export const calculatePosByRatio = (pos: Pos, ratio: number): Pos => ({
  xPx: pos.xPx * ratio,
  yPx: pos.yPx * ratio,
});

/**
 * @param  {Pos[]} posList  widget's all position list
 * @param  {DeltaPos} delta
 * @returns {Pos[]}
 */
export const calculateDeltaPoint = (posList: Pos[], delta: DeltaPos): Pos[] => {
  if (delta?.targetIndex === undefined) return posList;

  const targetPos = posList[delta.targetIndex];
  const result = [...posList];

  if (delta?.targetIndex >= 0) {
    result[delta.targetIndex] = {
      xPx: targetPos.xPx + delta.xPx,
      yPx: targetPos.yPx + delta.yPx,
    };
  }

  return result;
};

/**
 * Generate the path value using the Linewidget's PosList.
 * It is for the straight type
 *
 * @param  {Pos[]} posList
 * @returns string
 */
export const parsePosListToPath = (posList: Pos[]): string => {
  let result = '';

  if (!posList.length) return result;

  result = posList.reduce((prev, cur, idx) => {
    if (idx !== 0) {
      prev += ' L ';
    }

    prev += `${cur.xPx} ${cur.yPx}`;

    return prev;
  }, 'M ');

  return result;
};

/**
 * Return the dash array value
 * It uses the same dash array calculations as smartwidget's flowchart.
 *
 * @param  {LineWidgetDashArrayTypeKeys} type
 * @param  {number} strokeWidth
 */
export const getDashArray = (type: LineWidgetDashArrayTypeKeys, strokeWidth: number) => {
  let result = 'none';

  switch (type) {
    case LineWidgetDashArrayTypes.dotted:
      result = `0, ${strokeWidth + 5}`;
      break;

    case LineWidgetDashArrayTypes.dashed:
      result = `${strokeWidth + 5}, ${strokeWidth + 5}`;
      break;

    case LineWidgetDashArrayTypes.dashDot:
      result = `${strokeWidth + 5}, ${strokeWidth + 5}, 0, ${strokeWidth + 5}`;
      break;

    case LineWidgetDashArrayTypes.longDash:
      result = `${strokeWidth + 15}, ${strokeWidth + 5}`;
      break;

    case LineWidgetDashArrayTypes.longDashDot:
      result = `${strokeWidth + 15}, ${strokeWidth + 5}, 0, ${strokeWidth + 5}`;
      break;

    case LineWidgetDashArrayTypes.solid:
    default:
      break;
  }

  return result;
};

/**
 * Return the stroke line cap value using the arrow type
 *
 * @param  {LineWidgetDashArrayTypeKeys} type
 * @returns round
 */
export const getStrokeLineCap = (type: LineWidgetDashArrayTypeKeys): 'round' | undefined => {
  if (
    LineWidgetDashArrayTypes.dotted === type ||
    LineWidgetDashArrayTypes.dashDot === type ||
    LineWidgetDashArrayTypes.longDashDot === type
  ) {
    return 'round';
  }
  return;
};

/**
 * Generate marker path value using the arrow type
 *
 * @param  {ArrowStyleTypeKeys} type
 * @returns string
 */
export const getMarkerPath = (type: ArrowStyleTypeKeys): string => {
  let result = '';

  switch (type) {
    case ArrowStyleTypes.basic:
      result = 'M 3 0 L 10 5 L 3 10';
      break;
    case ArrowStyleTypes.long:
      result = 'M 0 0 L 10 5 L 0 10';
      break;
    case ArrowStyleTypes.sharp:
      result = 'M 0 0 L 10 5 L 0 10 L 3 5';
      break;
    case ArrowStyleTypes.none:
    default:
      break;
  }
  return result;
};

/**
 * Return the rounded number to solve 64-bit floating point issue
 * svg renders with wrong path when exponents are stored as values
 * Ref: https://medium.com/@sarafecadu/64-bit-floating-point-a-javascript-story-fa6aad266665
 *
 * @param number
 * @returns
 */
export const precisionRound = (number: number, precision = 7) => {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

/**
 * Generate default BasicShapeWidget data
 *
 * @param type {BasicShapeType} Shape type
 * @param isBorder if TRUE, will return border-only shape data (fill = 'none', border = default border), otherwise, will return fill-only data
 * @param options [optional] can specify any other attributes to be added to the widget data
 * @returns
 */
export const generateDefaultData = (type: LineWidgetTypeKeys, options: Partial<LineWidgetData> = {}) => {
  return Object.assign({
    widgetType: WidgetType.Line,
    widgetData: {
      version: VERSION,
      topPx: 0,
      leftPx: 0,
      widthPx: DEFAULT_WIDTH,
      heightPx: DEFAULT_HEIGHT,
      rotateDeg: 0,
      altText: '',
      isDecorative: false,
      type: DEFAULT_TYPE,
      startPos: {
        xPx: 0,
        yPx: 0,
      },
      endPos: {
        xPx: DEFAULT_WIDTH,
        yPx: DEFAULT_HEIGHT,
      },
      midPosList: [],
      strokeWidth: DEFAULT_STROKE_WIDTH,
      strokeColor: DEFAULT_FILL_COLOR,
      strokeDashType: DEFAULT_STROKE_DASH_TYPE,
      startArrowStyle: DEFAULT_STROKE_START_ARROW_STYLE,
      endArrowStyle: DEFAULT_STROKE_END_ARROW_STYLE,
      ...options,
    },
  });
};

/**
 * It calculates the widgetRect value before saving the widget.
 * At this time, the new widgetRect value is calculated using the current pos list and the delta value received from the custom handler.
 * More conditions are also included to solve tricky issues, so please check the README link.
 * Ref: README.md in the LineWidget folder.
 *
 * @param leftPx widget's leftPx
 * @param topPx widget's topPx
 * @param delta delta value from the custom handler
 * @param posList widget's all of position list, startPos + midPosList + andPos => Pos[]
 * @returns
 */
export const calculateWidgetRect = (leftPx: number, topPx: number, delta: DeltaPos, posList: Pos[]): LineWidgetData => {
  // Generate the new pos list to update dynamically
  let newPosList: Pos[] = posList.map((pos: Pos) => {
    return {
      xPx: pos.xPx,
      yPx: pos.yPx,
    };
  });

  // Set the delta value
  const targetIndex: number | undefined = delta.targetIndex;
  if (targetIndex !== undefined && targetIndex >= 0) {
    newPosList[targetIndex] = {
      xPx: newPosList[targetIndex].xPx + delta.xPx,
      yPx: newPosList[targetIndex].yPx + delta.yPx,
    };
  }

  // Check if the minimum width is used.
  // Check all posLists, and if the minimum value of x or y is greater than 0, update all posLists by the corresponding value.
  const minWidthOffset: number = Math.min(...posList.map((pos) => pos.xPx));
  const minHeightOffset: number = Math.min(...posList.map((pos) => pos.yPx));
  if (minWidthOffset > 0 || minHeightOffset > 0) {
    newPosList = newPosList.map((data: Pos): Pos => {
      return {
        xPx: data.xPx - minWidthOffset,
        yPx: data.yPx - minHeightOffset,
      };
    });
  }

  // If the moved pos value(xPx or yPx) is a negative value, change the leftPx and topPx of the widget
  // And then apply an offset to the all positions.
  const negativeXOffset: number = Math.min(...newPosList.map((x) => x.xPx));
  const negativeYOffset: number = Math.min(...newPosList.map((x) => x.yPx));
  if (negativeXOffset !== 0 || negativeYOffset !== 0) {
    newPosList = newPosList.map((data: Pos): Pos => {
      return {
        xPx: data.xPx - negativeXOffset,
        yPx: data.yPx - negativeYOffset,
      };
    });
  }

  // Restore the position for widgets whose width or height is less than 20px(MIN_WIDGET_SIZE)
  let newLeftPx = leftPx + negativeXOffset + minWidthOffset;
  let newTopPx = topPx + negativeYOffset + minHeightOffset;
  let newWidthPx = Math.max(...newPosList.map((x) => x.xPx));
  let newHeightPx = Math.max(...newPosList.map((x) => x.yPx));

  // Re-calculate the position for widgets whose width or height is less than 20px(MIN_WIDGET_SIZE)
  // If the widthPx or heightPx of the widget is smaller than the minimum size, expand the widget size to the minimum size.
  if (newWidthPx < MIN_WIDGET_SIZE) {
    const leftOffset = (MIN_WIDGET_SIZE - newWidthPx) / 2;
    newLeftPx = newLeftPx - leftOffset;
    newWidthPx = MIN_WIDGET_SIZE;
    newPosList = newPosList.map((data: Pos) => {
      data.xPx = data.xPx + leftOffset;
      return data;
    });
  }
  if (newHeightPx < MIN_WIDGET_SIZE) {
    const topOffset = (MIN_WIDGET_SIZE - newHeightPx) / 2;
    newTopPx = newTopPx - topOffset;
    newHeightPx = MIN_WIDGET_SIZE;
    newPosList = newPosList.map((data: Pos) => {
      data.yPx = data.yPx + topOffset;
      return data;
    });
  }

  const result = {
    leftPx: newLeftPx,
    topPx: newTopPx,
    widthPx: newWidthPx,
    heightPx: newHeightPx,
    startPos: getStartPos(newPosList),
    midPosList: getMidPosList(newPosList),
    endPos: getEndPos(newPosList),
  };

  return result as LineWidgetData;
};

/**
 * Returns the distance between positions
 *
 * @param pos1
 * @param pos2
 * @returns
 */
export const getDistance = (pos1: Pos, pos2: Pos) => {
  return Math.sqrt(Math.pow(pos1.xPx - pos2.xPx, 2) + Math.pow(pos1.yPx - pos2.yPx, 2));
};

/**
 * Create a angle list based on the received angle value.
 *
 * @param angle
 * @returns
 */
export const generateAngleList = (angle: number) => [...Array(360 / angle).keys()].map((x) => x * angle);

/**
 * Calculates all 45 degree positions the target position has.
 * And returns the closest position to the current dragging handler.
 *
 * @param currentPos origin position of the dragging handler
 * @param targetPos position of the target position
 * @param translate delta value of the dragging handler
 * @returns
 */
const calcClosestPositionByAngle = (currentPos: Pos, targetPos: Pos, translate: OnDrag['translate']): AnglePos => {
  const draggingPosX = currentPos.xPx + translate[0];
  const draggingPosY = currentPos.yPx + translate[1];

  const offsetX = draggingPosX - targetPos.xPx;
  const offsetY = draggingPosY - targetPos.yPx;
  const radius = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  const angleList = generateAngleList(DEFAULT_SHIFT_SNAP_ANGLE);
  const anglePosList: AnglePos[] = angleList.reduce((prev, cur): AnglePos[] => {
    const angle = cur;
    const xPx = radius * Math.sin((Math.PI * 2 * angle) / 360);
    const yPx = radius * Math.cos((Math.PI * 2 * angle) / 360);
    const distance = getDistance({ xPx: offsetX, yPx: offsetY }, { xPx: xPx, yPx: yPx });
    prev.push({
      angle,
      xPx,
      yPx,
      distance,
    });
    return prev;
  }, [] as AnglePos[]);

  const closestAngleData = anglePosList.reduce((prev: AnglePos, cur: AnglePos) =>
    prev.distance < cur.distance ? prev : cur,
  );

  return {
    angle: closestAngleData.angle,
    distance: closestAngleData.distance,
    xPx: targetPos.xPx + closestAngleData.xPx - currentPos.xPx,
    yPx: targetPos.yPx + closestAngleData.yPx - currentPos.yPx,
  };
};

/**
 * Calculates the position using the targets in previous and next the currently dragged handler.
 * then returns the target at the closest position
 *
 * @param posList
 * @param targetIndex
 * @param translate
 * @returns
 */
export const getClosestPosByAngle = (
  posList: Pos[],
  targetIndex: number,
  translate: OnDrag['translate'],
): Pos | undefined => {
  const nextTargetIndex = targetIndex === posList.length - 1 ? null : targetIndex + 1;
  const prevTargetIndex = targetIndex === 0 ? null : targetIndex - 1;
  let closestNextTargetPos: AnglePos | undefined;
  let closestPrevTargetPos: AnglePos | undefined;
  let closestTargetPos: Pos | undefined;
  if (nextTargetIndex !== null) {
    closestNextTargetPos = calcClosestPositionByAngle(posList[targetIndex], posList[nextTargetIndex], translate);
  }

  if (prevTargetIndex !== null) {
    closestPrevTargetPos = calcClosestPositionByAngle(posList[targetIndex], posList[prevTargetIndex], translate);
  }

  // Get the closest position
  if (closestNextTargetPos && closestPrevTargetPos) {
    closestTargetPos =
      closestNextTargetPos.distance < closestPrevTargetPos.distance ? closestNextTargetPos : closestPrevTargetPos;
  } else if (closestNextTargetPos) {
    closestTargetPos = closestNextTargetPos;
  } else if (closestPrevTargetPos) {
    closestTargetPos = closestPrevTargetPos;
  }

  if (closestTargetPos) {
    return {
      xPx: Math.round(closestTargetPos.xPx * 100) / 100,
      yPx: Math.round(closestTargetPos.yPx * 100) / 100,
    };
  }
};

/**
 * To restore the rotated line widget, calculate the point when the widget's rotateDeg is 0 using the angle
 *
 * @param widthPx
 * @param heightPx
 * @param posList
 * @param angle
 * @returns
 */
export const calculatePosListByAngle = (widthPx: number, heightPx: number, posList: Pos[], angle: number) => {
  const centerPos = {
    xPx: widthPx / 2,
    yPx: heightPx / 2,
  };

  return posList.map((pos) => {
    const distance = getDistance(pos, centerPos);
    const targetAngle = getDegBetweenTwoPos(centerPos, pos);
    return getPointByAngleDistance(centerPos, targetAngle + angle, distance);
  });
};

/**
 * Returns the size of the step accoding to the isShift value.
 * @param isShift
 * @returns
 */
export const getStepByKeyEvent = (isShift: boolean): number => (isShift ? Step.Medium : Step.Small);

/**
 * Return the position using the arrow event that occurred in the keyboard shortcut.
 *
 * @param key
 * @param step
 * @returns
 */
export const getPosByKeyEvent = (key: Key, step: number): Pos => {
  let xPx = 0;
  let yPx = 0;

  switch (key) {
    case Key.UpArrow:
      yPx -= step;
      break;
    case Key.DownArrow:
      yPx += step;
      break;
    case Key.LeftArrow:
      xPx -= step;
      break;
    case Key.RightArrow:
      xPx += step;
      break;

    default:
      break;
  }
  return {
    xPx,
    yPx,
  };
};

/**
 * Returns the handle size px
 *
 * @param zoom
 * @returns
 */
export const getHandleSize = (zoom: number): number =>
  DEFAULT_CUSTOM_HANDLE_SIZE / zoom > DEFAULT_CUSTOM_HANDLE_SIZE
    ? DEFAULT_CUSTOM_HANDLE_SIZE / zoom
    : DEFAULT_CUSTOM_HANDLE_SIZE;

/**
 * It is calculated so that the line widget can dynamically change its position according to the port position.
 * And it calculated based on the position of the rendered element, not the data.
 *
 * @param node
 * @param matrix
 * @param portData
 * @returns
 */
export const calculateTargetPoint = (node: HTMLElement, matrix: DOMMatrix, portData: PortData): number[] => {
  let result = [0, 0];

  // TODO: calculate rotated widget using matrix or rotatedDeg
  switch (portData.side) {
    case Side.NORTH:
      result = [node.offsetLeft + node.clientWidth / 2, node.offsetTop];
      break;

    case Side.EAST:
      result = [node.offsetLeft + node.clientWidth, node.offsetTop + node.clientHeight / 2];
      break;

    case Side.SOUTH:
      result = [node.offsetLeft + node.clientWidth / 2, node.offsetTop + node.clientHeight];
      break;

    case Side.WEST:
      result = [node.offsetLeft, node.offsetTop + node.clientHeight / 2];
      break;
  }

  const { e: translateX, f: translateY } = matrix;

  result[0] += translateX;
  result[1] += translateY;

  return result;
};
