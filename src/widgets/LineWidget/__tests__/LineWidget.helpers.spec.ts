import {
  getPosListWithPadding,
  getStartPos,
  getEndPos,
  getMidPosList,
  mergePosList,
  calculatePosByRatio,
  calculateDeltaPoint,
  parsePosListToPath,
  getDashArray,
  getStrokeLineCap,
  getMarkerPath,
  precisionRound,
  generateDefaultData,
  calculateWidgetRect,
  getDistance,
  getClosestPosByAngle,
  generateAngleList,
  calculatePosListByAngle,
  getStepByKeyEvent,
  getPosByKeyEvent,
  getHandleSize,
} from '../LineWidget.helpers';
import { LineWidgetTypes, LineWidgetDashArrayTypes, ArrowStyleTypes } from '../LineWidget.types';
import { Key, Step } from '../../../constants/keyboard';
import { VERSION } from '../LineWidget.upgrade';

describe('widgets/LineWidget.helpers', () => {
  const posList = [
    { xPx: 0, yPx: 0 },
    { xPx: 100, yPx: 0 },
    { xPx: 0, yPx: 100 },
    { xPx: 100, yPx: 100 },
  ];
  const straightLinePosList = [
    { xPx: 0, yPx: 0 },
    { xPx: 100, yPx: 100 },
  ];

  describe('getPosListWithPadding', () => {
    it('should returns position list with padding', () => {
      const startPadding = 10;
      const endPadding = 10;
      const expectedData = [
        { xPx: 7.0710678118654755, yPx: 7.071067811865475 },
        { xPx: 92.92893218813452, yPx: 92.92893218813452 },
      ];

      const result = getPosListWithPadding(straightLinePosList, startPadding, endPadding);
      expect(result).toEqual(expectedData);
    });

    it('should returns position list without padding', () => {
      const startPadding = 0;
      const endPadding = 0;
      const result = getPosListWithPadding(posList, startPadding, endPadding);
      expect(result).toEqual(posList);
    });
  });

  describe('getStartPos, getEndPos, getMidPosList, mergePosList', () => {
    it('returns start pos object from posList', () => {
      const expectedValue = { xPx: 0, yPx: 0 };
      expect(getStartPos(posList)).toEqual(expectedValue);
    });

    it('returns end pos object from posList', () => {
      const expectedValue = { xPx: 100, yPx: 100 };
      expect(getEndPos(posList)).toEqual(expectedValue);
    });

    it('returns the mid pos list from posList', () => {
      const result = getMidPosList(posList);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ xPx: 100, yPx: 0 });
      expect(result[1]).toEqual({ xPx: 0, yPx: 100 });
    });

    it('returns the mid pos list from the straight posList', () => {
      const result = getMidPosList(posList);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ xPx: 100, yPx: 0 });
      expect(result[1]).toEqual({ xPx: 0, yPx: 100 });
    });

    it('returns the merged posList', () => {
      const startPos = getStartPos(posList);
      const midPosList = getMidPosList(posList);
      const endPos = getEndPos(posList);
      const result = mergePosList(startPos, midPosList, endPos);
      expect(result).toHaveLength(4);
      expect(result).toEqual(posList);
    });
  });

  describe('calculatePosByRatio', () => {
    const testPosition = { xPx: 100, yPx: 100 };
    it('returns the calculated position using 100% ratio', () => {
      const expectedValue = { xPx: 100, yPx: 100 };
      expect(calculatePosByRatio(testPosition, 1)).toEqual(expectedValue);
    });
    it('returns the calculated position using 140% ratio', () => {
      const expectedValue = { xPx: 140, yPx: 140 };
      expect(calculatePosByRatio(testPosition, 1.4)).toEqual(expectedValue);
    });
    it('returns the calculated position using 60% ratio', () => {
      const expectedValue = { xPx: 60, yPx: 60 };
      expect(calculatePosByRatio(testPosition, 0.6)).toEqual(expectedValue);
    });
  });

  describe('calculateDeltaPoint', () => {
    const deltaData = {
      targetIndex: 0,
      target: {} as HTMLDivElement,
      xPx: 30,
      yPx: 30,
    };
    it('returns the updated position list using the delta object', () => {
      const expectedResult = [
        { xPx: 30, yPx: 30 },
        { xPx: 100, yPx: 0 },
        { xPx: 0, yPx: 100 },
        { xPx: 100, yPx: 100 },
      ];
      const result = calculateDeltaPoint(posList, deltaData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('parsePosListToPath', () => {
    it('returns the path using the pos list', () => {
      const expectedResult = 'M 0 0 L 100 0 L 0 100 L 100 100';
      const result = parsePosListToPath(posList);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDashArray', () => {
    it('returns dash array value using the solid type', () => {
      expect(getDashArray(LineWidgetDashArrayTypes.solid, 1)).toBe('none');
      expect(getDashArray(LineWidgetDashArrayTypes.solid, 10)).toBe('none');
      expect(getDashArray(LineWidgetDashArrayTypes.solid, 20)).toBe('none');
    });
    it('returns dash array value using the dotted type', () => {
      expect(getDashArray(LineWidgetDashArrayTypes.dotted, 1)).toBe('0, 6');
      expect(getDashArray(LineWidgetDashArrayTypes.dotted, 10)).toBe('0, 15');
      expect(getDashArray(LineWidgetDashArrayTypes.dotted, 20)).toBe('0, 25');
    });
    it('returns dash array value using the dashed type', () => {
      expect(getDashArray(LineWidgetDashArrayTypes.dashed, 1)).toBe('6, 6');
      expect(getDashArray(LineWidgetDashArrayTypes.dashed, 10)).toBe('15, 15');
      expect(getDashArray(LineWidgetDashArrayTypes.dashed, 20)).toBe('25, 25');
    });
    it('returns dash array value using the dashDot type', () => {
      expect(getDashArray(LineWidgetDashArrayTypes.dashDot, 1)).toBe('6, 6, 0, 6');
      expect(getDashArray(LineWidgetDashArrayTypes.dashDot, 10)).toBe('15, 15, 0, 15');
      expect(getDashArray(LineWidgetDashArrayTypes.dashDot, 20)).toBe('25, 25, 0, 25');
    });
    it('returns dash array value using the longDash type', () => {
      expect(getDashArray(LineWidgetDashArrayTypes.longDash, 1)).toBe('16, 6');
      expect(getDashArray(LineWidgetDashArrayTypes.longDash, 10)).toBe('25, 15');
      expect(getDashArray(LineWidgetDashArrayTypes.longDash, 20)).toBe('35, 25');
    });
    it('returns dash array value using the longDashDot type', () => {
      expect(getDashArray(LineWidgetDashArrayTypes.longDashDot, 1)).toBe('16, 6, 0, 6');
      expect(getDashArray(LineWidgetDashArrayTypes.longDashDot, 10)).toBe('25, 15, 0, 15');
      expect(getDashArray(LineWidgetDashArrayTypes.longDashDot, 20)).toBe('35, 25, 0, 25');
    });
  });

  describe('getStrokeLineCap', () => {
    it('returns undefined as stroke linecap value', () => {
      expect(getStrokeLineCap(LineWidgetDashArrayTypes.solid)).toBe(undefined);
      expect(getStrokeLineCap(LineWidgetDashArrayTypes.dashed)).toBe(undefined);
      expect(getStrokeLineCap(LineWidgetDashArrayTypes.longDash)).toBe(undefined);
    });
    it('returns round as stroke linecap value', () => {
      expect(getStrokeLineCap(LineWidgetDashArrayTypes.dotted)).toBe('round');
      expect(getStrokeLineCap(LineWidgetDashArrayTypes.dashDot)).toBe('round');
      expect(getStrokeLineCap(LineWidgetDashArrayTypes.longDashDot)).toBe('round');
    });
  });

  describe('getMarkerPath', () => {
    it('returns empty string for none arrow style', () => {
      expect(getMarkerPath(ArrowStyleTypes.none)).toBe('');
    });
    it('returns the marker path string based on the arrow style', () => {
      expect(getMarkerPath(ArrowStyleTypes.basic)).toBe('M 3 0 L 10 5 L 3 10');
      expect(getMarkerPath(ArrowStyleTypes.sharp)).toBe('M 0 0 L 10 5 L 0 10 L 3 5');
      expect(getMarkerPath(ArrowStyleTypes.long)).toBe('M 0 0 L 10 5 L 0 10');
    });
  });

  describe('precisionRound', () => {
    it('returns rounded number', () => {
      expect(precisionRound(1.10000000000001)).toBe(1.1);
      expect(precisionRound(1000000000001.10000000000001)).toBe(1000000000001.1);
    });
    it('returns zero for exponent number', () => {
      expect(precisionRound(1.4365854276597283e-8)).toBe(0);
    });
  });

  describe('generateDefaultData', () => {
    it('', () => {
      const expectedResult = {
        widgetData: {
          version: VERSION,
          altText: '',
          endArrowStyle: 'none',
          endPos: { xPx: 400, yPx: 400 },
          heightPx: 400,
          isDecorative: false,
          leftPx: 0,
          midPosList: [],
          rotateDeg: 0,
          startArrowStyle: 'none',
          startPos: { xPx: 0, yPx: 0 },
          strokeColor: '#000',
          strokeDashType: 'solid',
          strokeWidth: 3,
          topPx: 0,
          type: 'straight',
          widthPx: 400,
        },
        widgetType: '005',
      };
      expect(generateDefaultData(LineWidgetTypes.straight)).toEqual(expectedResult);
    });
  });

  describe('calculateWidgetRect', () => {
    const deltaDataRightBottom = {
      targetIndex: 0,
      target: {} as HTMLDivElement,
      xPx: 30,
      yPx: 30,
    };

    const deltaDataLeftTop = {
      targetIndex: 0,
      target: {} as HTMLDivElement,
      xPx: -100,
      yPx: -100,
    };

    it('returns the calculated widget rect to save widget data using the straight line data', () => {
      const result = calculateWidgetRect(0, 0, deltaDataRightBottom, straightLinePosList);
      expect(result?.leftPx).toBe(30);
      expect(result?.topPx).toBe(30);
      expect(result?.widthPx).toBe(70);
      expect(result?.heightPx).toBe(70);
    });

    it('returns the calculated widget rect using the line data that has multiple position list', () => {
      const result = calculateWidgetRect(0, 0, deltaDataRightBottom, posList);
      expect(result?.leftPx).toBe(0);
      expect(result?.topPx).toBe(0);
      expect(result?.widthPx).toBe(100);
      expect(result?.heightPx).toBe(100);
    });

    it('returns the calculated widget rect using the delta position moved up left', () => {
      const result = calculateWidgetRect(0, 0, deltaDataLeftTop, straightLinePosList);
      expect(result?.leftPx).toBe(-100);
      expect(result?.topPx).toBe(-100);
      expect(result?.widthPx).toBe(200);
      expect(result?.heightPx).toBe(200);
    });
  });

  describe('getDistance', () => {
    const pos1 = {
      xPx: 0,
      yPx: 0,
    };
    const pos2 = {
      xPx: 100,
      yPx: 0,
    };
    const pos3 = {
      xPx: 100,
      yPx: 100,
    };
    const pos4 = {
      xPx: -100,
      yPx: -100,
    };

    it('returns the calculated distance value between two points', () => {
      expect(getDistance(pos1, pos2)).toEqual(100);
      expect(getDistance(pos1, pos3)).toEqual(141.4213562373095);
    });

    it('returns the calculated distance value between two points with the negative point', () => {
      expect(getDistance(pos4, pos3)).toEqual(282.842712474619);
    });
  });

  describe('generateAngleList', () => {
    it('returns the list of the angle', () => {
      expect(generateAngleList(45)).toEqual([0, 45, 90, 135, 180, 225, 270, 315]);
      expect(generateAngleList(45)).toHaveLength(8);
      expect(generateAngleList(10)).toHaveLength(36);
      expect(generateAngleList(15)).toHaveLength(24);
    });
  });

  describe('getClosestPosByAngle', () => {
    const posList = [
      { xPx: 20, yPx: 20 },
      { xPx: 100, yPx: 20 },
      { xPx: 20, yPx: 100 },
      { xPx: 100, yPx: 100 },
    ];
    const straightLinePosList = [
      { xPx: 20, yPx: 20 },
      { xPx: 80, yPx: 20 },
    ];
    const translate = [50, 50];
    const translate2 = [100, 100];
    it('returns the calculated point value using straight line', () => {
      expect(getClosestPosByAngle(straightLinePosList, 0, translate)).toEqual({ xPx: 60, yPx: 50.99 });
      expect(getClosestPosByAngle(straightLinePosList, 1, translate)).toEqual({ xPx: 25.44, yPx: 85.44 });

      expect(getClosestPosByAngle(straightLinePosList, 0, translate2)).toEqual({ xPx: 60, yPx: 107.7 });
      expect(getClosestPosByAngle(straightLinePosList, 1, translate2)).toEqual({ xPx: 73.42, yPx: 133.42 });
    });

    it('returns the calculated point value using multiple points line', () => {
      expect(getClosestPosByAngle(posList, 0, translate)).toEqual({ xPx: 38.77, yPx: 41.23 });
      expect(getClosestPosByAngle(posList, 1, translate)).toEqual({ xPx: 53.42, yPx: 80 });
      expect(getClosestPosByAngle(posList, 2, translate)).toEqual({ xPx: 38.77, yPx: 41.23 });
      expect(getClosestPosByAngle(posList, 3, translate)).toEqual({ xPx: 59.28, yPx: 0 });

      expect(getClosestPosByAngle(posList, 0, translate2)).toEqual({ xPx: 80, yPx: 101.98 });
      expect(getClosestPosByAngle(posList, 1, translate2)).toEqual({ xPx: 101.11, yPx: 80 });
      expect(getClosestPosByAngle(posList, 2, translate2)).toEqual({ xPx: 80, yPx: 101.11 });
      expect(getClosestPosByAngle(posList, 3, translate2)).toEqual({ xPx: 65.6, yPx: 145.6 });
    });
  });

  describe('calculatePosListByAngle', () => {
    const posList = [
      {
        xPx: 0,
        yPx: 0,
      },

      {
        xPx: 80,
        yPx: 80,
      },
    ];

    it('returns the same posList provided if angle is zero', () => {
      const result = calculatePosListByAngle(80, 80, posList, 0);
      result[0].yPx = Math.round(result[0].yPx) === 0 ? 0 : Math.round(result[0].yPx); // Parse -0 to 0
      expect(result).toEqual(posList);
    });

    it('returns the rotated posList using 45deg', () => {
      // Rotate to use the 45deg
      const result = calculatePosListByAngle(80, 80, posList, 45);
      expect(result[0].xPx).toBe(40);
      expect(result[0].yPx).toBe(-16.568542494923804);
      expect(result[1].xPx).toBe(40);
      expect(result[1].yPx).toBe(96.5685424949238);

      // Revert to use the -45deg
      const result2 = calculatePosListByAngle(80, 80, result, -45);
      result2[0].yPx = Math.round(result2[0].yPx) === 0 ? 0 : Math.round(result2[0].yPx); // Parse -0 to 0
      expect(result2).toEqual(posList);
    });
  });

  describe('getStepByKeyEvent', () => {
    it('returns the number of the step accoding to the isShift value', () => {
      expect(getStepByKeyEvent(true)).toBe(Step.Medium);
      expect(getStepByKeyEvent(false)).toBe(Step.Small);
    });
  });

  describe('getPosByKeyEvent', () => {
    const step1 = 1;
    const step10 = 10;

    it('returns Pos object using the step as 1', () => {
      expect(getPosByKeyEvent(Key.UpArrow, step1)).toEqual({ xPx: 0, yPx: -1 });
      expect(getPosByKeyEvent(Key.DownArrow, step1)).toEqual({ xPx: 0, yPx: 1 });
      expect(getPosByKeyEvent(Key.LeftArrow, step1)).toEqual({ xPx: -1, yPx: 0 });
      expect(getPosByKeyEvent(Key.RightArrow, step1)).toEqual({ xPx: 1, yPx: 0 });
    });

    it('returns Pos object using the step as 10', () => {
      expect(getPosByKeyEvent(Key.UpArrow, step10)).toEqual({ xPx: 0, yPx: -10 });
      expect(getPosByKeyEvent(Key.DownArrow, step10)).toEqual({ xPx: 0, yPx: 10 });
      expect(getPosByKeyEvent(Key.LeftArrow, step10)).toEqual({ xPx: -10, yPx: 0 });
      expect(getPosByKeyEvent(Key.RightArrow, step10)).toEqual({ xPx: 10, yPx: 0 });
    });
  });

  describe('getHandleSize', () => {
    it('returns the custom handler size using the zoom value', () => {
      expect(getHandleSize(0.2)).toBe(50);
      expect(getHandleSize(0.8)).toBe(12.5);
      expect(getHandleSize(1)).toBe(10);
      expect(getHandleSize(1.2)).toBe(10);
      expect(getHandleSize(2)).toBe(10);
    });
  });
});
