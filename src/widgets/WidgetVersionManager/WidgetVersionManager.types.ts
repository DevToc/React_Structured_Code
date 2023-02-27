import { Widget, WidgetType } from 'types/widget.types';
import { WidgetsMap } from 'types/infographTypes';

export interface WidgetVersionController {
  version: number;
  // upgrade the widget to the version above
  // Can optionally return WidgetMap if a new widget needs to be added
  // i.e. for responsive widgets that require a new member widget
  upgrade: (widget: Widget, memberWidgets: WidgetsMap) => void | WidgetsMap;
}

export type WidgetVersionConfig = {
  [key in WidgetType]: {
    controllers: WidgetVersionController[];
    latestVersion: number;
  };
};
