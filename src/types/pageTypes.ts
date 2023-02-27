import type { WidgetId } from './idTypes';

interface Page {
  background: string;
  widgetLayerOrder: WidgetId[];
  widgetStructureTree: [string, {}, Array<any> | string];
}

export type { Page };
