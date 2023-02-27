import clonedeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

import { WidgetType } from 'types/widget.types';
import { HighchartsSeriesData, useHighchartsData } from 'widgets/ChartWidgets/Chartwidget.hooks';
import { DEFAULT_TEXT_STYLE } from 'widgets/ChartWidgets/ChartWidget.config';

import {
  CHART_TYPE_TO_DEFAULT_DATA_MAP,
  ChartType,
} from 'modules/Editor/components/WidgetMenu/SideMenu/ChartsWidgetMenu/ChartsWidgetMenu.config';

import { ChartWidgetData } from 'widgets/ChartWidgets/ChartWidget.types';
import { isTest } from 'utils/environment';
import Highcharts, {
  CSSObject,
  PatternOptionsObject,
  PlotColumnDataLabelsOptions,
  PointOptionsObject,
  Series,
  SeriesAreaOptions,
  SeriesBarOptions,
  SeriesLegendItemClickEventObject,
  SeriesLineOptions,
  SeriesPieDataLabelsOptionsObject,
  SeriesPieOptions,
} from 'highcharts';
import {
  DEFAULT_BORDER_COLOR as DEFAULT_COLUMN_CHART_BORDER_COLOR,
  DEFAULT_BORDER_WIDTH as DEFAULT_COLUMN_CHART_BORDER_WIDTH,
} from '../ColumnChartWidget/ColumnChartWidget.config';
import {
  DEFAULT_BORDER_COLOR as DEFAULT_BAR_CHART_BORDER_COLOR,
  DEFAULT_BORDER_WIDTH as DEFAULT_BAR_CHART_BORDER_WIDTH,
  DEFAULT_SPACING_RIGHT,
} from '../BarChartWidget/BarChartWidget.config';
import {
  DEFAULT_PIE_BORDER_COLOR,
  DEFAULT_PIE_BORDER_WIDTH,
  DEFAULT_PIE_INNER_SIZE,
  DEFAULT_PIE_NUMBER_FORMAT,
} from '../PieChartWidget/PieChartWidget.config';
import { HIDDEN_AXIS_LINE_COLOR, HIDDEN_AXIS_LINE_WIDTH } from './DataTableChartCommon.config';
import { useWidget } from 'widgets/sdk';

import { shuffle } from 'utils/array';
import cloneDeep from 'lodash.clonedeep';
import { StackedAreaChartWidgetData } from 'widgets/ChartWidgets/StackedArea/StackedAreaChartWidget.types';
import { AreaChartWidgetData } from 'widgets/ChartWidgets/Area/AreaChartWidget.types';
import {
  BACKUP_PATTERN,
  DataTableChartWidgetPattern,
  ENABLED_PATTERN_IDS,
  HighchartsOptions,
  HighChartsWidgetTypes,
  PATTERN_ID,
  PATTERNS,
} from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommon.types';

/**
 * Returns an array of randomized pattern codes.
 *
 * @param patterns The object of patterns from where to get the random list.
 */
export const getRandomPatterns = (patterns: PATTERN_ID[] = [...ENABLED_PATTERN_IDS]): PATTERN_ID[] => {
  shuffle(patterns);

  return patterns;
};

const labelWidthCanvas = document.createElement('canvas');

/**
 * This function takes the text and it's styling and returns
 * the width of the text using the given styling.
 * @param text The text to measure the width of
 * @param font The styling in format of bold/normal + font size + font name
 * @return Returns the width of the text as an int
 *
 * PORTED from E1
 */
function getLabelWidth(text: string, font: string): number {
  try {
    const context = labelWidthCanvas.getContext('2d');

    if (context === null) {
      return 0;
    }

    context.font = font; // set the font to the version passed in
    const metrics = context.measureText(text); // measure the length of the text using the styling
    return metrics.width;
  } catch (err) {
    console.log('Error getting data label width.');
    return 0; // worst case, if we error, return a valid number to avoid crashing
  }
}

/**
 * This function takes in the labelData label settings, and
 * returns all the necessary styling for the canvas
 * to measure the width while being formatted
 * @param style the object with the label settings
 * @return the styling as a string for the canvas function
 *
 * PORTED from E1
 */
