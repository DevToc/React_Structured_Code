import { SnapRect, Pos } from './useSmartGuide.types';
import { getDistance, getDegBetweenTwoPos, getPointByAngleDistance } from '../../widgets/LineWidget/LineWidget.helpers';
import { OnResize, OnDrag } from 'react-moveable';
import { parseStrictNumber } from '../../utils/number';

/**
 * Update the x and y values ​​to use the DOMRect as the center position and set the width and height to 0.
 * top, left, bottom, right changed automatically because they use getter
 *
 * @param element
 * @returns
 */
export const getCenterDOMRect = (rect: DOMRect): DOMRect =>
  new DOMRect(rect.x + rect.width / 2, rect.y + rect.height / 2, 0, 0);

/**
 * TODO: add comment
 * @param domRect
 * @returns
 */
export const getRoundedDomRect = (domRect: DOMRect): DOMRect =>
  new DOMRect(Math.round(domRect.x), Math.round(domRect.y), Math.round(domRect.width), Math.round(domRect.height));

/**
 * Return the actual widget position without translate:rotate applied.
 * Note: When Moveablejs renders a rotated widget, it adds the `translate:rotate()` style to the widget that is using this position.
 * Use the clientWidth/Height instead of the style.width/height to allow string values of the width/height style.
 * However, DO NOT use the clientTop and clientLeft, it returns unexpected value.
 *
 * @param target
 * @returns
 */
export const getWidgetRectFromStyle = (target: HTMLElement): SnapRect => ({
  leftPx: parseStrictNumber(target.style.left),
  topPx: parseStrictNumber(target.style.top),
  widthPx: parseStrictNumber(target.clientWidth),
  heightPx: parseStrictNumber(target.clientHeight),
});

/**
 * Returns the center point of the Rect value.
 *
 * @param rect
 * @returns
 */
export const getCenterPosFromRect = (rect: SnapRect): Pos => ({
  xPx: rect.leftPx + rect.widthPx / 2,
  yPx: rect.topPx + rect.heightPx / 2,
});

/**
 * Update from 0 to 360 if the angle is too high or too low
 * Note: Moveable library has unlimited angles as it rotates
 * @param deg
 * @returns
 */
export const parseAngle = (deg: number): number => {
  const parsedAngle = deg % 360;

  // Need to convert negative angles to positive by adding 360, also use Math.abs(parsedAngle) to convert -0 to 0
  return parsedAngle < 0 ? parsedAngle + 360 : Math.abs(parsedAngle);
};

/**
 * Parse the degrees to the radians
 *
 * @param deg
 * @returns
 */
export const parseDegToRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Return the current widget's dragging axis.
 * For rotated widgets, it changes the direction dynamically based on the degrees to use the snap feature
 * @param direction
 * @param deg
 * @returns
 */
export const getAxis = (direction: OnResize['direction'], deg: number = 0): string => {
  let directionX: number = direction[0];
  let directionY: number = direction[1];

  if (deg !== 0) {
    // TODO: Parse axis using deg
    if (0 <= deg && deg <= 90) {
    } else if (90 < deg && deg <= 180) {
      directionX = -direction[1];
      directionY = direction[0];
    } else if (180 < deg && deg <= 270) {
      directionX = -direction[0];
      directionY = -direction[1];
    } else {
      directionX = direction[1];
      directionY = -direction[0];
    }

    if (directionX === 0 && directionY === -1) {
      directionX = 1;
    }
    if (directionX === 0 && directionY === 1) {
      directionX = -1;
    }
    if (directionY === 0 && directionX === -1) {
      directionY = -1;
    }
    if (directionY === 0 && directionX === 1) {
      directionY = 1;
    }

    // TODO: add comment for corner with rotated widget
    if (direction[0] !== 0 && direction[1] !== 0) {
      if (directionX === directionY) directionX = 0;
      else directionY = 0;
    }
  }

  let result = '';
  switch (directionY) {
    case 1:
      result += 's';
      break;
    case -1:
      result += 'n';
      break;
  }

  switch (directionX) {
    case 1:
      result += 'e';
      break;
    case -1:
      result += 'w';
      break;
  }

  return result;
};

/**
 * Return the new rect data using multiple pos values
 * @param pos1
 * @param pos2
 * @param pos3
 * @param pos4
 * @returns
 */
