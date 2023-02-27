import { forwardRef, ReactElement, useRef, Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import HighchartsReact from 'highcharts-react-official';

import { useDynamicImport } from 'hooks/useDynamicImport';

import { useResponsiveHighchart } from '../Chartwidget.hooks';
import { HighChartsWrapper } from '../HighChartsWrapper';
import { DataTableChartMenuSettings } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommonMenuSettings';
import { WidgetType } from 'types/widget.types';
import {
  useEditor,
  useWidget,
  ReadOnlyWidgetBase,
  WidgetBase,
  WidgetToolbar,
  WidgetSideMenuSettings,
  TransparentImg,
} from 'widgets/sdk';

import { WidgetComponentsMap } from 'widgets/components.lazy';

const ChartWidgetToolbarMenu = (): ReactElement => {
  const Component = useDynamicImport('chartWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};

export const LineChartWidget = (): ReactElement => {
  const { widthPx, heightPx } = useWidget();
  const { openWidgetSideMenu } = useEditor();
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const { customOnResize } = useResponsiveHighchart({ chartRef, heightPx, widthPx });

  return (
    <WidgetBase onResize={customOnResize} onDoubleClick={openWidgetSideMenu}>
      <WidgetSideMenuSettings>
        <DataTableChartMenuSettings
          showGridLinesConfiguration
          showAxisConfiguration
          showLabelsConfiguration
          showLegendsConfiguration
          showPatterns
        />
      </WidgetSideMenuSettings>
      <WidgetToolbar>
        <ChartWidgetToolbarMenu />
      </WidgetToolbar>
      <LineChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyLineChartWidget = ({ includeAltTextImg }: { includeAltTextImg?: boolean }): ReactElement => {
  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <LineChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const LineChart = forwardRef<HighchartsReact.RefObject>((_, chartRef) => {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.LineChart} />;
});
