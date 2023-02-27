import { ResponsiveWidgetBaseData } from '../ResponsiveWidgetBase.types';

enum ComponentWidgetIdKeys {
  BackgroundShape = 'backgroundShape',
  Text = 'text',
}

interface ResponsiveTextWidgetData extends ResponsiveWidgetBaseData<ComponentWidgetIdKeys> {}

export type { ResponsiveTextWidgetData };
export { ComponentWidgetIdKeys };
