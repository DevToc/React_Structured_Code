import { createContext, useRef, useCallback, useContext } from 'react';
import { proxy, useSnapshot } from 'valtio';

import { Widget } from 'types/widget.types';
import { WidgetId } from 'types/idTypes';
import { Subset } from 'types/object.types';
import { useAppSelector, useAppDispatch, addNewWidgetAndReplaceExisting } from 'modules/Editor/store';
import { updateWidget } from 'modules/Editor/store/infographSlice';
import { selectCropId } from 'modules/Editor/store/widgetSelector';
import { NewWidget } from 'widgets/Widget.types';

type StoreWidget = {
  widgetId: WidgetId;
  updateWidget: (data: Partial<Widget>) => void;
  replaceWidget: (newWidget: NewWidget) => void;
} & Widget;

interface WidgetStoreI {
  widget: StoreWidget;
}

type WidgetStoreProps = {
  widgetId: WidgetId;
  zIndex?: number;
  // The customWidgetData is used to override the default widget data
  // This is needed for responsive widgets, where the base widget data can be different
  customWidgetData?: Partial<Widget>;
  children: React.ReactNode;
};

const WidgetStoreContext = createContext<WidgetStoreI>({
  widget: {
    widgetId: '',
    updateWidget: (data: Subset<Widget>) => {},
    replaceWidget: (newWidget: NewWidget) => {},
    topPx: 0,
    leftPx: 0,
    version: 0,
    widthPx: 0,
    heightPx: 0,
    rotateDeg: 0,
  },
});

/**
 * A hook to connect to the widget store
 * This is an internal component, and should only be used for internal widget sdk purposes.
 */
export const useWidgetStore = () => {
  const widgetStore = useContext(WidgetStoreContext);
  const widgetStoreSnapshot = useSnapshot(widgetStore);

  return widgetStoreSnapshot.widget;
};

/**
 * A React Context Provider that provides the widget data through a reactive proxy.
 * The store is kept in sync with the widget in the infograph.
 * This is an internal component, and should only be used for internal widget sdk purposes.
 */
export const WidgetStore = ({ widgetId, zIndex: baseZIndex, customWidgetData, children }: WidgetStoreProps) => {
  const dispatch = useAppDispatch();

  // widget data subscription from redux
  const wData = useAppSelector((state) => state.infograph.widgets[widgetId]);

  const onUpdateWidget = useCallback(
    (widgetData: Partial<Widget>) => {
      dispatch(updateWidget({ widgetId, widgetData }));
    },
    [dispatch, widgetId],
  );

  const onReplaceWidget = useCallback(
    (newWidgetData: NewWidget) => {
      dispatch(addNewWidgetAndReplaceExisting({ widgetId, newWidgetData }));
    },
    [dispatch, widgetId],
  );

  // If a widget is in crop view -> render the widget on top of all other page widgets
  const cropId = useAppSelector(selectCropId);
  const isCropping = widgetId === cropId;
  const zIndex = isCropping ? 999999 : baseZIndex;

  const widget = {
    ...wData,
    zIndex,
    ...customWidgetData,
    widgetId,
    updateWidget: onUpdateWidget,
    replaceWidget: onReplaceWidget,
  };
  const state = useRef<WidgetStoreI>(proxy({ widget })).current;

  // sync widget store with redux
  state.widget = widget;

  return <WidgetStoreContext.Provider value={state}>{children}</WidgetStoreContext.Provider>;
};
