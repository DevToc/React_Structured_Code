import { generateShapeStyle } from '../BasicShapeWidget.helpers';

describe('widgets/BasicShapeWidget.helpers', () => {
  it('should generate mirror style correctly', () => {
    const defaultStyle = { position: 'absolute' };
    const testMirrorData = [
      {
        // no mirror
        mirrorData: { isHorizontal: false, isVertical: false },
        expectedStyle: { ...defaultStyle },
      },
      {
        // horizontal and vertical mirror
        mirrorData: { isHorizontal: true, isVertical: true },
        expectedStyle: { ...defaultStyle, transform: 'scale(-1, -1)', transformOrigin: 'center' },
      },
    ];

    testMirrorData.forEach((testData) => {
      const { mirrorData, expectedStyle } = testData;
      const style = generateShapeStyle(mirrorData);
      expect(style).toEqual(expectedStyle);
    });
  });
});