function getLabelStyling(style: CSSObject): string {
  return `${style.fontWeight ? 'bold' : ''} ${style.fontSize} ${style.fontFamily}`;
}

/**
 * Builds High Chart Options object
 * @param chartType
 */
const useHighChartOptions = (chartType: HighChartsWidgetTypes): HighchartsOptions => {
  const widgetData = useWidget<ChartWidgetData>();
  const {
    generalOptions,
    legend,
    seriesData,
    seriesMeta,
    widthPx,
    heightPx,
    dataLabels,
    xAxis: {
      enableLine: enableXLine = true,
      enablelabels: enableXlabels = true,
      style: { lineColor, lineWidth },
    },
    yAxis: {
      enablelabels: enableYlabels = true,
      enableLine: enableYLine = true,
      title: { text: yAxisTitle = '' } = {},
    },
    xAxis,
    yAxis,
    grid,
  } = widgetData;

  const minValue = parseFloat(seriesMeta.minValue ?? '');
  const maxValue = parseFloat(seriesMeta.maxValue ?? '');

  const allowSingleSeries = [WidgetType.BarChart, WidgetType.ColumnChart, WidgetType.StackedColumnChart].includes(
    chartType,
  );
  const forceSingleSeries = [WidgetType.PieChart].includes(chartType);

  const { categories, series, keyCustom, mostLengthyLabel } = useHighchartsData({
    seriesData,
    seriesMeta,
    allowSingleSeries,
    forceSingleSeries,
  });

  const defaultOptions: HighchartsOptions = {
    chart: {
      width: widthPx,
      height: heightPx,
      backgroundColor: 'transparent',
      animation: false,
    },
    // Title not displayed for now
    title: {
      text: undefined,
    },
    legend: {
      enabled: legend.enabled,
      itemStyle: {
        ...DEFAULT_TEXT_STYLE,
        color: legend.labelStyle.color,
        fontSize: legend.labelStyle.fontSize,
        fontFamily: legend.labelStyle.fontFamily,
        fontWeight: legend.labelStyle.fontWeight,
        fontStyle: legend.labelStyle.fontStyle,
        textDecoration: legend.labelStyle.textDecoration,
      },
    },
    // TODO: https://www.highcharts.com/docs/accessibility/accessibility-module
    accessibility: {
      enabled: false,
    },
    credits: { enabled: false },
    tooltip: { enabled: false },
    exporting: { enabled: false },
    xAxis: {
      title: {
        text: xAxis.title.text,
        style: {
          ...DEFAULT_TEXT_STYLE,
          color: xAxis.title.style.color,
          fontFamily: xAxis.title.style.fontFamily,
          fontSize: xAxis.title.style.fontSize,
          fontWeight: xAxis.title.style.fontWeight,
          fontStyle: xAxis.title.style.fontStyle,
          textDecoration: xAxis.title.style.textDecoration,
        },
      },
      lineColor: enableXLine ? lineColor : HIDDEN_AXIS_LINE_COLOR,
      lineWidth: enableXLine ? lineWidth : HIDDEN_AXIS_LINE_WIDTH,
      gridLineColor: grid.style.lineColor,
      labels: {
        enabled: enableXlabels,
        style: {
          ...DEFAULT_TEXT_STYLE,
          color: xAxis.labelStyle.color,
          fontSize: xAxis.labelStyle.fontSize,
          fontFamily: xAxis.labelStyle.fontFamily,
          fontWeight: xAxis.labelStyle.fontWeight,
          fontStyle: xAxis.labelStyle.fontStyle,
          textDecoration: xAxis.labelStyle.textDecoration,
        },
      },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        style: {
          ...DEFAULT_TEXT_STYLE,
          color: yAxis.title.style.color,
          fontFamily: yAxis.title.style.fontFamily,
          fontSize: yAxis.title.style.fontSize,
          fontWeight: yAxis.title.style.fontWeight,
          fontStyle: yAxis.title.style.fontStyle,
          textDecoration: yAxis.title.style.textDecoration,
        },
      },
      max: Number.isNaN(maxValue) ? null : maxValue,
      min: Number.isNaN(minValue) ? null : minValue,
      lineColor: enableYLine ? lineColor : HIDDEN_AXIS_LINE_COLOR,
      lineWidth: enableYLine ? lineWidth : HIDDEN_AXIS_LINE_WIDTH,
      gridLineColor: grid.style.lineColor,
      labels: {
        enabled: enableYlabels,
        style: {
          ...DEFAULT_TEXT_STYLE,
          color: yAxis.labelStyle.color,
          fontSize: yAxis.labelStyle.fontSize,
          fontFamily: yAxis.labelStyle.fontFamily,
          fontWeight: yAxis.labelStyle.fontWeight,
          fontStyle: yAxis.labelStyle.fontStyle,
          textDecoration: yAxis.labelStyle.textDecoration,
        },
        reserveSpace: true,
        overflow: 'justify',
      },
    },
    plotOptions: {
      area: {
        borderWidth: 0,
        animation: false,
        states: {
          hover: {
            enabled: false,
          },
          inactive: {
            opacity: 1,
          },
        },
        dataLabels: {
          enabled: dataLabels.enabled,
          style: {
            ...DEFAULT_TEXT_STYLE,
            color: dataLabels.style.color,
            fontSize: dataLabels.style.fontSize,
            fontFamily: dataLabels.style.fontFamily,
            fontWeight: dataLabels.style.fontWeight,
            fontStyle: dataLabels.style.fontStyle,
            textDecoration: dataLabels.style.textDecoration,
          },
          crop: false,
          overflow: 'allow',
          allowOverlap: false,
        },
      },
      bar: {
        borderWidth: generalOptions?.borderWidth ?? DEFAULT_BAR_CHART_BORDER_WIDTH,
        borderColor: generalOptions?.borderColor ?? DEFAULT_BAR_CHART_BORDER_COLOR,
        borderRadius: 2,
        animation: false,
        states: {
          hover: {
            enabled: false,
            halo: {
              size: 0,
            },
          },
          inactive: {
            opacity: 1,
          },
        },
        dataLabels: {
          enabled: dataLabels.enabled,
          style: {
            ...DEFAULT_TEXT_STYLE,
            color: dataLabels.style.color,
            fontSize: dataLabels.style.fontSize,
            fontFamily: dataLabels.style.fontFamily,
            fontWeight: dataLabels.style.fontWeight,
            fontStyle: dataLabels.style.fontStyle,
            textDecoration: dataLabels.style.textDecoration,
          },
          crop: false,
          overflow: 'allow',
          verticalAlign: 'middle',
          allowOverlap: false,
        },
      },
      column: {
        borderWidth: generalOptions?.borderWidth ?? DEFAULT_COLUMN_CHART_BORDER_WIDTH,
        borderColor: generalOptions?.borderColor ?? DEFAULT_COLUMN_CHART_BORDER_COLOR,
        borderRadius: 2,
        animation: false,
        states: {
          hover: {
            enabled: false,
            halo: {
              size: 0,
            },
          },
          inactive: {
            opacity: 1,
          },
        },
        dataLabels: {
          enabled: dataLabels.enabled,
          style: {
            ...DEFAULT_TEXT_STYLE,
            color: dataLabels.style.color,
            fontSize: dataLabels.style.fontSize,
            fontFamily: dataLabels.style.fontFamily,
            fontWeight: dataLabels.style.fontWeight,
            fontStyle: dataLabels.style.fontStyle,
            textDecoration: dataLabels.style.textDecoration,
          },
        },
      },
      line: {
        animation: false,
        states: {
          hover: {
            enabled: false,
            halo: {
              size: 0,
            },
          },
          inactive: {
            opacity: 1,
          },
        },
        dataLabels: {
          enabled: dataLabels.enabled,
          style: {
            ...DEFAULT_TEXT_STYLE,
            color: dataLabels.style.color,
            fontSize: dataLabels.style.fontSize,
            fontFamily: dataLabels.style.fontFamily,
            fontWeight: dataLabels.style.fontWeight,
            fontStyle: dataLabels.style.fontStyle,
            textDecoration: dataLabels.style.textDecoration,
          },
          crop: false,
          overflow: 'allow',
          allowOverlap: false,
        },
      },
      series: {
        events: {
          legendItemClick: function (this: Series, event: SeriesLegendItemClickEventObject) {
            return event.preventDefault();
          },
        },
        enableMouseTracking: false,
        animation: false,
      },
    },
  };

  switch (chartType) {
    case WidgetType.PieChart:
      return getHighChartsPieConfig(defaultOptions, widgetData, categories, series, keyCustom);
    case WidgetType.LineChart:
      return getHighChartsLineConfig(defaultOptions, widgetData, categories, series, keyCustom);
    case WidgetType.BarChart:
      return getHighChartsBarConfig(defaultOptions, widgetData, categories, series, keyCustom, mostLengthyLabel);
    case WidgetType.ColumnChart:
      return getHighChartsColumnConfig(defaultOptions, widgetData, categories, series, keyCustom, mostLengthyLabel);
    case WidgetType.StackedBarChart:
      return getHighChartsStackedBarConfig(defaultOptions, widgetData, categories, series, keyCustom, mostLengthyLabel);
    case WidgetType.StackedColumnChart:
      return getHighChartsStackedColumnConfig(
        defaultOptions,
        widgetData,
        categories,
        series,
        keyCustom,
        mostLengthyLabel,
      );
    case WidgetType.AreaChart:
      return getHighChartsAreaConfig(defaultOptions, widgetData, categories, series, keyCustom);
    case WidgetType.StackedAreaChart:
      return getHighChartsStackedAreaConfig(defaultOptions, widgetData, categories, series, keyCustom);
    default:
      throw new Error('All chart widget should have their own config');
  }
};

