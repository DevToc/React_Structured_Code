import { useLayoutEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { WidgetBaseProp, WidgetToolbar, useWidget, useEditor, TransparentImg } from 'widgets/sdk';
import { ResponsiveWidgetBase, ReadOnlyResponsiveWidgetBase } from '../ResponsiveWidgetBase';
import { CHART_TYPE_MAP } from './types';
import { ComponentWidgetIdKeys, StatChartWidgetData, StatChartType } from './StatChartWidget.types';
import { StatChartWidgetToolbar } from './StatChartWidgetToolbar';
import { setActiveWidget, useAppDispatch } from 'modules/Editor/store';
import { usePrevious } from 'hooks/usePrevious';

export const StatChartWidget = ({ getWidgetMemberComponent }: WidgetBaseProp) => {
  const { componentWidgetIdMap, widgetId, type } = useWidget<StatChartWidgetData>();
  const dispatch = useAppDispatch();
  const { isWidgetSelected } = useEditor();
  const prevIsWidgetSelected = usePrevious(isWidgetSelected);
  const prevType = usePrevious(type);

  const widgetIdRenderOrder = useMemo(() => {
    if (type === StatChartType.Icon) {
      return [
        componentWidgetIdMap[ComponentWidgetIdKeys.MetricText],
        componentWidgetIdMap[ComponentWidgetIdKeys.IconGrid],
      ];
    }

    return [
      componentWidgetIdMap[ComponentWidgetIdKeys.Chart],
      componentWidgetIdMap[ComponentWidgetIdKeys.MetricText],
      componentWidgetIdMap[ComponentWidgetIdKeys.IconGrid],
    ];
  }, [componentWidgetIdMap, type]);

  const fitWidthWidgets = useMemo(() => {
    if (type === StatChartType.ProgressBar) {
      return [componentWidgetIdMap[ComponentWidgetIdKeys.MetricText]];
    }

    return [];
  }, [componentWidgetIdMap, type]);

  // Update bounding box when the type changes
  // Need to reselect the widget if it was previously selected because the layout changed
  useLayoutEffect(() => {
    if (prevIsWidgetSelected && isWidgetSelected && prevType !== type) {
      dispatch(setActiveWidget(widgetId));
    }
  }, [prevIsWidgetSelected, isWidgetSelected, type, dispatch, widgetId, prevType]);

  const StatChartLayout = CHART_TYPE_MAP[type];

  return (
    <ResponsiveWidgetBase
      fitWidthWidgets={fitWidthWidgets}
      isFitContentWidth={type === StatChartType.Icon}
      widgetIdRenderOrder={widgetIdRenderOrder}
    >
      <WidgetToolbar>
        <StatChartWidgetToolbar />
      </WidgetToolbar>
      <StatChartLayout getWidgetMemberComponent={getWidgetMemberComponent!} />
    </ResponsiveWidgetBase>
  );
};

export const ReadOnlyStatChartWidget = ({ getWidgetMemberComponent, includeAltTextImg }: WidgetBaseProp) => {
  const { type } = useWidget<StatChartWidgetData>();

  const StatChartLayout = CHART_TYPE_MAP[type];

  return (
    <ReadOnlyResponsiveWidgetBase>
      {includeAltTextImg && <TransparentImg />}
      {/* Member components should not be tagged in export */}
      <Box aria-hidden={true}>
        <StatChartLayout getWidgetMemberComponent={getWidgetMemberComponent!} isReadOnly />
      </Box>
    </ReadOnlyResponsiveWidgetBase>
  );
};
