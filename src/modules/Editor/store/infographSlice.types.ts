import { PageId, WidgetId } from 'types/idTypes';
import { AllWidgetData } from 'widgets/Widget.types';

export enum WidgetDirection {
  Up = 'up',
  Down = 'down',
  Front = 'front',
  Back = 'back',
}

export type AddGroupWidget = {
  widgetId: WidgetId;
  widgetData: AllWidgetData;
  groupWidgets?: AddGroupWidget[];
};

export type AddWidget = {
  pageId: PageId;
  widgetId: WidgetId;
  widgetData: AllWidgetData;
  groupWidgets?: AddGroupWidget[];
  isResponsiveGroup?: boolean;
};