/**
 * Applies patterns to series or series data items.
 * @param highChartsOptions
 * @param patternsList
 */
const applyPatterns = (highChartsOptions: HighchartsOptions, patternsList: PATTERN_ID[]) => {
  if (typeof highChartsOptions.series === 'undefined') {
    return;
  }

  let patternIterativeIndex = 0;

  // The color property is at Series level when having multiple series
  if (highChartsOptions.series.length > 1) {
    for (let i = 0; i < highChartsOptions.series.length; i++) {
      const seriesItem = highChartsOptions.series[i] as
        | SeriesBarOptions
        | SeriesAreaOptions
        | SeriesPieOptions
        | SeriesLineOptions;

      if (typeof patternsList[patternIterativeIndex] === 'undefined') {
        patternIterativeIndex = 0;
      }
      const patternData = PATTERNS[patternsList[patternIterativeIndex]] || BACKUP_PATTERN;
      patternIterativeIndex++;

      const isAreaChart = highChartsOptions?.chart?.type === 'area';
      const isStackedAreaChart = isAreaChart && highChartsOptions?.plotOptions?.area?.stacking === 'normal';

      // No pattern fill is required, only change line style.
      if (highChartsOptions?.chart?.type === 'line' || (isAreaChart && !isStackedAreaChart)) {
        (seriesItem as SeriesLineOptions).dashStyle = patternData.dashStyle || 'Solid';
        continue;
      }

      if (typeof seriesItem.color === 'string') {
        const patternOptions = getPatternOptionsObject(patternData, seriesItem.color, highChartsOptions?.chart?.type);

        // This prevents applying the pattern to the lines and lines' marker symbols for stacked area charts.
        if (isStackedAreaChart) {
          (seriesItem as SeriesAreaOptions).fillColor = {
            pattern: patternOptions,
          };
          continue;
        }

        seriesItem.color = {
          pattern: patternOptions,
        };
      }
    }
  } else if (highChartsOptions.series.length === 1) {
    // The color property is set at series' data item level
    const seriesItem = highChartsOptions.series[0] as
      | SeriesBarOptions
      | SeriesAreaOptions
      | SeriesPieOptions
      | SeriesLineOptions;

    if (typeof seriesItem.data === 'undefined') {
      return;
    }

    for (let j = 0; j < seriesItem.data.length; j++) {
      if (typeof patternsList[patternIterativeIndex] === 'undefined') {
        patternIterativeIndex = 0;
      }

      const seriesDataItem = seriesItem.data[j] as PointOptionsObject;
      const patternData = PATTERNS[patternsList[patternIterativeIndex]] || BACKUP_PATTERN;
      patternIterativeIndex++;

      const isAreaChart = highChartsOptions?.chart?.type === 'area';
      const isStackedAreaChart = isAreaChart && highChartsOptions?.plotOptions?.area?.stacking === 'normal';

      // No pattern fill is required, only change line style.
      if (highChartsOptions?.chart?.type === 'line' || (isAreaChart && !isStackedAreaChart)) {
        (seriesItem as SeriesLineOptions).dashStyle = patternData.dashStyle || 'Solid';
        continue;
      }

      if (typeof seriesDataItem.color === 'string') {
        if (highChartsOptions?.chart?.type === 'pie') {
          seriesDataItem.dataLabels = seriesDataItem.dataLabels || {};
          (seriesDataItem.dataLabels as SeriesPieDataLabelsOptionsObject).connectorColor = seriesDataItem.color;
        }

        seriesDataItem.dashStyle = 'Solid';
        seriesDataItem.color = {
          pattern: getPatternOptionsObject(patternData, seriesDataItem.color, highChartsOptions?.chart?.type),
        };
      }
    }
  }
};

