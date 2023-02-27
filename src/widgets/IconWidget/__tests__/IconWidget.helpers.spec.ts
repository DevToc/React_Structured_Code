import { adjustSVGViewBox, getIconGridArr } from '../IconWidget.helpers';

describe('IconWidget/IconWidget.helpers.ts', () => {
  describe('adjustSVGViewBox', () => {
    test('should parse icons from data', () => {
      const maxSize = 200;

      const evenViewBox = adjustSVGViewBox({ viewBox: '0 0 50 50', maxSize });
      expect(evenViewBox.width).toEqual(maxSize);
      expect(evenViewBox.height).toEqual(maxSize);

      const noViewBox = adjustSVGViewBox({ viewBox: undefined, maxSize });
      expect(noViewBox.width).toEqual(maxSize);
      expect(noViewBox.height).toEqual(maxSize);
    });
  });

  describe('getIconGridArr', () => {
    test('should generate a filled icon grid with full fill', () => {
      const numberOfIcons = 10;
      const shapeFill = 100;
      const shapeColorOne = 'red';
      const shapeColorTwo = 'blue';

      const iconArr = getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo);

      expect(iconArr.length).toEqual(numberOfIcons);
      expect(iconArr.every((icon) => icon.shapeColorOne === shapeColorOne)).toEqual(true);
      expect(iconArr.every((icon) => icon.shapeColorTwo === undefined)).toEqual(true);
      expect(iconArr.every((icon) => icon.shapeFill === 100)).toEqual(true);
    });

    test('should generate a filled icon grid with no fill', () => {
      const numberOfIcons = 10;
      const shapeFill = 0;
      const shapeColorOne = 'red';
      const shapeColorTwo = 'blue';

      const iconArr = getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo);
      expect(iconArr.length).toEqual(numberOfIcons);
      expect(iconArr.every((icon) => icon.shapeColorOne === shapeColorTwo)).toEqual(true);
      expect(iconArr.every((icon) => icon.shapeColorTwo === undefined)).toEqual(true);
      expect(iconArr.every((icon) => icon.shapeFill === 100)).toEqual(true);
    });

    test('should generate whole partially filled icon grid', () => {
      const numberOfIcons = 10;
      const shapeFill = 50;
      const shapeColorOne = 'red';
      const shapeColorTwo = 'blue';

      const iconArr = getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo);

      // first five icons should be filled with shapeColorOne
      expect(iconArr.slice(0, 5).every((icon) => icon.shapeColorOne === shapeColorOne)).toEqual(true);
      // last five icons should be filled with shapeColorTwo
      expect(iconArr.slice(5).every((icon) => icon.shapeColorOne === shapeColorTwo)).toEqual(true);
      expect(iconArr.every((icon) => icon.shapeFill === 100)).toEqual(true);
    });

    test('should generate partially filled icon grid', () => {
      const numberOfIcons = 10;
      const shapeFill = 35;
      const shapeColorOne = 'red';
      const shapeColorTwo = 'blue';

      const iconArr = getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo);

      // center icon should be partially filled
      expect(iconArr[3].shapeColorOne).toEqual(shapeColorTwo);
      expect(iconArr[3].shapeColorTwo).toEqual(shapeColorOne);
      expect(iconArr[3].shapeFill).toEqual(50);

      // single icon
      const numberIconSingle = 1;
      const shapeFillSingle = 1;
      const singleIconArr = getIconGridArr(numberIconSingle, shapeFillSingle, shapeColorOne, shapeColorTwo);
      expect(singleIconArr[0].shapeColorOne).toEqual(shapeColorTwo);
      expect(singleIconArr[0].shapeColorTwo).toEqual(shapeColorOne);
      expect(singleIconArr[0].shapeFill).toEqual(1);
    });

    test('should generate partially float filled icon grid', () => {
      const numberOfIcons = 10;
      const shapeFill = 63.88888888888889;
      const shapeColorOne = 'red';
      const shapeColorTwo = 'blue';

      const iconArr = getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo);

      // center icon should be partially filled
      expect(iconArr[6].shapeColorOne).toEqual(shapeColorTwo);
      expect(iconArr[6].shapeColorTwo).toEqual(shapeColorOne);
      expect(iconArr[6].shapeFill).toEqual(38);
    });

    test('should generate partially float filled icon grid with correct rounding', () => {
      const numberOfIcons = 5;
      const shapeFill = 1;
      const shapeColorOne = 'red';
      const shapeColorTwo = 'blue';

      const iconArr = getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo);

      // center icon should be partially filled
      expect(iconArr[0].shapeColorOne).toEqual(shapeColorTwo);
      expect(iconArr[0].shapeColorTwo).toEqual(shapeColorOne);
      expect(iconArr[0].shapeFill).toEqual(5);
    });
  });
});
