import { useCallback } from 'react';

import { WidgetId } from 'types/idTypes';
import { useWidget, useGroupIdCache, ReadOnlyWidgetBase, WidgetBase, WidgetBaseProp } from 'widgets/sdk';
import { ResponsiveWidgetBaseData } from './ResponsiveWidgetBase.types';
import { ResponsiveWidgetProvider } from './useResponsiveWidget';
import { CustomOnResizeEnd } from 'modules/Editor/components/BoundingBox';
import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox';

interface ResponsiveWidgetBaseProps extends WidgetBaseProp {
  // Array of widget ids in the order that they are rendered
  // Used to set up the GroupIdCache so that the BB selection states are correct.
  widgetIdRenderOrder: WidgetId[];

  fitWidthWidgets?: WidgetId[];
  fitHeightWidgets?: WidgetId[];
  isFitContentWidth?: boolean;
}

export const ResponsiveWidgetBase = ({
  children,
  widgetIdRenderOrder,
  fitWidthWidgets,
  fitHeightWidgets,
  isFitContentWidth = false,
  ...widgetBaseProps
}: ResponsiveWidgetBaseProps) => {
  const { widgetId } = useWidget<ResponsiveWidgetBaseData>();
  const { boundingBox } = useBoundingBox();

  useGroupIdCache(widgetId, widgetIdRenderOrder, true, widgetIdRenderOrder.length);

  const customOnResizeEnd = useCallback(
    ({ onResizeEnd, event }: CustomOnResizeEnd) => {
      onResizeEnd(event);
      event.target.style.height = 'fit-content';

      setTimeout(() => boundingBox.updateRect(), 0);
    },
    [boundingBox],
  );

  return (
    <WidgetBase
      isResponsiveWidgetBase
      isFitContentWidth={isFitContentWidth}
      onResizeEnd={customOnResizeEnd}
      {...widgetBaseProps}
    >
      <ResponsiveWidgetProvider
        responsiveWidgetId={widgetId}
        fitWidthWidgets={fitWidthWidgets}
        fitHeightWidgets={fitHeightWidgets}
      >
        {children}
      </ResponsiveWidgetProvider>
    </WidgetBase>
  );
};

export const ReadOnlyResponsiveWidgetBase = ({ children }: WidgetBaseProp) => {
  const { widgetId } = useWidget<ResponsiveWidgetBaseData>();

  return (
    <ReadOnlyWidgetBase isResponsiveWidgetBase>
      <ResponsiveWidgetProvider responsiveWidgetId={widgetId}>{children}</ResponsiveWidgetProvider>
    </ReadOnlyWidgetBase>
  );
};
