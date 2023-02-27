import { ReactElement, useRef, forwardRef, Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import HighchartsReact from 'highcharts-react-official';

import { useDynamicImport } from 'hooks/useDynamicImport';

import {
  useWidget,
  useEditor,
  WidgetBase,
  ReadOnlyWidgetBase,
  WidgetToolbar,
  WidgetSideMenuSettings,
  TransparentImg,
} from 'widgets/sdk';
import { useResponsiveHighchart } from '../Chartwidget.hooks';
import { HighChartsWrapper } from '../HighChartsWrapper';
import { DataTableChartMenuSettings } from '../DataTableChartCommon/DataTableChartCommonMenuSettings';

import { WidgetComponentsMap } from 'widgets/components.lazy';
import { WidgetType } from 'types/widget.types';

const ChartWidgetToolbarMenu = (): ReactElement => {
  const Component = useDynamicImport('chartWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};

export const AreaChartWidget = (): ReactElement => {
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
      <AreaChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyAreaChartWidget = ({ includeAltTextImg }: { includeAltTextImg?: boolean }): ReactElement => {
  return (
    <ReadOnlyWidgetBase>
      <AreaChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const AreaChart = forwardRef<HighchartsReact.RefObject>((_, chartRef) => {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.AreaChart} />;
});