/**
 * Builds a new Pattern Options Object
 * @param patternData
 * @param color
 * @param chartType
 */
const getPatternOptionsObject = (
  patternData: DataTableChartWidgetPattern,
  color: string = '#FFF',
  chartType: string = '',
): PatternOptionsObject => {
  const whiteWithOpacity = `rgba(255, 255, 255, ${chartType === 'area' ? 0.75 : patternData.opacity || 0.25})`;

  return {
    aspectRatio: 0,
    backgroundColor: patternData.invertColors ? color : whiteWithOpacity,
    color: '',
    image: '',
    opacity: chartType === 'area' ? 0.5 : 1,
    patternTransform: patternData.transform || '',
    path: {
      d: patternData.path?.d,
      stroke: patternData.invertColors ? whiteWithOpacity : color,
      strokeWidth: patternData.path?.strokeWidth,
    },
    width: patternData.width || 20,
    height: patternData.height || 20,
  };
};

/**
 *
 * @param defaultOptions
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 */
const getHighChartsAreaConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: AreaChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
) => {
  const options = defaultOptions;
  const { enabled: patternsEnabled, list: patternsList } = widgetData.patterns;

  options.chart = options.chart || {};
  options.chart.type = 'area';

  options.keyCustom = keyCustom;

  options.xAxis = (options.xAxis as Highcharts.XAxisOptions) || {};
  options.xAxis.categories = categories;

  options.series = series.map(({ name, color, data }) => ({
    name,
    color,
    data: cloneDeep(data), // Avoid modifying the original when applying patterns
    type: 'area',
    dashStyle: 'Solid',
  }));

  options.plotOptions = options.plotOptions ?? {};
  options.plotOptions.area = options.plotOptions.area || {};
  options.plotOptions.area.fillOpacity = 0.1;

  if (patternsEnabled) {
    applyPatterns(options, patternsList);
  }

  return options;
};

