import { generateDefaultData, getAllTextContents, getDominantTextStyleByColor } from '../TableWidget.helpers';

describe('widgets/TableWidget.helpers', () => {
  it('should return an array of text content node', () => {
    const { proseMirrorData } = generateDefaultData().widgetData;
    const list = getAllTextContents(proseMirrorData);

    expect(list.length).toBeGreaterThan(0);
  });

  it('should return most in use color text style', () => {
    const { proseMirrorData } = generateDefaultData().widgetData;
    const style = getDominantTextStyleByColor(proseMirrorData);

    expect(style).toEqual({
      fontFamily: 'Inter',
      fontSize: 12,
      color: 'rgba(43, 43, 53, 1)',
    });
  });
});