export const calculateRectFromMultiRect = (pos1: Pos, pos2: Pos, pos3: Pos, pos4: Pos): SnapRect => {
  const leftPx = Math.min(pos1.xPx, pos2.xPx, pos3.xPx, pos4.xPx);
  const topPx = Math.min(pos1.yPx, pos2.yPx, pos3.yPx, pos4.yPx);
  const rightPx = Math.max(pos1.xPx, pos2.xPx, pos3.xPx, pos4.xPx);
  const bottomPx = Math.max(pos1.yPx, pos2.yPx, pos3.yPx, pos4.yPx);

  return {
    leftPx: leftPx,
    topPx: topPx,
    widthPx: rightPx - leftPx,
    heightPx: bottomPx - topPx,
  };
};

export const getRotatedRectByAngle = (rect: SnapRect, angle: number): SnapRect => {
  const posCenter: Pos = {
    xPx: rect.leftPx + rect.widthPx / 2,
    yPx: rect.topPx + rect.heightPx / 2,
  };

  const posLT: Pos = {
    xPx: rect.leftPx,
    yPx: rect.topPx,
  };
  const posRT: Pos = {
    xPx: rect.leftPx + rect.widthPx,
    yPx: rect.topPx,
  };

  const posLB: Pos = {
    xPx: rect.leftPx,
    yPx: rect.topPx + rect.heightPx,
  };

  const posRB: Pos = {
    xPx: rect.leftPx + rect.widthPx,
    yPx: rect.topPx + rect.heightPx,
  };

  const distance = getDistance(posLT, posCenter);
  const rotatedRect = calculateRectFromMultiRect(
    getPointByAngleDistance(posCenter, getDegBetweenTwoPos(posCenter, posLT) + angle, distance),
    getPointByAngleDistance(posCenter, getDegBetweenTwoPos(posCenter, posRT) + angle, distance),
    getPointByAngleDistance(posCenter, getDegBetweenTwoPos(posCenter, posLB) + angle, distance),
    getPointByAngleDistance(posCenter, getDegBetweenTwoPos(posCenter, posRB) + angle, distance),
  );

  return rotatedRect;
};

/**
 * Return the resized widget rect using the e.dist and e.direction
 * @param e
 * @param originRect
 * @returns
 */
export const getResizedWidgetRect = (
  originRect: SnapRect,
  direction: OnResize['direction'],
  dist: OnResize['dist'],
): SnapRect => {
  let newLeftPx = originRect.leftPx;
  let newTopPx = originRect.topPx;
  let newWidthPx = originRect.widthPx;
  let newHeightPx = originRect.heightPx;

  if (direction[0] === 1) {
    newWidthPx = newWidthPx + dist[0];
  } else if (direction[0] === -1) {
    newLeftPx = newLeftPx - dist[0];
    newWidthPx = newWidthPx + dist[0];
  }

  if (direction[1] === 1) {
    newHeightPx = newHeightPx + dist[1];
  } else if (direction[1] === -1) {
    newTopPx = newTopPx - dist[1];
    newHeightPx = newHeightPx + dist[1];
  }

  return {
    leftPx: newLeftPx,
    topPx: newTopPx,
    widthPx: newWidthPx,
    heightPx: newHeightPx,
  };
};

/**
 *
 * @param rectA
 * @param rectB
 * @param degrees
 * @returns
 */
export const calculateBeforeTranslate = (
  rectA: SnapRect,
  rectB: SnapRect,
  degrees: number,
  direction: OnResize['direction'],
  dist: OnResize['dist'],
): OnDrag['beforeTranslate'] => {
  const centerPosA = getCenterPosFromRect(rectA);
  const centerPosB = getCenterPosFromRect(rectB);
  const distance = getDistance(centerPosA, centerPosB);
  const rotatedCenterPosB = getPointByAngleDistance(
    centerPosA,
    getDegBetweenTwoPos(centerPosA, centerPosB) + degrees,
    distance,
  );

  const beforeTranslate = [rotatedCenterPosB.xPx - centerPosB.xPx, rotatedCenterPosB.yPx - centerPosB.yPx];

  if (direction[1] === -1) {
    beforeTranslate[1] = beforeTranslate[1] - dist[1];
  }
  if (direction[0] === -1) {
    beforeTranslate[0] = beforeTranslate[0] - dist[0];
  }

  return beforeTranslate;
};
