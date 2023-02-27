import { CellValue } from '../../modules/Editor/components/Spreadsheet/Spreadsheet.types';
import { transpose } from '../../utils/matrix';
import { ChartDataSeries, ChartTableColumnSeries, ChartWidgetData, SpreadsheetRow } from './ChartWidget.types';
import { MIN_TABLE_COLUMNS, MIN_TABLE_ROWS } from './ChartWidget.config';

// A type map that converses the array of column object to the array of column data array.
type SeriesDataMatrixType<T extends ChartDataSeries> = {
  [index in keyof T]: T[index]['data'];
} & { length: T['length'] };

/**
 * A util function that is used to remove the empty rows from the seriesData
 *
 * @param seriesData
 * @returns A modified seriesData which has the same structure as the original one, and the valid row number
 */
export const validateSpreadsheetRows = (seriesData: ChartWidgetData['seriesData']) => {
  const columnMatrix = seriesData.map(({ data }) => data) as SeriesDataMatrixType<ChartWidgetData['seriesData']>;
  const rowMatrix = transpose(columnMatrix);

  // Remove empty rows and the invalid rows
  const validRowMatrix = rowMatrix.reduce((matrix, currentRow) => {
    if (isValidRow(currentRow)) {
      matrix.push(currentRow);
    }
    return matrix;
  }, [] as typeof rowMatrix);

  const validColumnMatrix = transpose(validRowMatrix) as SeriesDataMatrixType<ChartWidgetData['seriesData']>;

  const validSeriesData = seriesData.map(({ name }, index) => {
    return { name, data: validColumnMatrix[index] ?? [] };
  }) as ChartWidgetData['seriesData'];

  return {
    rowNum: validSeriesData.length > 0 ? validSeriesData[0].data.length : 0,
    seriesData: validSeriesData,
  };
};

interface ValidateSpreadsheetColumnsOptions {
  // True if not checking the column header to determine if it is a empty column
  // Default: false
  // Ex: When true, { name: any, data: [] } would be considered as empty column
  // Ex: When false, { name: undefined | null | '', data: [] } would be considered as empty column
  disableHeader?: boolean;
}

/**
 * A util function that is used to remove the empty columns from the seriesData
 *
 * @param seriesData
 * @returns A modified seriesData which has the same structure as the original one, and the valid row number
 */
export const validateSpreadsheetColumns = (
  seriesData: ChartWidgetData['seriesData'],
  options?: ValidateSpreadsheetColumnsOptions,
): [ChartTableColumnSeries<string>, ...ChartTableColumnSeries<number>[]] => {
  const { disableHeader = false } = options ?? {};

  // Destruct and remove the first column so we can still keep the type info
  const [rowHeaderColumn, ...columnDataSeries] = seriesData;

  // Remove empty columns
  const validColumnData = columnDataSeries.reduce((processedSeries, { name, data }) => {
    if ((!disableHeader && typeof name === 'string' && name !== '') || !isEmptyData(data)) {
      const validatedData = data.map(validateDataCell) as number[];

      // A valid data array should have at least one number that is not NaN
      const isValidDataArray = validatedData.filter((value) => !Number.isNaN(value)).length > 0;
      if (isValidDataArray || (typeof name === 'string' && name !== '')) {
        processedSeries.push({
          name: name ?? '',
          data: validatedData,
        });
      }
    }

    return processedSeries;
  }, [] as ChartTableColumnSeries<number>[]);

  return [rowHeaderColumn, ...validColumnData];
};

/**
 * Validate a data cell to a data type used by the highchart.
 * Currently we takes only the number
 *
 * @param {any} value The value to be test
 * @returns {number} a number, including NaN
 */
