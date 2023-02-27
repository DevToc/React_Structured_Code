import { colord, extend, RgbColor, RgbaColor } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { Rect, Ratio, Score } from './useColorContrastChecker.types';

extend([a11yPlugin]);

export const buildRgb = (imageData: Uint8ClampedArray): RgbColor[] => {
  const rgbValues = [];
  // note that we are loopin every 4!
  // for every Red, Green, Blue and Alpha
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };

    rgbValues.push(rgb);
  }

  return rgbValues;
};

// returns what color channel has the biggest difference
const findBiggestColorRange = (rgbValues: RgbColor[]) => {
  /**
   * Min is initialized to the maximum value posible
   * from there we procced to find the minimum value for that color channel
   *
   * Max is initialized to the minimum value posible
   * from there we procced to fin the maximum value for that color channel
   */
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbValues.forEach((pixel: RgbColor) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  // determine which color has the biggest difference
  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return 'r';
  } else if (biggestRange === gRange) {
    return 'g';
  } else {
    return 'b';
  }
};

/**
 * Median cut implementation
 * can be found here -> https://en.wikipedia.org/wiki/Median_cut
 */
export const quantization = (rgbValues: RgbColor[], depth: number): RgbColor[] => {
  const MAX_DEPTH = 4;

  // Base case
  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev: RgbColor, curr: RgbColor) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;

        return prev;
      },
      {
        r: 0,
        g: 0,
        b: 0,
      },
    );

    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);

    return [color];
  }

  /**
   *  Recursively do the following:
   *  1. Find the pixel channel (red,green or blue) with biggest difference/range
   *  2. Order by this channel
   *  3. Divide in half the rgb colors list
   *  4. Repeat process again, until desired depth or base case
   */
  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1: RgbColor, p2: RgbColor) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = rgbValues.length / 2;
  return [...quantization(rgbValues.slice(0, mid), depth + 1), ...quantization(rgbValues.slice(mid + 1), depth + 1)];
};

// Generate RGB list in the specific area using the canvas
export const getAllCanvasRGB = (canvas: HTMLCanvasElement, rect: Rect): RgbColor[] => {
  const ctx = canvas.getContext('2d');

  if (!ctx) return [];

  const imageData = ctx.getImageData(rect.xPx, rect.yPx, rect.widthPx, rect.heightPx);
  const rgbArray = buildRgb(imageData.data);
  return rgbArray;
};

// Convert the rgba to rgb due to the fact that Colord library's contrast function doesn't use the alpha value
const rgbaToRgb = (rgbaBackground: RgbColor, rgbaColor: RgbaColor) =>
  colord({
    r: (1 - rgbaColor.a) * rgbaBackground.r + rgbaColor.a * rgbaColor.r,
    g: (1 - rgbaColor.a) * rgbaBackground.g + rgbaColor.a * rgbaColor.g,
    b: (1 - rgbaColor.a) * rgbaBackground.b + rgbaColor.a * rgbaColor.b,
  });

export const calculateRatio = (targetColor: RgbaColor, quantColors: RgbColor[]) =>
  quantColors.map((quantColor: RgbColor) => ({
    hex: colord(quantColor).toHex(),
    rgb: quantColor,
    ratio: colord(quantColor).contrast(rgbaToRgb(quantColor, targetColor)),
  }));

const checkLargeText = (fontSize: number | null, fontWeight: string | null) => {
  if (!fontSize) return false;
  if (!fontWeight) return fontSize >= 24;
  return (fontWeight.toLowerCase() === 'bold' && fontSize >= 19) || fontSize >= 24;
};

// https://www.w3.org/TR/WCAG21/
const getScoreByRatio = (ratio: number, isText: boolean, isLargeText: boolean): string => {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA Large';
    if (ratio >= 3) return 'AA Large';
  } else if (isText) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
  } else if (ratio >= 3) return 'AA'; // Graphical Objects and User Interface Components

  return 'Fail';
};

// Calculate the ratio to score string
export const parseRatioToScore = (ratioList: Ratio[], fontSize: number | null, fontWeight: string | null) => {
  const isText = fontSize !== null;
  const isLargeText = isText && checkLargeText(fontSize, fontWeight);
  const scoreList: Score[] = ratioList.map(
    ({ hex, ratio }: Ratio): Score => ({
      hex,
      ratio,
      score: getScoreByRatio(ratio, isText, isLargeText),
    }),
  );

  const countPerScore = scoreList.reduce((prev: any, cur: Score) => {
    prev[cur.score] = prev?.[cur.score] === undefined ? 1 : prev[cur.score] + 1;
    return prev;
  }, {});

  const result = scoreList.map((data: Score) => {
    const accuracy = (100 * countPerScore?.[data.score]) / scoreList.length;
    data.accuracy = Math.trunc(accuracy * 100) / 100;
    return data;
  });

  return result;
};
