import { BoundingBoxRect, TextStyle } from 'utils/useTextMeasure/types';
import memoize from './memoize';

const MIN_FONT_SIZE = 1;

/**
 * Cacluate max possible font size that fit in giving bounding box
 *
 * @param {String} text - Plain text
 * @param {Object} style - Text style
 * @param {Object} rect - Bounding box
 * @returns {Object}  return text size
 */
function calcTextSizeFitBoundingBox(text: string, style: TextStyle, rect: BoundingBoxRect): number {
  let container;

  try {
    if (!text.length || !style.fontFamily || !rect.width || !rect.height) {
      throw new Error('Invalid arguments');
    }

    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-100%';
    container.style.left = '-100%';
    container.style.width = '0';
    container.style.height = '0';
    container.style.opacity = '0';

    const textEl = document.createElement('div');
    const textSpan = document.createElement('span');

    container.appendChild(textEl);
    textEl.appendChild(textSpan);
    document.body.appendChild(container);

    const { fontFamily, fontWeight, lineHeight } = style;

    Object.assign(textEl.style, {
      fontFamily,
      fontWeight: String(fontWeight),
      lineHeight: String(lineHeight),
      width: `${rect.width}px`,
    });

    textSpan.textContent = text;

    let words = text
      .trim()
      .split(/\s+/)
      .sort((w1, w2) => w1.length - w2.length);

    // Estimate initial approximate font size base on word count and longest word
    let stepSize = Math.max(rect.width / words[words.length - 1].length, rect.height / words.length);
    let fontSize = stepSize;
    let marginSize = 1;

    while (stepSize > marginSize) {
      textEl.style.fontSize = `${fontSize}px`;
      const { width, height } = textSpan.getBoundingClientRect();

      /**
       * If current font size is result of text span container dimension closes to
       * giving bounding box rect, exit loop
       */
      if (
        width > rect.width - marginSize &&
        width < rect.width + marginSize &&
        height > rect.height - marginSize &&
        height < rect.height + marginSize
      )
        break;

      // Binary search pivot
      stepSize /= 2;

      if (width < rect.width && height < rect.height) {
        fontSize += stepSize;
      } else {
        fontSize -= stepSize;
      }
    }

    return Math.max(fontSize - marginSize, MIN_FONT_SIZE);
  } catch (e: unknown) {
    console.warn('Unable to calculate text size', e);
    return MIN_FONT_SIZE;
  } finally {
    container?.remove();
  }
}

export default memoize(calcTextSizeFitBoundingBox, (...args) => args?.map((arg) => JSON.stringify(arg)).join('_'));