/**
 *
 * @param defaultOptions
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 */
const getHighChartsStackedAreaConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: StackedAreaChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
) => {
  const options = defaultOptions;
  const { enabled: patternsEnabled, list: patternsList } = widgetData.patterns;

  options.chart = options.chart || {};
  options.chart.type = 'area';

  options.keyCustom = keyCustom;

  options.xAxis = (options.xAxis as Highcharts.XAxisOptions) || {};
  options.xAxis.categories = categories;

  options.plotOptions = options.plotOptions ?? {};
  options.plotOptions.area = {
    ...options.plotOptions.area,
    fillOpacity: 0.2,
    stacking: 'normal',
  };

  options.series = series.map(({ name, color, data }) => ({
    name,
    color,
    data: cloneDeep(data), // Avoid modifying the original when applying patterns
    type: 'area',
    dashStyle: 'Solid',
    fillColor: undefined,
  }));

  if (patternsEnabled) {
    applyPatterns(options, patternsList);
  }

  return options;
};

/**
 * @param defaultOptions Is modified by reference! Ensure that you're always passing a new object.
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 * @param mostLengthyLabel
 */
const getHighChartsColumnConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: ChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
  mostLengthyLabel: string,
) => {
  const options = defaultOptions;
  const { prefix = '', suffix = '' } = widgetData.dataLabels;
  const { enabled: patternsEnabled, list: patternsList } = widgetData.patterns;

  const validatedPrefix = `${prefix}${prefix !== '' ? ' ' : ''}`;
  const validatedSuffix = `${suffix !== '' ? ' ' : ''}${suffix}`;

  options.chart = options.chart || {};
  options.chart.type = 'column';

  options.keyCustom = keyCustom;

  options.xAxis = (options.xAxis as Highcharts.XAxisOptions) || {};
  options.xAxis.categories = categories;

  options.series = series.map(({ name, color, data }) => ({
    name,
    color,
    data: cloneDeep(data), // Avoid modifying the original when applying patterns
    visible: true,
    state: { hover: { enabled: false } },
    type: 'column',
  }));

  options.plotOptions = options.plotOptions ?? {};
  options.plotOptions.column = options.plotOptions.column ?? {};
  options.plotOptions.column.dataLabels = {
    ...options.plotOptions.column.dataLabels,
    format: `${validatedPrefix}{point.y}${validatedSuffix}`,
    crop: false,
    // With justify: This removes long data labels that don't fit and would overlap axis tick value label, contrary to 'none' value. Also, it doesn't force long labels to be centered regarding the columns.
    // @ts-ignore // Required if we set 'none', for some reason they don't allow it in the typescript interface
    overflow: 'justify',
  };

  options.yAxis = {
    ...options.yAxis,
    tickmarkPlacement: 'on',
    startOnTick: false,
    endOnTick: false,
    maxPadding:
      parseInt((options.plotOptions.column.dataLabels as PlotColumnDataLabelsOptions).style?.fontSize || '') / 100, // This allows for labels of size up to 30px to not get cut in a small chart of 480x350
  };

  if (patternsEnabled) {
    applyPatterns(options, patternsList);
  }

  return options;
};

