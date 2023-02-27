enum ResizeDirection {
  Left = 'Left',
  Right = 'Right',
  Top = 'Top',
  Bottom = 'Bottom',
}

/**
 * Get side handle direction of the direction of a moveable resize event
 */

const getSideHandle = (moveableDirection: number[]) => {
  if (moveableDirection[0] === -1 && moveableDirection[1] === 0) return ResizeDirection.Left;
  if (moveableDirection[0] === 1 && moveableDirection[1] === 0) return ResizeDirection.Right;
  if (moveableDirection[0] === 0 && moveableDirection[1] === -1) return ResizeDirection.Top;
  if (moveableDirection[0] === 0 && moveableDirection[1] === 1) return ResizeDirection.Bottom;

  return '';
};

/**
 * Check if the moveable drag event is from a side handle
 */
const isSideHandle = (moveableDirection: number[]): boolean => !!getSideHandle(moveableDirection);
/**
 * Check if the moveable drag event is from a corner handle
 */
const isCornerHandle = (moveableDirection: number[]): boolean => !isSideHandle(moveableDirection);

export { isSideHandle, getSideHandle, ResizeDirection, isCornerHandle };
