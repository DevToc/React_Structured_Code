import { ChartType } from 'modules/Editor/components/WidgetMenu/SideMenu/ChartsWidgetMenu/ChartsWidgetMenu.config';
import { RootState, store } from 'modules/Editor/store';
import { ChartWidgetData } from 'widgets/ChartWidgets/ChartWidget.types';
import { mergeChartData } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommon.helpers';
import { BasicWidgetTypes, WidgetType } from 'types/widget.types';

import { ReactComponent as AreaChartIcon } from 'assets/icons/a11ymenu_area_chart.svg';
import { ReactComponent as BarChartIcon } from 'assets/icons/a11ymenu_bar_chart.svg';
import { ReactComponent as ColumnChartIcon } from 'assets/icons/a11ymenu_column_chart.svg';
import { ReactComponent as LineChartIcon } from 'assets/icons/a11ymenu_line_chart.svg';
import { ReactComponent as StackedBarChartIcon } from 'assets/icons/a11ymenu_stackedbar_chart.svg';
import { ReactComponent as StackedColumnChartIcon } from 'assets/icons/a11ymenu_stackedcolumn_chart.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/a11ymenu_pie_chart.svg';
import { ReactComponent as DonutChartIcon } from 'assets/icons/a11ymenu_donut_chart.svg';

import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { DropdownPopover } from 'modules/common/components/ToolbarPopover';
import { useWidget } from 'widgets/sdk';
import { ChangeEvent, ReactElement, useCallback } from 'react';

type DataTableChartType =
  | typeof ChartType.Pie
  | typeof ChartType.DonutPie
  | typeof ChartType.Column
  | typeof ChartType.Bar
  | typeof ChartType.Line
  | typeof ChartType.Area
  | typeof ChartType.StackedColumn
  | typeof ChartType.StackedBar
  | typeof ChartType.StackedArea;

type ChartOptionType = {
  value: DataTableChartType;
  label: string;
  icon: ReactElement;
  widgetType: string;
};

type AvailableChartsType = {
  [key in DataTableChartType]: ChartOptionType;
};

const AVAILABLE_CHARTS: AvailableChartsType = {
  [ChartType.Pie]: {
    value: ChartType.Pie,
    widgetType: WidgetType.PieChart,
    label: 'Pie chart',
    icon: <PieChartIcon width='15' />,
  },
  [ChartType.DonutPie]: {
    value: ChartType.DonutPie,
    widgetType: WidgetType.PieChart,
    label: 'Donut chart',
    icon: <DonutChartIcon width='15' />,
  },
  [ChartType.Column]: {
    value: ChartType.Column,
    widgetType: WidgetType.ColumnChart,
    label: 'Column chart',
    icon: <ColumnChartIcon width='15' />,
  },
  [ChartType.Bar]: {
    value: ChartType.Bar,
    widgetType: WidgetType.BarChart,
    label: 'Bar chart',
    icon: <BarChartIcon width='15' />,
  },
  [ChartType.Line]: {
    value: ChartType.Line,
    widgetType: WidgetType.LineChart,
    label: 'Line chart',
    icon: <LineChartIcon width='15' />,
  },
  [ChartType.Area]: {
    value: ChartType.Area,
    widgetType: WidgetType.AreaChart,
    label: 'Area chart',
    icon: <AreaChartIcon width='15' />,
  },
  [ChartType.StackedColumn]: {
    value: ChartType.StackedColumn,
    widgetType: WidgetType.StackedColumnChart,
    label: 'Stacked Column chart',
    icon: <StackedColumnChartIcon width='15' />,
  },
  [ChartType.StackedBar]: {
    value: ChartType.StackedBar,
    widgetType: WidgetType.StackedBarChart,
    label: 'Stacked Bar chart',
    icon: <StackedBarChartIcon width='15' />,
  },
  [ChartType.StackedArea]: {
    value: ChartType.StackedArea,
    widgetType: WidgetType.StackedAreaChart,
    label: 'Stacked Area chart',
    icon: <AreaChartIcon width='15' />,
  },
};

const SINGLE_SERIES_CHARTS: ChartOptionType[] = [
  AVAILABLE_CHARTS[ChartType.Pie],
  AVAILABLE_CHARTS[ChartType.DonutPie],
  AVAILABLE_CHARTS[ChartType.Column],
  AVAILABLE_CHARTS[ChartType.Bar],
  AVAILABLE_CHARTS[ChartType.Line],
  AVAILABLE_CHARTS[ChartType.Area],
];

const MULTI_SERIES_CHARTS: ChartOptionType[] = [
  AVAILABLE_CHARTS[ChartType.Column],
  AVAILABLE_CHARTS[ChartType.Bar],
  AVAILABLE_CHARTS[ChartType.Line],
  AVAILABLE_CHARTS[ChartType.Area],
  AVAILABLE_CHARTS[ChartType.StackedBar],
  AVAILABLE_CHARTS[ChartType.StackedColumn],
  AVAILABLE_CHARTS[ChartType.StackedArea],
];

const ChartSwapper = () => {
  const {
    widgetId,
    seriesData,
    generalOptions: { innerSize },
    replaceWidget,
  } = useWidget<ChartWidgetData>();

  const isMultiSeries =
    seriesData
      .map(
        (serie, index) => (index === 0 ? null : serie.name), // Don't consider A column
      )
      .filter((name) => !!name).length > 1;
  let swapOptions = isMultiSeries ? MULTI_SERIES_CHARTS : SINGLE_SERIES_CHARTS;

  const onSelect = useCallback(
    (targetChartName: ChangeEvent<HTMLSelectElement>) => {
      const currentWidgetData = (store.getState() as RootState).infograph.widgets[widgetId] as ChartWidgetData;

      replaceWidget(mergeChartData(targetChartName as unknown as ChartType, currentWidgetData));
    },
    [replaceWidget, widgetId],
  );

  const widgetType = getWidgetTypeFromId(widgetId) as BasicWidgetTypes;
  const isDonutPie = widgetType === WidgetType.PieChart && innerSize > 0;

  // Keep the current widget type in the select even if we changed the data in the data table, and it
  // now becomes Single or Multi series, and it is not in that list.
  if (swapOptions.findIndex((option) => option.widgetType === widgetType) === -1) {
    const additionalOptions = Object.values(AVAILABLE_CHARTS).filter((option) => option.widgetType === widgetType);
    swapOptions = [...additionalOptions, ...swapOptions];
  }

  const selectedOptionIndex = Object.values(swapOptions).findIndex((chartOption) => {
    if (isDonutPie) {
      return chartOption.value === ChartType.DonutPie;
    }
    return chartOption.widgetType === widgetType;
  });

  return (
    <>
      <DropdownPopover
        options={swapOptions}
        selectedIndex={selectedOptionIndex}
        label={'Chart Type'}
        w={'200px'}
        buttonVariant={'toolbar-dropdown-option'}
        optionsButtonVariant={'toolbar-dropdown-item'}
        onSelect={onSelect}
        triggerSelectOnSameValue={false}
        buttonOptionProps={{ justifyContent: 'flex-start' }}
      />
    </>
  );
};

export default ChartSwapper;
