import { Color } from 'types/basic.types';
import { extendedChartColorPalette } from 'widgets/ChartWidgets/ChartWidget.config';
import { validateSpreadsheetColumns, validateSpreadsheetRows } from 'widgets/ChartWidgets/ChartWidget.helpers';
import { ChartDataSeries } from 'widgets/ChartWidgets/ChartWidget.types';

/**
 * extend a colors palette that the user is using on charts that hava a data table on the side panel.
 * Depending on the data on the table, when more colors are required to match with the header,
 * extend the palelle using the pre-defined color palette.
 *
 * @param seriesData ChartDataSeries, widgets/ChartWidgets/ChartWidget.types.ts
 * @param currentColors
 * @returns The extended color palatte, if more color are needed, or the original color palette.
 */
export const updateColorPalette = (seriesData: ChartDataSeries, currentColors: Color[]): Color[] => {
  const { rowNum, seriesData: partialValidatedSeriesData } = validateSpreadsheetRows(seriesData);
  const validatedColumns = validateSpreadsheetColumns(partialValidatedSeriesData);

  const colors = [...currentColors];

  // For single series, row number map with the number of colors.
  // For multi series, column number map with the number of colors.
  // (note: as the type interface shown, the first column is the header, so the column need to minus 1)
  while (colors.length < rowNum || colors.length < validatedColumns.length - 1) {
    colors.push(...extendedChartColorPalette);
  }

  return colors;
};
