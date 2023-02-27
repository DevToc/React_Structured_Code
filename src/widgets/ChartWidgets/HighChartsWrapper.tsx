import styled from '@emotion/styled';
import Highcharts, { XAxisOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import RefObject = HighchartsReact.RefObject;
import { Ref, useEffect, useRef, useState } from 'react';

import HighchartsPatternFill from 'highcharts/modules/pattern-fill';
import { useHighChartOptions } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommon.helpers';
import { WidgetType } from 'types/widget.types';
HighchartsPatternFill(Highcharts);

const StyledHighChartsWrapper = styled.div`
  position: absolute;

  // prevent click effect on legend
  .highcharts-legend {
    pointer-events: none !important;
  }

  // overwrite pointer events for axis labels to allow for
  // double click to open chart panel
  .highcharts-axis-labels {
    pointer-events: none !important;
  }

  // SVGs must have absolute positioning to render correctly on export
  svg.highcharts-root {
    position: absolute;
  }
`;

type ChartType =
  | WidgetType.AreaChart
  | WidgetType.StackedColumnChart
  | WidgetType.ColumnChart
  | WidgetType.BarChart
  | WidgetType.StackedAreaChart
  | WidgetType.StackedBarChart
  | WidgetType.PieChart
  | WidgetType.LineChart;

interface HighChartsWrapperProps {
  chartType: ChartType;
  chartRef: Ref<RefObject>;
}

export const HighChartsWrapper = ({ chartRef, chartType }: HighChartsWrapperProps) => {
  const highChartOptions = useHighChartOptions(chartType);

  /**
   * This workaround is required to prevent text overlapping axis title on font family change. https://github.com/Venngage/editor2/pull/571
   * The first part is for the Editor.
   */
  const labelStyles = (highChartOptions?.xAxis as XAxisOptions)?.labels?.style;
  const previousLabelStyling = useRef((highChartOptions?.xAxis as XAxisOptions)?.labels?.style);
  const [reRender, setReRender] = useState(false);
  const customKey =
    previousLabelStyling.current?.fontFamily !== labelStyles?.fontFamily || reRender
      ? Date.now()
      : highChartOptions.keyCustom;
  useEffect(() => {
    if (previousLabelStyling.current?.fontFamily !== labelStyles?.fontFamily) {
      previousLabelStyling.current = { ...labelStyles };
    }
  }, [labelStyles]);
  // This part of the workaround is specifically for export.
  useEffect(() => {
    setTimeout(() => {
      setReRender(true);
    }, 250);
  }, []);

  /**
   * Highcharts wrapper must have aria-hidden set to TRUE so that
   * text labels (data, x, y axes) are not picked up in the reading
   * order after export.
   */
  return (
    <StyledHighChartsWrapper aria-hidden={true} key={customKey}>
      <HighchartsReact key={customKey} ref={chartRef} highcharts={Highcharts} options={highChartOptions} />
    </StyledHighChartsWrapper>
  );
};
