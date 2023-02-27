import { calculateAspectRatioFit } from '../calculateAspectRatioFit';

describe('utils/calculateAspectRatioFit', () => {
  test('should calculate correct aspect ratio for same aspect ratio size', () => {
    const { width, height } = calculateAspectRatioFit(1080, 1080, 540, 540);

    expect(width).toEqual(540);
    expect(height).toEqual(540);
  });

  test('should calculate correct aspect ratio for new aspect ratio size', () => {
    const { width, height } = calculateAspectRatioFit(1080, 1080, 1920, 1080);

    expect(width).toEqual(1080);
    expect(height).toEqual(1080);
  });
});
