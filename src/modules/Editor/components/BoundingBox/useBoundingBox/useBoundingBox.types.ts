import { ReactNode, RefObject } from 'react';
import {
  SetWidgetRef,
  CleanupWidgetBoundingBoxConfig,
  SetCustomWidgetOverride,
} from '../../../../../widgets/Widget.types';
import { WidgetRefConfig } from '../BoundingBox.types';
import { WidgetId } from '../../../../../types/idTypes';
import { Direction } from '../../../../../constants/bounding-box';

interface Resize {
  width?: number;
  height?: number;
  offsetHeight?: number;
  offsetWidth?: number;
  deltaWidth?: number;
  deltaHeight?: number;
  keepRatio?: boolean;
  side?: Direction;
  direction?: number[];
}

interface Move {
  deltaX?: number;
  deltaY?: number;
}

interface Rotate {
  deltaRotate: number;
}

interface BoundingBoxProviderProps {
  children: ReactNode;
}

interface WidgetBoundingBoxRef {
  [key: WidgetId]: WidgetRefConfig;
}

interface BoundingBoxContextI {
  widgetRefs: WidgetBoundingBoxRef;
  boundingBox: BoundingBoxRef;
  setWidgetRef: SetWidgetRef;
  cleanupWidgetBoundingBoxConfig: CleanupWidgetBoundingBoxConfig;
  setCustomWidgetOverride: SetCustomWidgetOverride;
}

interface BoundingBoxRef {
  resize: (args: Resize) => void;
  move: (args: Move) => void;
  rotate: (args: Rotate) => void;
  updateRect: () => void;
  _moveable: any;
}

export type {
  Resize,
  Move,
  Rotate,
  BoundingBoxProviderProps,
  WidgetBoundingBoxRef,
  BoundingBoxContextI,
  BoundingBoxRef,
};
