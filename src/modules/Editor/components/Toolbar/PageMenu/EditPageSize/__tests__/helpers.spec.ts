import {
  pixelToInch,
  inchToPixel,
  pixelToCm,
  cmToPixel,
  toPixels,
  getPaperType,
  format,
  validateSizeInput,
} from '../helpers';
import { PageSizePreset } from 'constants/paper';
import { PageSizeUnit, PaperType } from 'types/paper.types';

describe('PageSizeMenu/PageSizeMenu.helpers', () => {
  describe('pixelToInch', () => {
    it('should covert pixel to inch correctly', () => {
      const width = pixelToInch(PageSizePreset.letter.widthPx);
      const height = pixelToInch(PageSizePreset.letter.heightPx);
      expect(width).toEqual(PageSizePreset.letter.widthIn);
      expect(height).toEqual(PageSizePreset.letter.heightIn);
    });
  });

  describe('inchToPixel', () => {
    it('should covert inche to pixel correctly', () => {
      const width = inchToPixel(PageSizePreset.legal.widthIn);
      const height = inchToPixel(PageSizePreset.legal.heightIn);
      expect(width).toEqual(PageSizePreset.legal.widthPx);
      expect(height).toEqual(PageSizePreset.legal.heightPx);
    });
  });

  describe('pixelToCm', () => {
    it('should covert pixel to centimeter correctly', () => {
      const width = pixelToCm(PageSizePreset.a4.widthPx);
      const height = pixelToCm(PageSizePreset.a4.heightPx);
      expect(width).toEqual(PageSizePreset.a4.widthCm);
      expect(height).toEqual(PageSizePreset.a4.heightCm);
    });
  });

  describe('cmToPixel', () => {
    it('should covert centimeter to pixel correctly', () => {
      const width = cmToPixel(PageSizePreset.tabloid.widthCm);
      const height = cmToPixel(PageSizePreset.tabloid.heightCm);
      expect(width).toEqual(PageSizePreset.tabloid.widthPx);
      expect(height).toEqual(PageSizePreset.tabloid.heightPx);
    });
  });

  describe('toPixels', () => {
    it('should covert to pixel correctly', () => {
      let width = toPixels(PageSizePreset.tabloid.heightIn, PageSizeUnit.in);
      expect(width).toEqual(PageSizePreset.tabloid.heightPx);

      width = toPixels(PageSizePreset.tabloid.heightCm, PageSizeUnit.cm);
      expect(width).toEqual(PageSizePreset.tabloid.heightPx);

      width = toPixels(PageSizePreset.tabloid.heightPx, PageSizeUnit.px);
      expect(width).toEqual(PageSizePreset.tabloid.heightPx);
    });
  });

  describe('getPaperType', () => {
    it('should return correct paper type', () => {
      Object.values(PaperType).forEach((type) => {
        const result = getPaperType({ widthPx: PageSizePreset[type].widthPx, heightPx: PageSizePreset[type].heightPx });
        expect(result).toEqual(type);
      });
    });
  });

  it('should return none standard paper', () => {
    Object.values(PaperType).forEach((type) => {
      const result = getPaperType({
        widthPx: PageSizePreset[type].widthPx + 1,
        heightPx: PageSizePreset[type].heightPx,
      });
      expect(result).not.toEqual(type);
    });
  });

  describe('format', () => {
    it('should return value up to two decimals in conversion unit as string', () => {
      const result = format(PageSizePreset.letter.widthPx, PageSizeUnit.in);
      expect(result).toEqual(PageSizePreset.letter.widthIn.toString());
      expect(format(PageSizePreset.letter.widthPx, PageSizeUnit.px)).toEqual(PageSizePreset.letter.widthPx.toString());
    });
  });

  describe('validateSizeInput', () => {
    it('should validate input correctly', () => {
      expect(validateSizeInput(PageSizePreset.letter.widthPx)).toBeTruthy();
      expect(validateSizeInput(parseInt(''))).toBeFalsy();
      expect(validateSizeInput(Number.POSITIVE_INFINITY)).toBeFalsy();
      expect(validateSizeInput(Number.NEGATIVE_INFINITY)).toBeFalsy();
    });
  });
});
