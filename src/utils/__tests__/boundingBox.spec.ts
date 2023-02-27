import { getSideHandle, isSideHandle, isCornerHandle } from '../boundingBox';
import { DIRECTION_MAP } from 'constants/bounding-box';

describe('boundingBox utils', () => {
  describe('getSideHandle', () => {
    test('should return correct side handle for moveable direction', () => {
      expect(getSideHandle(DIRECTION_MAP.EAST)).toEqual('Right');
      expect(getSideHandle(DIRECTION_MAP.WEST)).toEqual('Left');
      expect(getSideHandle(DIRECTION_MAP.SOUTH)).toEqual('Bottom');
      expect(getSideHandle(DIRECTION_MAP.NORTH)).toEqual('Top');
      expect(getSideHandle(DIRECTION_MAP.NORTH)).toEqual('Top');
      expect(getSideHandle(DIRECTION_MAP.NORTH_EAST)).toEqual('');
    });
  });

  describe('isSideHandle', () => {
    test('should return true for side handle', () => {
      expect(isSideHandle(DIRECTION_MAP.EAST)).toEqual(true);
      expect(isSideHandle(DIRECTION_MAP.WEST)).toEqual(true);
      expect(isSideHandle(DIRECTION_MAP.SOUTH)).toEqual(true);
      expect(isSideHandle(DIRECTION_MAP.NORTH)).toEqual(true);
    });

    test('should return false for corner handle', () => {
      expect(isSideHandle(DIRECTION_MAP.NORTH_EAST)).toEqual(false);
      expect(isSideHandle(DIRECTION_MAP.NORTH_WEST)).toEqual(false);
      expect(isSideHandle(DIRECTION_MAP.SOUTH_EAST)).toEqual(false);
      expect(isSideHandle(DIRECTION_MAP.SOUTH_WEST)).toEqual(false);
    });
  });

  describe('isCornerHandle', () => {
    test('should return true for corner handle', () => {
      expect(isCornerHandle(DIRECTION_MAP.NORTH_EAST)).toEqual(true);
      expect(isCornerHandle(DIRECTION_MAP.NORTH_WEST)).toEqual(true);
      expect(isCornerHandle(DIRECTION_MAP.SOUTH_EAST)).toEqual(true);
      expect(isCornerHandle(DIRECTION_MAP.SOUTH_WEST)).toEqual(true);
    });

    test('should return false for side handle', () => {
      expect(isCornerHandle(DIRECTION_MAP.EAST)).toEqual(false);
      expect(isCornerHandle(DIRECTION_MAP.WEST)).toEqual(false);
      expect(isCornerHandle(DIRECTION_MAP.SOUTH)).toEqual(false);
      expect(isCornerHandle(DIRECTION_MAP.NORTH)).toEqual(false);
    });
  });
});
