import { parseStrictNumber, normalizeNumber } from '../number';

describe('utils/number.ts', () => {
  beforeAll(() => {
    // Ignore console.warn for testing
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  describe('parseStrictNumber', () => {
    it('should throw the error for using invalid value', () => {
      expect(() => parseStrictNumber(NaN)).toThrow(Error);
      expect(() => parseStrictNumber(Infinity)).toThrow(Error);
      expect(() => parseStrictNumber(-Infinity)).toThrow(Error);
      expect(() => parseStrictNumber('onlystring')).toThrow(Error);
    });

    it('should parse the string to the number', () => {
      expect(parseStrictNumber('10px')).toBe(10);
      expect(parseStrictNumber('10deg')).toBe(10);
      expect(parseStrictNumber('10')).toBe(10);
      expect(parseStrictNumber('10.1')).toBe(10.1);
      expect(parseStrictNumber('10.10')).toBe(10.1);

      // Test Hexadecimal
      expect(parseStrictNumber('0x10')).toBe(16);
      expect(parseStrictNumber('0x11')).toBe(17);
    });
  });
  describe('normalizeNumber', () => {
    const minVal = -100;
    const maxVal = 100;
    const midVal = 0;

    it('should return min/max if value is out of range', () => {
      expect(normalizeNumber(minVal, maxVal, minVal - 1)).toBe(minVal);
      expect(normalizeNumber(minVal, maxVal, maxVal + 1)).toBe(maxVal);
    });

    it('should return value if within range', () => {
      expect(normalizeNumber(minVal, maxVal, midVal)).toBe(midVal);
    });
  });
});
