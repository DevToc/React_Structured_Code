import { WidgetId } from 'types/idTypes';
import { GroupWidgetData } from 'widgets/GroupWidget/GroupWidget.types';

type ComponentWidgetIdMapType<KeyType extends string> = {
  [key in KeyType]: WidgetId;
};

interface ResponsiveWidgetBaseData<ComponentIdMapKeyType extends string = string> extends GroupWidgetData {
  componentWidgetIdMap: ComponentWidgetIdMapType<ComponentIdMapKeyType>;
}

export type { ResponsiveWidgetBaseData, ComponentWidgetIdMapType };
