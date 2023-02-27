import { ReactElement, useRef, forwardRef, Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import HighchartsReact from 'highcharts-react-official';

import { useDynamicImport } from 'hooks/useDynamicImport';

import { HighChartsWrapper } from '../HighChartsWrapper';
import { useResponsiveHighchart } from '../Chartwidget.hooks';
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

export const PieChartWidget = (): ReactElement => {
  const { widthPx, heightPx } = useWidget();
  const { openWidgetSideMenu } = useEditor();

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const { customOnResize } = useResponsiveHighchart({ chartRef, heightPx, widthPx });

  return (
    <WidgetBase onResize={customOnResize} onDoubleClick={openWidgetSideMenu}>
      <WidgetToolbar>
        <ChartWidgetToolbarMenu />
      </WidgetToolbar>
      <WidgetSideMenuSettings>
        <DataTableChartMenuSettings
          showBorderColor
          showBorderWidth
          showDataLabels
          showDonutHole
          showLabelsConfiguration
          showLegendsConfiguration
          showPatterns
          showNumberFormatSwitch
        />
      </WidgetSideMenuSettings>
      <PieChart ref={chartRef} />
    </WidgetBase>
  );
};

export const ReadOnlyPieChartWidget = ({ includeAltTextImg }: { includeAltTextImg?: boolean }): ReactElement => {
  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <PieChart />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const PieChart = forwardRef<HighchartsReact.RefObject>((_, chartRef) => {
  return <HighChartsWrapper chartRef={chartRef} chartType={WidgetType.PieChart} />;
});
