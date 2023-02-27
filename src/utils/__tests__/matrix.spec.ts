import { transpose } from '../matrix';

describe('utils/matrix', () => {
  describe('transpose', () => {
    it('1 dimension empty array', () => {
      const data: number[][] = [];
      const expectedData: number[][] = [];

      const calculatedData = transpose(data);

      expect(calculatedData).toEqual(expectedData);
    });

    it('2 dimension empty array', () => {
      const data: number[][] = [[]];
      const expectedData: number[][] = [];

      const calculatedData = transpose(data);

      expect(calculatedData).toEqual(expectedData);
    });

    it('2 dimension 1*1 (single value) array', () => {
      const data: number[][] = [[123]];
      const expectedData: number[][] = [[123]];

      const calculatedData = transpose(data);

      expect(calculatedData).toEqual(expectedData);
    });

    it('2 dimension 1*2 array', () => {
      const data: number[][] = [[123, 456]];
      const expectedData: number[][] = [[123], [456]];

      const calculatedData = transpose(data);

      expect(calculatedData).toEqual(expectedData);
    });

    it('2 dimension 2*1 array', () => {
      const data: number[][] = [[123], [456]];
      const expectedData: number[][] = [[123, 456]];

      const calculatedData = transpose(data);

      expect(calculatedData).toEqual(expectedData);
    });

    it('2 dimension 2*2 array', () => {
      const data: number[][] = [
        [1, 2],
        [3, 4],
      ];
      const expectedData: number[][] = [
        [1, 3],
        [2, 4],
      ];

      const calculatedData = transpose(data);

      expect(calculatedData).toEqual(expectedData);
    });
  });
});