export const validateDataCell = (value: CellValue): number => {
  // We take numbers as the value data on the charts
  if (typeof value === 'number') {
    return value;
  }

  // For string, we convert to a number
  if (typeof value === 'string') {
    // remove the leading and the ending spaces
    const valueWithoutSpace = value.trim();

    // empty string should return NaN instead of 0
    if (valueWithoutSpace.length === 0) {
      return NaN;
    }

    // Check if it is a percentage string number
    if (valueWithoutSpace.charAt(valueWithoutSpace.length - 1) === '%') {
      const numberString = valueWithoutSpace.slice(0, -1);

      return numberString.length > 0 ? Number(numberString) / 100 : NaN;
    }

    return Number(valueWithoutSpace);
  }

  // For other cell type such as boolean, symbol, bigNumber, function, etc..
  return NaN;
};

/**
 * Some column name on the table data is used for other purpose such as the color
 *
 * color of the chart is changed on another tab on the side panel, so we do not want to display on the spreadsheet
 *
 * @param {object} data The spreadsheet data
 * @return {object} The modified spreadsheet data
 */
export const validateSpreadsheetData = (data: SpreadsheetRow[]) => {
  const columnMatrix = data.map(({ name, data: column }) => [name ?? '', ...column]);
  return transpose(columnMatrix);
};

/**
 * Check if the array represent an empty data set to the highchart
 * Currently, we only accept number or non-empty string
 *
 * @param {any[]} data the array to be test
 * @returns false if the array contains useful data
 */
export const isEmptyData = (data: CellValue[]) => {
  if (!data || data.length === 0) {
    return true;
  }

  for (let index = 0; index < data.length; ++index) {
    const value = data[index];
    if (typeof value === 'number' || (typeof value === 'string' && value !== '')) {
      return false;
    }
  }

  return true;
};

/**
 * Check if a row is valid,
 * it should have a non-empty header or any accepted data by highchart
 *
 * @param {any[]} data The row that contains any data
 * @returns {boolean} true if the row is valid, otherwise returns false
 */
export const isValidRow = (data: CellValue[]) => {
  // A valid row contains at least 1 data as the row header
  if (data.length < 1) {
    return false;
  }

  const [header, ...otherValues] = data;

  // If the header exists in a row, we define that it is a non-empty valid row.
  if (typeof header === 'string' && header !== '') {
    return true;
  }

  // Check if otherValues contains at least one valid value.
  return otherValues.some((value) => !Number.isNaN(validateDataCell(value)));
};

/**
 * A helper function for 'extendSeriesData' to extend the row number and fill with empty string
 * unit tests are also covered by the 'extendSeriesData'
 *
 * @param {object} seriesData
 * @returns seriesData
 */
export const fillEmptyRowData = (seriesData: ChartWidgetData['seriesData']): ChartWidgetData['seriesData'] => {
  const rowNumDiff = MIN_TABLE_ROWS - seriesData[0].data.length;
  if (rowNumDiff > 0) {
    return seriesData.map(({ data, ...otherProps }) => ({
      ...otherProps,
      data: [...data].concat(new Array(rowNumDiff).fill('')),
    })) as ChartWidgetData['seriesData'];
  }

  return seriesData;
};

/**
 * A helper function for 'extendSeriesData' to extend the column number and fill with empty string
 * unit tests are also covered by the 'extendSeriesData'
 *
 * @param {object} seriesData
 * @returns seriesData
 */
export const fillEmptyColumnData = (seriesData: ChartWidgetData['seriesData']): ChartWidgetData['seriesData'] => {
  const colNumDiff = MIN_TABLE_COLUMNS - seriesData.length;
  if (colNumDiff > 0) {
    const rowLength = seriesData[0].data.length;
    return [...seriesData].concat(
      new Array(colNumDiff).fill({
        data: new Array(rowLength).fill(''),
      }),
    ) as ChartWidgetData['seriesData'];
  }

  return seriesData;
};

/**
 * expend the side panel table to have empty rows and columns
 *
 * @param {object} seriesData
 * @returns seriesData
 */
export const extendSeriesData = (seriesData: ChartWidgetData['seriesData']): ChartWidgetData['seriesData'] => {
  return fillEmptyColumnData(fillEmptyRowData(seriesData));
};