/**
 * @param defaultOptions Is modified by reference! Ensure that you're always passing a new object.
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 * @param mostLengthyLabel
 */
const getHighChartsStackedColumnConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: ChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
  mostLengthyLabel: string,
) => {
  const options = getHighChartsColumnConfig(
    defaultOptions,
    widgetData,
    categories,
    series,
    keyCustom,
    mostLengthyLabel,
  );

  options.plotOptions = options.plotOptions || {};
  options.plotOptions.column = options.plotOptions.column || {};
  options.plotOptions.column.stacking = 'normal';
  options.plotOptions.column.borderRadius = 0;

  return options;
};

/**
 * @param defaultOptions Is modified by reference! Ensure that you're always passing a new object.
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 */
const getHighChartsPieConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: ChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
) => {
  const options = defaultOptions;
  const { enabled: patternsEnabled, list: patternsList } = widgetData.patterns;

  const {
    dataLabels: { enabled: enableDataLabel, prefix = '', suffix = '', style: dataLabelStyle },
    generalOptions: {
      borderWidth = DEFAULT_PIE_BORDER_WIDTH,
      borderColor = DEFAULT_PIE_BORDER_COLOR,
      innerSize = DEFAULT_PIE_INNER_SIZE,
    } = {},
    legend: { enabled: enableLegend },
    numberFormat: { format = DEFAULT_PIE_NUMBER_FORMAT } = {},
  } = widgetData;

  options.chart = options.chart || {};
  options.chart.type = 'pie';
  options.keyCustom = keyCustom;
  options.xAxis = options.xAxis || {};
  (options.xAxis as Highcharts.AxisOptions).categories = Array.from(categories);

  options.series = series.map(({ name, color, data }) => ({
    name,
    color,
    data: cloneDeep(data), // Avoid modifying the original when applying patterns
    visible: true,
    state: { hover: { enabled: false } },
    type: 'pie',
  }));
  options.plotOptions = {};
  options.plotOptions.series = {
    enableMouseTracking: false,
    shadow: false,
    animation: false,
  };

  // Add a space after the prefix and before the suffix
  const validatedPrefix = `${prefix}${prefix !== '' ? ' ' : ''}`;
  const validatedSuffix = `${suffix !== '' ? ' ' : ''}${suffix}`;

  const formatVariable =
    format === 'percentage' ? '{point.percentage:.0f}%' : `${validatedPrefix}{point.y}${validatedSuffix}`;
  options.plotOptions.pie = {
    allowPointSelect: true,
    cursor: 'pointer',
    showInLegend: enableLegend,
    borderWidth,
    borderColor,
    innerSize: Math.min(innerSize, 90) + '%',
    dataLabels: {
      enabled: enableDataLabel,
      style: {
        ...DEFAULT_TEXT_STYLE,
        textOverflow: 'wrap',
        color: dataLabelStyle.color,
        fontSize: dataLabelStyle.fontSize,
        fontFamily: dataLabelStyle.fontFamily,
        fontWeight: dataLabelStyle.fontWeight,
        fontStyle: dataLabelStyle.fontStyle,
        textDecoration: dataLabelStyle.textDecoration,
      },
      connectorShape: 'straight',
      format: `{point.name}: ${formatVariable}`,
    },
  };

  if (patternsEnabled) {
    applyPatterns(options, patternsList);
  }

  return options;
};

