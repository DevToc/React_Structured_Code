import calcTextSize from '../calcTextSize';

describe('hooks/useTextMeasure/calcTextSize', () => {
  it('should calculate max font size that fit in giving bounding box rect', async () => {
    const text = 'This is a test sentence.';
    const textStyle = { fontFamily: 'Inter', fontWeight: 'normal', lineHeight: '1.2' };
    const boundingBoxRect = { width: 200, height: 100 };

    const fontSize = calcTextSize(text, textStyle, boundingBoxRect);

    expect(Math.floor(fontSize)).toBe(42);
  });
});
