import {
  getAxis,
  getCenterPosFromRect,
  parseAngle,
  parseDegToRad,
  calculateRectFromMultiRect,
  getRotatedRectByAngle,
  getResizedWidgetRect,
  calculateBeforeTranslate,
} from '../useSmartGuide.helpers';
import { SnapRect, Pos } from '../useSmartGuide.types';
// import { LineWidgetTypes, LineWidgetDashArrayTypes, ArrowStyleTypes } from '../LineWidget.types';

describe('widgets/useSmartGuide.helpers', () => {
  const mockSnapRect = {
    leftPx: 100,
    topPx: 100,
    widthPx: 200,
    heightPx: 200,
  } as SnapRect;

  const directionT = [0, -1];
  const directionB = [0, 1];
  const directionL = [-1, 0];
  const directionR = [1, 0];
  const directionTL = [-1, -1];
  const directionTR = [1, -1];
  const directionBL = [-1, 1];
  const directionBR = [1, 1];

  describe('getCenterPosFromRect', () => {
    it('should return the center position', () => {
      const result = getCenterPosFromRect(mockSnapRect);
      expect(result).toEqual({ xPx: 200, yPx: 200 });

      const clonedSnapRect = JSON.parse(JSON.stringify(mockSnapRect));
      clonedSnapRect.leftPx -= 200;
      clonedSnapRect.topPx -= 200;
      const result2 = getCenterPosFromRect(clonedSnapRect);
      expect(result2).toEqual({ xPx: 0, yPx: 0 });
    });
  });

  describe('parseAngle', () => {
    it('should return the correct angle betweeen 0 to 360', () => {
      expect(parseAngle(0)).toBe(0);
      expect(parseAngle(200)).toBe(200);
      expect(parseAngle(359.999)).toBe(359.999);
      expect(parseAngle(360)).toBe(0);

      expect(parseAngle(1000)).toBe(280);
      expect(parseAngle(10000)).toBe(280);
      expect(parseAngle(-1000)).toBe(80);
      expect(parseAngle(-10000)).toBe(80);
    });
  });

  describe('parseDegToRad', () => {
    it('should return radians value using degrees', () => {
      expect(parseDegToRad(0)).toBe(0);
      expect(parseDegToRad(50)).toBe(0.8726646259971648);
      expect(parseDegToRad(100)).toBe(1.7453292519943295);
      expect(parseDegToRad(360)).toBe(6.283185307179586);
    });
  });

  describe('getAxis', () => {
    it('should return the axis regarding angle and direction', () => {
      expect(getAxis(directionT, 0)).toBe('n');
      expect(getAxis(directionB, 0)).toBe('s');
      expect(getAxis(directionL, 0)).toBe('w');
      expect(getAxis(directionR, 0)).toBe('e');

      expect(getAxis(directionT, 45)).toBe('ne');
      expect(getAxis(directionB, 45)).toBe('sw');
      expect(getAxis(directionL, 45)).toBe('nw');
      expect(getAxis(directionR, 45)).toBe('se');

      expect(getAxis(directionTL, 0)).toBe('nw');
      expect(getAxis(directionTR, 0)).toBe('ne');
      expect(getAxis(directionBL, 0)).toBe('sw');
      expect(getAxis(directionBR, 0)).toBe('se');

      expect(getAxis(directionTL, 90)).toBe('n');
      expect(getAxis(directionTR, 90)).toBe('e');
      expect(getAxis(directionBL, 90)).toBe('w');
      expect(getAxis(directionBR, 90)).toBe('s');

      expect(getAxis(directionTL, 180)).toBe('e');
      expect(getAxis(directionTR, 180)).toBe('s');
      expect(getAxis(directionBL, 180)).toBe('n');
      expect(getAxis(directionBR, 180)).toBe('w');
    });
  });

  describe('calculateRectFromMultiRect', () => {
    it('should return the new bounding box SnapRect using multiple position', () => {
      const pos1: Pos = {
        xPx: -100,
        yPx: -50,
      };
      const pos2: Pos = {
        xPx: 100,
        yPx: 50,
      };
      const pos3: Pos = {
        xPx: 200,
        yPx: 300,
      };
      const pos4: Pos = {
        xPx: 20,
        yPx: 30,
      };
      const result = calculateRectFromMultiRect(pos1, pos2, pos3, pos4);
      expect(result).toEqual({ heightPx: 350, leftPx: -100, topPx: -50, widthPx: 300 });
    });
  });

  describe('getRotatedRectByAngle', () => {
    it('should return the rotated rect using angle', () => {
      expect(getRotatedRectByAngle(mockSnapRect, 0)).toEqual({
        heightPx: 200,
        leftPx: 100,
        topPx: 99.99999999999999,
        widthPx: 200,
      });

      // positive degrees
      expect(getRotatedRectByAngle(mockSnapRect, 45)).toEqual({
        heightPx: 282.842712474619,
        leftPx: 58.57864376269049,
        topPx: 58.57864376269049,
        widthPx: 282.842712474619,
      });
      expect(getRotatedRectByAngle(mockSnapRect, 90)).toEqual({
        heightPx: 200,
        leftPx: 99.99999999999997,
        topPx: 100,
        widthPx: 200.00000000000003,
      });
      expect(getRotatedRectByAngle(mockSnapRect, 180)).toEqual({
        heightPx: 200.00000000000003,
        leftPx: 99.99999999999997,
        topPx: 99.99999999999997,
        widthPx: 200.00000000000003,
      });
      expect(getRotatedRectByAngle(mockSnapRect, 270)).toEqual({
        heightPx: 200.00000000000003,
        leftPx: 99.99999999999997,
        topPx: 99.99999999999997,
        widthPx: 200.00000000000014,
      });

      // negative degrees
      expect(getRotatedRectByAngle(mockSnapRect, -45)).toEqual({
        heightPx: 282.842712474619,
        leftPx: 58.57864376269049,
        topPx: 58.57864376269049,
        widthPx: 282.842712474619,
      });
      expect(getRotatedRectByAngle(mockSnapRect, -90)).toEqual({
        heightPx: 200,
        leftPx: 99.99999999999997,
        topPx: 99.99999999999999,
        widthPx: 200.00000000000003,
      });
      expect(getRotatedRectByAngle(mockSnapRect, -180)).toEqual({
        heightPx: 200,
        leftPx: 99.99999999999997,
        topPx: 99.99999999999999,
        widthPx: 200.00000000000003,
      });
      expect(getRotatedRectByAngle(mockSnapRect, -270)).toEqual({
        heightPx: 200,
        leftPx: 99.99999999999997,
        topPx: 99.99999999999999,
        widthPx: 200.00000000000014,
      });
    });
  });

  describe('getResizedWidgetRect', () => {
    it('should return the resized widget rect using the dist and direction', () => {
      expect(getResizedWidgetRect(mockSnapRect, directionT, [0, 10])).toEqual({
        heightPx: 210,
        leftPx: 100,
        topPx: 90,
        widthPx: 200,
      });
      expect(getResizedWidgetRect(mockSnapRect, directionL, [10, 0])).toEqual({
        heightPx: 200,
        leftPx: 90,
        topPx: 100,
        widthPx: 210,
      });
      expect(getResizedWidgetRect(mockSnapRect, directionB, [0, 10])).toEqual({
        heightPx: 210,
        leftPx: 100,
        topPx: 100,
        widthPx: 200,
      });
      expect(getResizedWidgetRect(mockSnapRect, directionR, [10, 0])).toEqual({
        heightPx: 200,
        leftPx: 100,
        topPx: 100,
        widthPx: 210,
      });

      // Test the wrong dist value

      expect(getResizedWidgetRect(mockSnapRect, directionT, [99, 10])).toEqual({
        heightPx: 210,
        leftPx: 100,
        topPx: 90,
        widthPx: 200,
      });
      expect(getResizedWidgetRect(mockSnapRect, directionL, [10, 99])).toEqual({
        heightPx: 200,
        leftPx: 90,
        topPx: 100,
        widthPx: 210,
      });
      expect(getResizedWidgetRect(mockSnapRect, directionB, [99, 10])).toEqual({
        heightPx: 210,
        leftPx: 100,
        topPx: 100,
        widthPx: 200,
      });
      expect(getResizedWidgetRect(mockSnapRect, directionR, [10, 99])).toEqual({
        heightPx: 200,
        leftPx: 100,
        topPx: 100,
        widthPx: 210,
      });
    });
  });

  describe('calculateBeforeTranslate', () => {
    it('should return the beforeTranslate value using the dist', () => {
      const clonedSnapRect = JSON.parse(JSON.stringify(mockSnapRect)) as SnapRect;
      clonedSnapRect.widthPx += 20;
      expect(calculateBeforeTranslate(mockSnapRect, clonedSnapRect, 0, directionR, [20, 0])).toEqual([0, 0]);
      expect(calculateBeforeTranslate(mockSnapRect, clonedSnapRect, 45, directionR, [20, 0])).toEqual([
        -2.9289321881345245, 7.0710678118654755,
      ]);
      expect(calculateBeforeTranslate(mockSnapRect, clonedSnapRect, 90, directionR, [20, 0])).toEqual([-10, 10]);
      expect(calculateBeforeTranslate(mockSnapRect, clonedSnapRect, 180, directionR, [20, 0])).toEqual([-20, 0]);
    });
  });
});