/**
 * @param defaultOptions Is modified by reference! Ensure that you're always passing a new object.
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 * @param mostLengthyLabel
 */
const getHighChartsBarConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: ChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
  mostLengthyLabel: string,
) => {
  const options = defaultOptions;
  const { prefix = '', suffix = '' } = widgetData.dataLabels;
  const { enabled: patternsEnabled, list: patternsList } = widgetData.patterns;

  const validatedPrefix = `${prefix}${prefix !== '' ? ' ' : ''}`;
  const validatedSuffix = `${suffix !== '' ? ' ' : ''}${suffix}`;

  // This is a safe margin that prevents labels being cropped when using big font size or a large prefix / suffix.
  const DEFAULT_MARGIN_RIGHT = 20;

  options.chart = options.chart || {};
  options.chart.spacingRight = DEFAULT_SPACING_RIGHT;
  options.chart.type = 'bar';
  options.chart.marginRight =
    DEFAULT_MARGIN_RIGHT +
    getLabelWidth(
      `${validatedPrefix} ${mostLengthyLabel} ${validatedSuffix}`,
      getLabelStyling(widgetData.xAxis.labelStyle),
    ); // Labels are always true;

  options.keyCustom = keyCustom;

  options.xAxis = {
    ...((options.xAxis as Highcharts.XAxisOptions) || {}),
    categories,
    tickmarkPlacement: 'on',
    endOnTick: false,
  };

  options.yAxis = {
    ...((options.yAxis as Highcharts.YAxisOptions) || {}),
    startOnTick: false,
    endOnTick: false,
    tickmarkPlacement: 'on',
    softMax: (options.yAxis as Highcharts.YAxisOptions).max || undefined,
  };

  options.series = series.map(({ name, color, data }) => ({
    name,
    color,
    data: cloneDeep(data), // Avoid modifying the original when applying patterns
    visible: true,
    state: { hover: { enabled: false } },
    type: 'bar',
  }));

  options.plotOptions = options.plotOptions ?? {};
  options.plotOptions.bar = options.plotOptions.bar ?? {};
  options.plotOptions.bar.dataLabels = {
    ...options.plotOptions.bar.dataLabels,
    format: `${validatedPrefix}{point.y}${validatedSuffix}`,
  };

  if (patternsEnabled) {
    applyPatterns(options, patternsList);
  }

  swapXYAxisSettings(options);

  return options;
};

/**
 * @param defaultOptions Is modified by reference! Ensure that you're always passing a new object.
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 * @param mostLengthyLabel
 */
const getHighChartsStackedBarConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: ChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
  mostLengthyLabel: string,
) => {
  const options = getHighChartsBarConfig(defaultOptions, widgetData, categories, series, keyCustom, mostLengthyLabel);

  options.plotOptions = options.plotOptions || {};
  options.plotOptions.bar = options.plotOptions.bar || {};
  options.plotOptions.bar.stacking = 'normal';
  options.plotOptions.bar.borderRadius = 0;

  options.chart = options.chart || {};
  options.chart.spacingRight = DEFAULT_SPACING_RIGHT;

  return options;
};

/**
 * @param defaultOptions Is modified by reference! Ensure that you're always passing a new object.
 * @param widgetData
 * @param categories
 * @param series
 * @param keyCustom
 */
