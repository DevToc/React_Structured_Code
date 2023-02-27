import { useCallback } from 'react';

import { Key, Step } from '../../../constants/keyboard';
import { useEventListener } from '../../../hooks/useEventListener';
import { Direction, DIRECTION_MAP } from '../../../constants/bounding-box';

interface UseCropKeyboardShortcuts {
  imageMoveableRef: any;
  cropAreaMoveableRef: any;
  keepRatio: boolean;
  closeCrop: () => void;
}

export const useCropKeyboardShortcuts = ({
  imageMoveableRef,
  cropAreaMoveableRef,
  closeCrop,
  keepRatio,
}: UseCropKeyboardShortcuts) => {
  const moveImage = useCallback(
    (key: Key, px: number) => {
      const request: { deltaX?: number; deltaY?: number } = {};

      if (key === Key.DownArrow) request.deltaY = px;
      if (key === Key.UpArrow) request.deltaY = -px;
      if (key === Key.LeftArrow) request.deltaX = -px;
      if (key === Key.RightArrow) request.deltaX = px;

      return imageMoveableRef.current?.request('draggable', request, true);
    },
    [imageMoveableRef],
  );

  const resizeCropArea = useCallback(
    (key: Key, px: number, side: Direction = Direction.SOUTH_EAST) => {
      const request = { deltaWidth: 0, deltaHeight: 0, keepRatio, direction: DIRECTION_MAP[side] };

      if (key === Key.DownArrow || key === Key.RightArrow) {
        request.deltaWidth = px;
        request.deltaHeight = px;
      }

      if (key === Key.UpArrow || key === Key.LeftArrow) {
        request.deltaWidth = -px;
        request.deltaHeight = -px;
      }

      cropAreaMoveableRef.current?.request('resizable', request, true);
    },
    [cropAreaMoveableRef, keepRatio],
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent | Event) => {
      const event = e as KeyboardEvent;
      const key: Key = event.which || event.keyCode;

      const isMod: boolean = event.metaKey || event.ctrlKey;
      const isShift: boolean = event.shiftKey;
      const isAlt: boolean = event.altKey;

      switch (key) {
        case Key.DownArrow:
        case Key.UpArrow:
        case Key.RightArrow:
        case Key.LeftArrow:
          e.preventDefault();

          const isVertical = key === Key.UpArrow || key === Key.DownArrow;
          const isHorizontal = key === Key.LeftArrow || key === Key.RightArrow;

          if (isMod && isAlt) return resizeCropArea(key, Step.Medium);
          if (isMod && isShift && isVertical) return resizeCropArea(key, Step.Medium, Direction.SOUTH);
          if (isMod && isShift && isHorizontal) return resizeCropArea(key, Step.Medium, Direction.EAST);

          if (isMod && isVertical) return resizeCropArea(key, Step.Small, Direction.SOUTH);
          if (isMod && isHorizontal) return resizeCropArea(key, Step.Small, Direction.EAST);

          if (isShift) return moveImage(key, Step.Medium);

          return moveImage(key, Step.Small);
        case Key.Escape:
          return closeCrop();
      }
    },
    [resizeCropArea, moveImage, closeCrop],
  );

  useEventListener('keydown', handleKeydown);
};
