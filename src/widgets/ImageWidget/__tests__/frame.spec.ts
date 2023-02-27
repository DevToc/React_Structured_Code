import { createSvgClipPathFrame } from '../Frame/frame';
import { FRAME_SHAPE_LIST } from '../Frame/frame.config';

describe('ImageWidget/Frame/frame.ts', () => {
  describe('createSvgClipPathFrame', () => {
    test('should create an svg element clip path shape for all shapes', () => {
      FRAME_SHAPE_LIST.forEach((frame) => {
        const svgEl = createSvgClipPathFrame(frame.value, '123');
        expect(svgEl.nodeName).toEqual('svg');
        expect(svgEl.outerHTML.includes('clipPath')).toEqual(true);
        expect(svgEl.outerHTML.includes('objectBoundingBox')).toEqual(true);
      });
    });
  });
});
