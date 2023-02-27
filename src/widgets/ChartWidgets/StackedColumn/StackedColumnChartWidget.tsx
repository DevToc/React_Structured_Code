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
  WidgetBaseProp,
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

export const StackedColumnChartWidget = (): ReactElement => {
  const { widthPx, heightPx } = useWidget();
  const { openWidgetSideMenu } = useEditor();
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const { customOnResize } = useResponsiveHighchart({ chartRef, heightPx, widthPx });

  return (
    <WidgetBase onDoubleClick={openWidgetSideMenu} onResize={customOnResize}>
      <WidgetSideMenuSettings>
        <DataTableChartMenuSettings
          showGridLinesConfiguration
          showAxisConfiguration
          showLabelsConfiguration
          showLegendsConfiguration
          showBorderColor
          showBorderWidth
          showPatterns
        />
      </WidgetSideMenuSettings>
      <WidgetToolbar>
        <ChartWidgetToolbarMenu />
      </WidgetToolbar>
      <StackedColumnChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyStackedColumnChartWidget = ({ includeAltTextImg }: WidgetBaseProp): ReactElement => {
  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <StackedColumnChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const StackedColumnChart = forwardRef<HighchartsReact.RefObject>(function StackedColumnChart(_, chartRef) {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.StackedColumnChart} />;
});
