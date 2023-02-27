import { CellValue } from 'modules/Editor/components/Spreadsheet/Spreadsheet.types';
import { Color } from 'types/basic.types';
import { AccessibleElement, Widget } from 'types/widget.types';
import { PATTERN_ID } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommon.types';
import { WidgetId } from 'types/idTypes';

type ChartLegendData = {
  enabled: boolean;
  labelStyle: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
  };
};

type ChartLabelDataType = {
  // Do we allow to display the data label on the charts.
  // Ex: the data value on top of a bar
  enabled: boolean;

  prefix?: string;
  suffix?: string;
  style: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
  };
};

export interface xAxis extends Axis {
  categories?: string[];
}

export interface yAxis extends Axis {}

export interface Axis {
  title: {
    text: string;
    style: {
      fontFamily: string;
      fontSize: string;
      color: string;
      fontWeight: string;
      fontStyle: string;
      textDecoration: string;
    };
  };
  enableLine?: boolean;
  enablelabels?: boolean;
  style: {
    lineColor: string;
    lineWidth: number;
  };
  labelStyle: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
  };
}

export interface Grid {
  style: {
    lineColor: string;
  };
}

export interface SpreadsheetRow {
  [name: string]: CellValue;
  color?: Color;
}

export interface UseHighchartsDataProps {
  seriesData: ChartWidgetData['seriesData'];
  seriesMeta: ChartWidgetData['seriesMeta'];

  // Are we allow to generate a single series data when the data is not enough for multi series
  allowSingleSeries?: boolean;

  // Are we allow to generate a single series data even if there are more data than request by single series
  forceSingleSeries?: boolean;

  // Do we use the header to determine if it is a empty column
  disableHeader?: boolean;

  // Any data that need to embadded in the generated data.
  seriesOption?: { [name: string]: unknown };
}

/**
 * This interface represent a column on the side panel table
 */
export interface ChartTableColumnSeries<DataType = string> {
  name?: string;
  data: DataType[];
}

// First column is defined to be 'Value' or 'Category' header, which should be { name: undefined | string, data: string[]}
// Other columns are defined to be data column, which should be { name: string, data: (number | string)[] }
export type ChartDataSeries = [ChartTableColumnSeries, ...ChartTableColumnSeries<number | string>[]];

/**
 * A sub-setting definning the data format in the user's data table
 */
export interface NumberFormatSettingsType {
  /**
   * A switcher for chart to determine showing the percentage in total or displaying the user's input value
   * Default: 'value'.
   */
  format?: 'percentage' | 'value';

  /**
   * Custom serparator in between the numbers
   * Default: 'none'
   */
  separator?: string;

  /**
   * Defining the precision of the numbers
   * Default: 'auto'
   */
  precision?: string;
}

/**
 * Interface that contains common options for
 * all chart types.
 *
 * TODO add other common options - title, labels, bg color, etc.
 */
export interface ChartWidgetData<SeriesDataType = ChartDataSeries> extends AccessibleElement, Widget {
  legend: ChartLegendData;
  dataLabels: ChartLabelDataType;
  seriesData: SeriesDataType;
  seriesMeta: {
    colors: Color[];
    minValue?: string;
    maxValue?: string;
  };
  yAxis: yAxis;
  xAxis: xAxis;
  grid: Grid;
  generalOptions: {
    borderWidth: number;
    borderColor: string;
    innerSize: number;
  };
  patterns: {
    enabled: boolean;
    list: PATTERN_ID[];
  };
  numberFormat?: NumberFormatSettingsType;
  widgetId?: WidgetId;
}

export enum ChartType {
  Table = 'table',
  PieChart = 'piechart',
}
