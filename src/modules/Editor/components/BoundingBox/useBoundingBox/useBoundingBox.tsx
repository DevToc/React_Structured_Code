import { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import {
  BoundingBoxRef,
  BoundingBoxContextI,
  BoundingBoxProviderProps,
  WidgetBoundingBoxRef,
  Resize,
  Rotate,
  Move,
} from './useBoundingBox.types';
import { SetWidgetRef, CleanupWidgetBoundingBoxConfig, SetCustomWidgetOverride } from 'widgets/Widget.types';
import { DIRECTION_MAP, Direction } from 'constants/bounding-box';
import { useAppStore, RootState } from 'modules/Editor/store';
import { selectActiveWidgetIds } from 'modules/Editor/store/widgetSelector';
import { getWidgetRotatable } from '../BoundingBox.helpers';

const DEFAULT_BOUNDING_BOX_REF = {
  resize: () => {},
  updateRect: () => {},
  move: () => {},
  rotate: () => {},
  _moveable: {},
};

const defaultBoundingBoxContext = {
  boundingBox: DEFAULT_BOUNDING_BOX_REF,
  widgetRefs: {},
  setWidgetRef: () => {},
  cleanupWidgetBoundingBoxConfig: () => {},
  setCustomWidgetOverride: () => {},
};

const BoundingBoxContext = createContext<BoundingBoxContextI>(defaultBoundingBoxContext);

export const BoundingBoxProvider = ({ children }: BoundingBoxProviderProps) => {
  const widgetRefs = useRef<WidgetBoundingBoxRef>({});
  const boundingBox = useRef<BoundingBoxRef>(DEFAULT_BOUNDING_BOX_REF);
  const store = useAppStore();

  const setWidgetRef: SetWidgetRef = useCallback((id, ref) => {
    if (ref) widgetRefs.current[id] = { ...widgetRefs.current[id], element: ref };
  }, []);

  const cleanupWidgetBoundingBoxConfig: CleanupWidgetBoundingBoxConfig = useCallback(
    (id) => {
      if (!widgetRefs.current || !widgetRefs.current[id]) return;

      // if the widget exists in infograph don't remove it from the widgetRefs
      // as the widget ref is still needed for selection
      const widgets = (store.getState() as RootState).infograph.widgets;
      if (widgets[id]) return;

      delete widgetRefs.current[id];
    },
    [store],
  );

  const setCustomWidgetOverride: SetCustomWidgetOverride = useCallback(
    (id, boundingBoxFunction, boundingBoxFunctionName) => {
      widgetRefs.current[id] = { ...widgetRefs.current[id], [boundingBoxFunctionName]: boundingBoxFunction };
    },
    [],
  );

  return (
    <BoundingBoxContext.Provider
      value={{
        setWidgetRef,
        cleanupWidgetBoundingBoxConfig,
        setCustomWidgetOverride,
        boundingBox: boundingBox.current,
        widgetRefs: widgetRefs.current,
      }}
    >
      {children}
    </BoundingBoxContext.Provider>
  );
};

const isInstant = true;

const hasOnlyLeftRightHandles = (renderDirections: string[]) => {
  if (renderDirections.length === 2 && renderDirections.includes('e') && renderDirections.includes('w')) return true;
  return false;
};

export const useExtendBoundingBoxWithMoveable = ({
  boundingBox,
  moveableRef,
}: {
  boundingBox: BoundingBoxRef;
  moveableRef: any;
}) => {
  const store = useAppStore();

  useEffect(() => {
    const resize = ({
      width,
      height,
      deltaWidth = 0,
      deltaHeight = 0,
      keepRatio = false,
      side = Direction.SOUTH_EAST,
    }: Resize) => {
      if (!moveableRef.current) return;

      const { renderDirections } = moveableRef.current.props;
      const isVerticalDirection = side === Direction.SOUTH || side === Direction.NORTH;

      // Moveable doesn't prevent keyboard resizing from top and bottom if bounding box only has side-handles
      if (hasOnlyLeftRightHandles(renderDirections) && isVerticalDirection) return;

      const request: Resize = { keepRatio, direction: DIRECTION_MAP[side], deltaWidth, deltaHeight };
      if (height) request.offsetHeight = height;
      if (width) request.offsetWidth = width;

      moveableRef.current.request('resizable', request, isInstant);
    };

    const move = ({ deltaX = 0, deltaY = 0 }: Move) => {
      const request: Move = { deltaX, deltaY };

      return moveableRef.current?.request('draggable', request, isInstant);
    };

    const rotate = ({ deltaRotate = 0 }: Rotate) => {
      const request: Rotate = { deltaRotate };

      // we only need the active widget ids in here when this function is called
      // moving this outside to a selector leads to a lot of re-rendering
      const activeWidgetIds = selectActiveWidgetIds(store.getState() as RootState);
      const isRotatable = getWidgetRotatable(activeWidgetIds);
      if (!isRotatable) return;

      return moveableRef.current?.request('rotatable', request, isInstant);
    };

    const updateRect = () => moveableRef.current?.updateRect();

    // exposed to widgets
    boundingBox.resize = resize;
    boundingBox.rotate = rotate;
    boundingBox.move = move;
    boundingBox.updateRect = updateRect;
    boundingBox._moveable = moveableRef.current;
  }, [boundingBox, moveableRef, store]);
};

export const EmptyBoundingBoxProvider = ({ children }: BoundingBoxProviderProps) => {
  return <BoundingBoxContext.Provider value={defaultBoundingBoxContext}>{children}</BoundingBoxContext.Provider>;
};

export const useBoundingBox = (): BoundingBoxContextI => {
  const boundingBox = useContext(BoundingBoxContext);

  return boundingBox;
};
