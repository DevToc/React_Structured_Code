import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useWidget, WidgetToolbar, WidgetBaseProp } from 'widgets/sdk';

import { ResponsiveWidgetBase, ReadOnlyResponsiveWidgetBase } from '../ResponsiveWidgetBase';
import { ResponsiveWidgetBaseData } from '../ResponsiveWidgetBase.types';
import { ComponentWidgetIdKeys } from './ResponsiveTextWidget.types';
import { ResponsiveTextToolbar } from './ResponsiveTextWidgetToolbar';
import { ResponsiveTextLayout } from './ResponsiveTextLayout';

export const ResponsiveTextWidget = ({ getWidgetMemberComponent }: WidgetBaseProp) => {
  const { componentWidgetIdMap, memberWidgetIds } = useWidget<ResponsiveWidgetBaseData>();

  const textWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.Text];
  const shapeWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.BackgroundShape];

  const widgetIdRenderOrder = useMemo(() => [shapeWidgetId, textWidgetId], [shapeWidgetId, textWidgetId]);

  if (!getWidgetMemberComponent) {
    return <Box />;
  }

  return (
    <ResponsiveWidgetBase
      widgetIdRenderOrder={widgetIdRenderOrder}
      fitWidthWidgets={memberWidgetIds}
      fitHeightWidgets={[componentWidgetIdMap[ComponentWidgetIdKeys.BackgroundShape]]}
    >
      <WidgetToolbar>
        <ResponsiveTextToolbar />
      </WidgetToolbar>
      <ResponsiveTextLayout getWidgetMemberComponent={getWidgetMemberComponent} isReadOnly={false} />
    </ResponsiveWidgetBase>
  );
};

export const ReadOnlyResponsiveTextWidget = ({ getWidgetMemberComponent }: WidgetBaseProp) => {
  if (!getWidgetMemberComponent) {
    return <Box />;
  }

  return (
    <ReadOnlyResponsiveWidgetBase>
      <ResponsiveTextLayout getWidgetMemberComponent={getWidgetMemberComponent} isReadOnly />
    </ReadOnlyResponsiveWidgetBase>
  );
};
