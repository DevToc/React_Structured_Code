import { ComponentProps, FunctionComponent, memo } from 'react';
import { Icon } from '@chakra-ui/react';

import { WIDGET_ICON_MAP } from './AccessibilityManager.config';
import { WidgetId } from '../../../../types/idTypes';
import { AllWidgetData } from '../../../../widgets/Widget.types';
import { getIconType } from './AccessibilityManager.helpers';

type ReadOrderIconProps = {
  widgetId: WidgetId;
  widgetData: AllWidgetData;
} & ComponentProps<typeof Icon>;

const ReadOrderIcon = memo(({ widgetId, widgetData, ...props }: ReadOrderIconProps) => {
  const type = getIconType(widgetId, widgetData);
  const IconComponent = WIDGET_ICON_MAP[type] as FunctionComponent;

  if (!IconComponent) return null;

  return <Icon as={IconComponent} {...props} />;
});

export { ReadOrderIcon };
