import { getScale, reOrder } from '../Slide.helpers';

describe('components/PageManager/Slides.helpers.ts', () => {
  describe('getScale', () => {
    it('should return the calculated scale using widthPx and heightPx', () => {
      // check square
      expect(getScale(10, 10)).toBe(1); // 1 is the smaller than thumbnail
      expect(getScale(100, 100)).toBe(0.79);
      expect(getScale(1000, 1000)).toBe(0.079);

      // check rectangle
      expect(getScale(100, 500)).toBe(0.284);
      expect(getScale(500, 100)).toBe(0.158);
    });
  });

  describe('reOrder', () => {
    it('should return the re ordered list', () => {
      const mockList = [1, 2, 3, 4, 5, 6, 7];

      // Test the same index
      expect(reOrder(mockList, 0, 0)).toEqual(mockList);
      expect(reOrder(mockList, 1, 1)).toEqual(mockList);
      expect(reOrder(mockList, 6, 6)).toEqual(mockList);

      // Test first and last index
      expect(reOrder(mockList, 0, 6)).toEqual([2, 3, 4, 5, 6, 7, 1]);
      expect(reOrder(mockList, 6, 0)).toEqual([7, 1, 2, 3, 4, 5, 6]);

      // Test index between array
      expect(reOrder(mockList, 3, 4)).toEqual([1, 2, 3, 5, 4, 6, 7]);
      expect(reOrder(mockList, 5, 2)).toEqual([1, 2, 6, 3, 4, 5, 7]);
    });
  });
});
