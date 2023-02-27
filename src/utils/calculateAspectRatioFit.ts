interface Dimension {
  width: number;
  height: number;
}

/**
 * Resize a box to maxHeight and maxWidth and keep the intrinsic aspect ratio
 *
 * @param naturalWidth - intrinsic width of the box
 * @param naturalHeight - intrinsic height of the box
 * @param maxWidth - max new width width of the box
 * @param maxHeight - max new height height of the box
 * @param
 * @returns
 */
export const calculateAspectRatioFit = (
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
): Dimension => {
  const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
  const width = naturalWidth * ratio;
  const height = naturalHeight * ratio;

  return { width, height };
};
