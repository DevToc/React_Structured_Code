import { colord } from 'colord';
import { calculateRatio, parseRatioToScore } from '../useColorContrastChecker.helpers';
import { quantColorListWhiteBGColor, quantColorListRandomBGColor, expectedRatioList } from './mockData';

describe('hooks/useColorContrastChecker.helpers.ts', () => {
  describe('calculateRatio', () => {
    it('should returns calculated ratio with white background', () => {
      const ratioList = calculateRatio(colord('#000000').rgba, quantColorListWhiteBGColor);
      expect(ratioList).toHaveLength(8);

      ratioList.forEach((ratioData) => {
        expect(ratioData).toEqual({ hex: '#ffffff', ratio: 21, rgb: { b: 255, g: 255, r: 255 } });
      });
    });

    it('should returns calculated ratio with random background color', () => {
      const ratioList = calculateRatio(colord('#000000').rgba, quantColorListRandomBGColor);
      expect(ratioList).toHaveLength(8);
      expect(ratioList).toEqual(expectedRatioList);
    });
  });

  describe('parseRatioToScore', () => {
    const ratioList = [
      {
        hex: '#000',
        ratio: 1,
        rgb: colord('#000').rgba,
      },
    ];
    const normalFontSize = 10;
    const largeTextSize = 24;
    it('should returns score for the graphic', () => {
      // Check failed
      const socreFailed = parseRatioToScore(ratioList, null, null);
      expect(socreFailed).toHaveLength(1);
      expect(socreFailed[0].score).toBe('Fail');

      // Check AA
      ratioList[0].ratio = 3;
      const scoreAA = parseRatioToScore(ratioList, null, null);
      expect(scoreAA).toHaveLength(1);
      expect(scoreAA[0].score).toBe('AA');
    });

    it('should returns score for the normal text', () => {
      // Check failed
      ratioList[0].ratio = 1;
      const socreFailed = parseRatioToScore(ratioList, normalFontSize, null);
      expect(socreFailed).toHaveLength(1);
      expect(socreFailed[0].score).toBe('Fail');

      // Check AA
      ratioList[0].ratio = 4.5;
      const scoreAA = parseRatioToScore(ratioList, normalFontSize, null);
      expect(scoreAA).toHaveLength(1);
      expect(scoreAA[0].score).toBe('AA');

      // Check AAA
      ratioList[0].ratio = 7;
      const scoreAAA = parseRatioToScore(ratioList, normalFontSize, null);
      expect(scoreAAA).toHaveLength(1);
      expect(scoreAAA[0].score).toBe('AAA');
    });

    it('should returns score for the large text (fontsize >= 24)', () => {
      // Check failed
      ratioList[0].ratio = 1;
      const socreFailed = parseRatioToScore(ratioList, largeTextSize, null);
      expect(socreFailed).toHaveLength(1);
      expect(socreFailed[0].score).toBe('Fail');

      // Check AA
      ratioList[0].ratio = 3;
      const scoreAA = parseRatioToScore(ratioList, largeTextSize, null);
      expect(scoreAA).toHaveLength(1);
      expect(scoreAA[0].score).toBe('AA Large');

      // Check AAA
      ratioList[0].ratio = 4.5;
      const scoreAAA = parseRatioToScore(ratioList, largeTextSize, null);
      expect(scoreAAA).toHaveLength(1);
      expect(scoreAAA[0].score).toBe('AAA Large');
    });

    it('should returns score for the large text (bold and fontsize >= 19)', () => {
      // Check failed
      ratioList[0].ratio = 1;
      const socreFailed = parseRatioToScore(ratioList, largeTextSize, 'bold');
      expect(socreFailed).toHaveLength(1);
      expect(socreFailed[0].score).toBe('Fail');

      // Check AA
      ratioList[0].ratio = 3;
      const scoreAA = parseRatioToScore(ratioList, largeTextSize, 'bold');
      expect(scoreAA).toHaveLength(1);
      expect(scoreAA[0].score).toBe('AA Large');

      // Check AAA
      ratioList[0].ratio = 4.5;
      const scoreAAA = parseRatioToScore(ratioList, largeTextSize, 'bold');
      expect(scoreAAA).toHaveLength(1);
      expect(scoreAAA[0].score).toBe('AAA Large');
    });
  });
});
