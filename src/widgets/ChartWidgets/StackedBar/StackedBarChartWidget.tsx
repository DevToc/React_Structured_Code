import { forwardRef, ReactElement, useRef, Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsPatternFill from 'highcharts/modules/pattern-fill';

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

HighchartsPatternFill(Highcharts);

const ChartWidgetToolbarMenu = (): ReactElement => {
  const Component = useDynamicImport('chartWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component />
    </Suspense>
  );
};

export const StackedBarChartWidget = (): ReactElement => {
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
          showBorderColor
          showBorderWidth
          showPatterns
        />
      </WidgetSideMenuSettings>
      <WidgetToolbar>
        <ChartWidgetToolbarMenu />
      </WidgetToolbar>
      <StackedBarChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyStackedBarChartWidget = ({ includeAltTextImg }: WidgetBaseProp): ReactElement => {
  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <StackedBarChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const StackedBarChart = forwardRef<HighchartsReact.RefObject>((_, chartRef) => {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.StackedBarChart} />;
});
