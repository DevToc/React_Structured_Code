import { forwardRef, ReactElement, useRef, Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import HighchartsReact from 'highcharts-react-official';

import { useDynamicImport } from 'hooks/useDynamicImport';

import { useResponsiveHighchart } from '../Chartwidget.hooks';
import { HighChartsWrapper } from '../HighChartsWrapper';
import { DataTableChartMenuSettings } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommonMenuSettings';
import { WidgetType } from 'types/widget.types';
import {
  ReadOnlyWidgetBase,
  TransparentImg,
  useEditor,
  useWidget,
  WidgetBase,
  WidgetSideMenuSettings,
  WidgetToolbar,
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

export const BarChartWidget = (): ReactElement => {
  const { widthPx, heightPx } = useWidget();
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const { customOnResize } = useResponsiveHighchart({ chartRef, heightPx, widthPx });
  const { openWidgetSideMenu } = useEditor();

  return (
    <WidgetBase onResize={customOnResize} onDoubleClick={openWidgetSideMenu}>
      <WidgetSideMenuSettings>
        <DataTableChartMenuSettings
          showDataLabels
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
      <BarChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyBarChartWidget = ({ includeAltTextImg }: { includeAltTextImg?: boolean }): ReactElement => {
  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <BarChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const BarChart = forwardRef<HighchartsReact.RefObject>((_, chartRef) => {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.BarChart} />;
});
