import { Widget } from 'types/widget.types';
import { useWidgetStore } from 'widgets/store';
import { WidgetId } from 'types/idTypes';
import { Subset } from 'types/object.types';
import { NewWidget } from 'widgets/Widget.types';

interface UseWidget<WidgetData> {
  widgetId: WidgetId;
  updateWidget: (data: Subset<WidgetData>) => void;
  replaceWidget: (newWidgetData: NewWidget) => void;
}

/**
 * A simple hook to read and update widgetData in widget components
 * Example: const { widgetId, updateWidget, iconId } = useWidget<IconWidgetData>();
 */
export const useWidget = <WidgetData = Widget>(): UseWidget<WidgetData> & WidgetData => {
  const widget = useWidgetStore();

  return widget as UseWidget<WidgetData> & WidgetData;
};
