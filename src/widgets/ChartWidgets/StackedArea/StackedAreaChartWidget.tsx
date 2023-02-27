import { ReactElement, useRef, forwardRef, Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import Highcharts from 'highcharts';

import { useDynamicImport } from 'hooks/useDynamicImport';

import HighchartsReact from 'highcharts-react-official';
import { WidgetType } from 'types/widget.types';
import { useResponsiveHighchart } from '../Chartwidget.hooks';
import { HighChartsWrapper } from '../HighChartsWrapper';
import { DataTableChartMenuSettings } from '../DataTableChartCommon/DataTableChartCommonMenuSettings';
import {
  useEditor,
  useWidget,
  ReadOnlyWidgetBase,
  WidgetBase,
  WidgetToolbar,
  WidgetSideMenuSettings,
  WidgetBaseProp,
  TransparentImg,
} from 'widgets/sdk';

import { WidgetComponentsMap } from 'widgets/components.lazy';

// Required so Marker Symbol is drawn at Legend same as Line charts
// https://www.highcharts.com/forum/viewtopic.php?t=41532
declare module 'highcharts/highcharts' {
  let seriesTypes: Highcharts.Dictionary<typeof Highcharts.Series>;
}
// @ts-ignore
Highcharts.seriesTypes.area.prototype.drawLegendSymbol = Highcharts.seriesTypes.line.prototype.drawLegendSymbol;

const ChartWidgetToolbarMenu = (): ReactElement => {
  const Component = useDynamicImport('chartWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};

export const StackedAreaChartWidget = (): ReactElement => {
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
      <StackedAreaChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyStackedAreaChartWidget = ({ includeAltTextImg }: WidgetBaseProp): ReactElement => {
  return (
    <ReadOnlyWidgetBase>
      <StackedAreaChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const StackedAreaChart = forwardRef<HighchartsReact.RefObject>((_, chartRef) => {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.StackedAreaChart} />;
});
