import { generateDefaultData as generatePieChartData } from 'widgets/ChartWidgets/PieChartWidget/PieChartWidget.helpers';
import { generateDonutPieDefaultData as generateDonutPieChartData } from 'widgets/ChartWidgets/PieChartWidget/PieChartWidget.helpers';
import { generateDefaultData as generateLineChartData } from 'widgets/ChartWidgets/LineChartWidget/LineChartWidget.helpers';
import { generateDefaultData as generateTableData } from 'widgets/TextBasedWidgets/TableWidget/TableWidget.helpers';
import { generateDefaultData as generateColumnChartData } from 'widgets/ChartWidgets/ColumnChartWidget/ColumnChartWidget.helpers';
import { generateDefaultData as generateBarChartData } from 'widgets/ChartWidgets/BarChartWidget/BarChartWidget.helpers';
import { generateDefaultData as generateStackedBarChartData } from 'widgets/ChartWidgets/StackedBar/StackedBarChartWidget.helpers';
import { generateDefaultData as generateStackedColumnChartData } from 'widgets/ChartWidgets/StackedColumn/StackedColumnChartWidget.helpers';
import { generateDefaultData as generateAreaChartData } from 'widgets/ChartWidgets/Area/AreaChartWidget.helpers';
import { generateDefaultData as generateStackedAreaChartData } from 'widgets/ChartWidgets/StackedArea/StackedAreaChartWidget.helpers';
import { generateDefaultData as generateStatChartData } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.helpers';

import { ReactComponent as PieChartIcon } from 'assets/icons/chartIcons/pie.svg';
import { ReactComponent as DonutPieChartIcon } from 'assets/icons/chartIcons/donut_pie.svg';
import { ReactComponent as ColumnChartIcon } from 'assets/icons/chartIcons/column.svg';
import { ReactComponent as BarChartIcon } from 'assets/icons/chartIcons/bar.svg';
import { ReactComponent as LineChartIcon } from 'assets/icons/chartIcons/line.svg';
import { ReactComponent as TableIcon } from 'assets/icons/chartIcons/table.svg';
import { ReactComponent as StackedBarChartIcon } from 'assets/icons/chartIcons/stacked_bar.svg';
import { ReactComponent as StackedColumnChartIcon } from 'assets/icons/chartIcons/stacked_column.svg';
import { ReactComponent as DonutStatChartIcon } from 'assets/icons/chartIcons/donut_stat.svg';
import { ReactComponent as HalfDonutStatChartIcon } from 'assets/icons/chartIcons/half_donut_stat.svg';
import { ReactComponent as ProgressBarStatChartIcon } from 'assets/icons/chartIcons/progress_bar_stat.svg';
import { ReactComponent as AreaIcon } from 'assets/icons/chartIcons/area.svg';
import { ReactComponent as StackedAreaIcon } from 'assets/icons/chartIcons/stacked_area.svg';
import { ReactComponent as IconStatChartIcon } from 'assets/icons/chartIcons/icon_stat_chart.svg';

import { StatChartType } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.types';

export enum ChartType {
  Table = 'Table',
  Pie = 'Pie',
  DonutPie = 'DonutPie',
  Column = 'Column',
  Bar = 'Bar',
  Line = 'Line',
  StackedBar = 'StackedBar',
  StackedColumn = 'StackedColumn',
  DonutStat = 'DonutStat',
  HalfDonutStat = 'HalfDonutStat',
  ProgressBarStat = 'ProgressBarStat',
  IconStat = 'IconStat',
  Area = 'Area',
  StackedArea = 'StackedArea',
}

/**
 * Map to store the default widget data for each chart widget option
 * in the left panel.
 */
const CHART_TYPE_TO_DEFAULT_DATA_MAP = {
  [ChartType.Table]: generateTableData(),
  [ChartType.Pie]: generatePieChartData(),
  [ChartType.DonutPie]: generateDonutPieChartData(),
  [ChartType.Line]: generateLineChartData(),
  [ChartType.Column]: generateColumnChartData(),
  [ChartType.Bar]: generateBarChartData(),
  [ChartType.StackedBar]: generateStackedBarChartData(),
  [ChartType.StackedColumn]: generateStackedColumnChartData(),
  [ChartType.Area]: generateAreaChartData(),
  [ChartType.StackedArea]: generateStackedAreaChartData(),

  // Stat charts
  [ChartType.DonutStat]: generateStatChartData(StatChartType.Donut),
  [ChartType.HalfDonutStat]: generateStatChartData(StatChartType.HalfDonut),
  [ChartType.ProgressBarStat]: generateStatChartData(StatChartType.ProgressBar),
  [ChartType.IconStat]: generateStatChartData(StatChartType.Icon),
};

/**
 * Chart widget data to be displayed in left menu.
 * Organized by category, each category has an array `chartWidgets` with
 * data related to the widgets for that category.
 * Default data for the widgets is stored in the CHART_NAME_TO_DEFAULT_DATA_MAP.
 */
const CHART_MENU_DATA = [
  {
    category: 'Table',
    chartWidgets: [
      {
        type: ChartType.Table,
        icon: <TableIcon />,
        name: 'Table',
      },
    ],
  },
  {
    category: 'Pie',
    chartWidgets: [
      {
        type: ChartType.Pie,
        icon: <PieChartIcon />,
        name: 'Pie',
      },
      {
        type: ChartType.DonutPie,
        icon: <DonutPieChartIcon />,
        name: 'Donut Pie',
      },
    ],
  },
  {
    category: 'Column and Bar',
    chartWidgets: [
      {
        type: ChartType.Column,
        icon: <ColumnChartIcon />,
        name: 'Column',
      },
      {
        type: ChartType.Bar,
        icon: <BarChartIcon />,
        name: 'Bar',
      },
      {
        type: ChartType.StackedColumn,
        icon: <StackedColumnChartIcon />,
        name: 'Stacked Column',
      },
      {
        type: ChartType.StackedBar,
        icon: <StackedBarChartIcon />,
        name: 'Stacked Bar',
      },
    ],
  },
  {
    category: 'Lines and Area',
    chartWidgets: [
      {
        type: ChartType.Line,
        icon: <LineChartIcon />,
        name: 'Lines',
      },
      {
        type: ChartType.Area,
        icon: <AreaIcon />,
        name: 'Area',
      },
      {
        type: ChartType.StackedArea,
        icon: <StackedAreaIcon />,
        name: 'Stacked Area',
      },
    ],
  },
  {
    category: 'Stat',
    chartWidgets: [
      {
        type: ChartType.DonutStat,
        icon: <DonutStatChartIcon />,
        name: 'Donut Stat',
      },
      {
        type: ChartType.HalfDonutStat,
        icon: <HalfDonutStatChartIcon />,
        name: 'Half-Donut Stat',
      },
      {
        type: ChartType.ProgressBarStat,
        icon: <ProgressBarStatChartIcon />,
        name: 'Progress Bar Stat',
      },
      {
        type: ChartType.IconStat,
        icon: <IconStatChartIcon />,
        name: 'Icon Stat',
      },
    ],
  },
];

export { CHART_MENU_DATA, CHART_TYPE_TO_DEFAULT_DATA_MAP };