const getHighChartsLineConfig = (
  defaultOptions: HighchartsOptions,
  widgetData: ChartWidgetData,
  categories: Array<string>,
  series: HighchartsSeriesData[],
  keyCustom: number,
) => {
  const options = defaultOptions;
  const { enabled: patternsEnabled, list: patternsList } = widgetData.patterns;

  options.chart = options.chart || {};
  options.chart.type = 'line';

  options.keyCustom = keyCustom;

  options.xAxis = (options.xAxis as Highcharts.XAxisOptions) || {};
  options.xAxis.categories = categories;

  options.yAxis = (options.yAxis as Highcharts.YAxisOptions) || {};

  options.series = series.map(({ name, color, data }) => ({
    name,
    color,
    data: cloneDeep(data), // Avoid modifying the original when applying patterns
    visible: true,
    state: { hover: { enabled: false } },
    type: 'line',
    dashStyle: 'Solid',
  }));

  if (patternsEnabled) {
    applyPatterns(options, patternsList);
  }

  // highcharts bug for line chart in the test environment
  if (isTest) {
    options.xAxis.tickAmount = 100;
    options.yAxis.tickAmount = 100;
  }

  return options;
};

/**
 * A helper function to swap some xAxis settings and the yAxis settings.
 *
 * On Bar related charts such as the bar chart and the stacked bar chart,
 * some xAxis setting and yAxis setting are swapped.
 * We believe xAxis is always the bottom one and the yAxis is the side one,
 * but highchart think that the caterory is the xAxis and the value is yAxis.
 * Therefore, on bar chart, highchart's xAxis is a vertical line, and our xAxis reffer to a horizontal line.
 *
 * @param {object} options HighchartsOptions
 * @returns HighchartsOptions with some x and y settings are swapped
 */
export const swapXYAxisSettings = (options: HighchartsOptions) => {
  // Type guard
  if (!options.xAxis || Array.isArray(options.xAxis) || !options.yAxis || Array.isArray(options.yAxis)) return options;

  /* Temporary disable some of the swapping as we need some discussion */
  // const tempAxisTitle = options.xAxis.title;
  const tempAxisLabels = options.xAxis.labels;
  // const tempAxisLineColor = options.xAxis.lineColor;
  // const tempAxisLineWidth = options.xAxis.lineWidth;

  // options.xAxis.title = options.yAxis.title;
  options.xAxis.labels = options.yAxis.labels as Highcharts.XAxisOptions['labels'];
  // options.xAxis.lineColor = options.yAxis.lineColor;
  // options.xAxis.lineWidth = options.yAxis.lineWidth;

  // options.yAxis.title = tempAxisTitle;
  options.yAxis.labels = tempAxisLabels;
  // options.yAxis.lineColor = tempAxisLineColor;
  // options.yAxis.lineWidth = tempAxisLineWidth;

  return options;
};

const mergeChartData = (targetChartType: ChartType, originChartData: ChartWidgetData) => {
  const targetWidgetDefaultData = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP[targetChartType]) as any;
  const existingWidgetData = originChartData;

  targetWidgetDefaultData.widgetData = merge(targetWidgetDefaultData.widgetData, existingWidgetData);

  // Avoid _merge messing up data table for default values with longer data
  (targetWidgetDefaultData.widgetData as ChartWidgetData).seriesData = existingWidgetData.seriesData;
  (targetWidgetDefaultData.widgetData as ChartWidgetData).seriesMeta = existingWidgetData.seriesMeta;

  // If we are changing to Donut, then set innerSize to 50.
  if (
    targetChartType === ChartType.DonutPie &&
    (targetWidgetDefaultData.widgetData as ChartWidgetData).generalOptions.innerSize === 0
  ) {
    (targetWidgetDefaultData.widgetData as ChartWidgetData).generalOptions.innerSize = 50;
  }

  // If we are changing to Pie, then set innerSize to 0.
  if (
    targetChartType === ChartType.Pie &&
    (targetWidgetDefaultData.widgetData as ChartWidgetData).generalOptions.innerSize > 0
  ) {
    (targetWidgetDefaultData.widgetData as ChartWidgetData).generalOptions.innerSize = 0;
  }

  return targetWidgetDefaultData;
};

export { useHighChartOptions, mergeChartData };
