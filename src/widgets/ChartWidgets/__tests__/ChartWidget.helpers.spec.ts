import { MIN_TABLE_COLUMNS, MIN_TABLE_ROWS } from '../ChartWidget.config';
import {
  extendSeriesData,
  fillEmptyColumnData,
  fillEmptyRowData,
  isEmptyData,
  validateDataCell,
  validateSpreadsheetColumns,
  validateSpreadsheetRows,
} from '../ChartWidget.helpers';
import { ChartWidgetData } from '../ChartWidget.types';

describe('widgets/chartWidgets/ChartWidget.helpers', () => {
  describe('validateSpreadsheetRows', () => {
    it('empty rows', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          name: 'first column',
          data: [],
        },
      ];

      const { rowNum, seriesData } = validateSpreadsheetRows(testData);

      expect(rowNum).toEqual(0);
      expect(seriesData).toEqual(testData);
    });

    it('rows with empty string data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          name: 'first column',
          data: [''],
        },
      ];

      const expected: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          name: 'first column',
          data: [],
        },
      ];

      const { rowNum, seriesData } = validateSpreadsheetRows(testData);

      expect(rowNum).toEqual(0);
      expect(seriesData).toEqual(expected);
    });

    it('rows with header', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['First Header'],
        },
        {
          name: 'first column',
          data: [''],
        },
      ];

      const { rowNum, seriesData } = validateSpreadsheetRows(testData);

      expect(rowNum).toEqual(1);
      expect(seriesData).toEqual(testData);
    });

    it('rows with invalid data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          name: 'first column',
          data: ['any data'],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          name: 'first column',
          data: [],
        },
      ];

      const { rowNum, seriesData } = validateSpreadsheetRows(testData);

      expect(rowNum).toEqual(0);
      expect(seriesData).toEqual(expectedData);
    });

    it('rows with valid data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          name: 'first column',
          data: ['123456'],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          name: 'first column',
          data: ['123456'],
        },
      ];

      const { rowNum, seriesData } = validateSpreadsheetRows(testData);

      expect(rowNum).toEqual(1);
      expect(seriesData).toEqual(expectedData);
    });

    it('rows with data and empty rows before/betwen/after data rows', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['', 'any header', '', '', 'last header row', ''],
        },
        {
          name: 'first column',
          data: ['', 'another data', '', '', 'more data', ''],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any header', 'last header row'],
        },
        {
          name: 'first column',
          data: ['another data', 'more data'],
        },
      ];

      const { rowNum, seriesData } = validateSpreadsheetRows(testData);

      expect(rowNum).toEqual(2);
      expect(seriesData).toEqual(expectedData);
    });
  });

  describe('validateSpreadsheetColumns', () => {
    it('empty columns', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          data: [],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData);

      expect(validatedData).toEqual(expectedData);
    });

    it('column headers exists with header check enable', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          name: 'first column header',
          data: [],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData);

      expect(validatedData).toEqual(testData);
    });

    it('column headers exists with header check disable', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          name: 'first column header',
          data: [],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData, {
        disableHeader: true,
      });

      expect(validatedData).toEqual(expectedData);
    });

    it('column headers not exists with invalid data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          data: ['any data'],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData);

      expect(validatedData).toEqual(expectedData);
    });

    it('column headers exists with invalid data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          name: 'any header',
          data: ['123'],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [''],
        },
        {
          name: 'any header',
          data: [123],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData);

      expect(validatedData).toEqual(expectedData);
    });

    it('column headers exists and have invalid data with header check enable', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any row header'],
        },
        {
          name: 'first column header',
          data: ['any invlid data'],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any row header'],
        },
        {
          name: 'first column header',
          data: [NaN],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData);

      expect(validatedData).toEqual(expectedData);
    });

    it('column headers exists and have valid data with header check disable', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any row header'],
        },
        {
          name: 'first column header',
          data: ['any invlid data'],
        },
      ];

      const expectedData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any row header'],
        },
        {
          name: 'first column header',
          data: [NaN],
        },
      ];

      const validatedData = validateSpreadsheetColumns(testData, {
        disableHeader: true,
      });

      expect(validatedData).toEqual(expectedData);
    });
  });

  describe('validateDataCell', () => {
    it('undefined value', () => {
      const num = validateDataCell(undefined);

      expect(num).toBe(NaN);
    });

    it('null value', () => {
      const num = validateDataCell(null);

      expect(num).toBe(NaN);
    });

    it('empty string value', () => {
      const num = validateDataCell('');

      expect(num).toBe(NaN);
    });

    it('invalid string value', () => {
      const num = validateDataCell('hfsd');

      expect(num).toBe(NaN);
    });

    it('percentage string value', () => {
      const num = validateDataCell('23%');

      expect(num).toBe(0.23);
    });

    it('invalid percentage string value', () => {
      const num = validateDataCell('fdsa%');

      expect(num).toBe(NaN);
    });

    it('integer value', () => {
      const num = validateDataCell(14);

      expect(num).toBe(14);
    });

    it('decimal value', () => {
      const num = validateDataCell(3.1415926);

      expect(num).toBe(3.1415926);
    });

    it('function value', () => {
      const num = validateDataCell(() => {});

      expect(num).toBe(NaN);
    });

    it('big int value', () => {
      const num = validateDataCell(BigInt(123));

      expect(num).toBe(NaN);
    });

    it('symbol value', () => {
      const num = validateDataCell(Symbol('123'));

      expect(num).toBe(NaN);
    });

    it('boolean value', () => {
      const num = validateDataCell(true);

      expect(num).toBe(NaN);
    });
  });

  describe('isEmptyData', () => {
    it('empty array', () => {
      const isEmpty = isEmptyData([]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with null', () => {
      const isEmpty = isEmptyData([null]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with undefined', () => {
      const isEmpty = isEmptyData([undefined]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with object', () => {
      const isEmpty = isEmptyData([{}]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with function', () => {
      const isEmpty = isEmptyData([() => {}]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with array', () => {
      const isEmpty = isEmptyData([[]]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with empty string', () => {
      const isEmpty = isEmptyData(['']);

      expect(isEmpty).toBeTruthy();
    });

    it('array with boolean', () => {
      const isEmpty = isEmptyData([true]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with bigint', () => {
      const isEmpty = isEmptyData([BigInt(123)]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with symbol', () => {
      const isEmpty = isEmptyData([Symbol('symbol')]);

      expect(isEmpty).toBeTruthy();
    });

    it('array with non-empty string', () => {
      const isEmpty = isEmptyData(['data']);

      expect(isEmpty).toBeFalsy();
    });

    it('array with number', () => {
      const isEmpty = isEmptyData([123]);

      expect(isEmpty).toBeFalsy();
    });

    it('array with number and empty string', () => {
      const isEmpty = isEmptyData([123, '']);

      expect(isEmpty).toBeFalsy();
    });

    it('array with number and non-empty string', () => {
      const isEmpty = isEmptyData([123, 'data']);

      expect(isEmpty).toBeFalsy();
    });
  });

  describe('fillEmptyRowData', () => {
    it('empty row', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          data: [],
        },
      ];

      const validatedData = fillEmptyRowData(testData);

      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS);
    });

    it('table with large amount of rows', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: new Array(MIN_TABLE_ROWS + 1).fill('random data'),
        },
      ];

      const validatedData = fillEmptyRowData(testData);

      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS + 1);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS + 1);
    });
  });

  describe('fillEmptyColumnData', () => {
    it('empty table', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          data: [],
        },
      ];

      const validatedData = fillEmptyColumnData(testData);

      expect(validatedData.length).toBe(MIN_TABLE_COLUMNS);
    });

    it('table with large amount of columns', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any thing', 'another thing'],
        },
        ...new Array(MIN_TABLE_COLUMNS + 1).fill({
          data: ['more thing', 'more more thing'],
        }),
      ];

      const validatedData = fillEmptyColumnData(testData);

      expect(validatedData.length).toBe(testData.length);
    });
  });

  describe('extendSeriesData', () => {
    it('empty table', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          data: [],
        },
      ];

      const validatedData = extendSeriesData(testData);

      expect(validatedData.length).toBe(MIN_TABLE_COLUMNS);
      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS);
    });

    it('table with a few data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any thing', 'another thing'],
        },
        {
          data: ['more thing', 'more more thing'],
        },
      ];

      const validatedData = extendSeriesData(testData);

      expect(validatedData.length).toBe(MIN_TABLE_COLUMNS);
      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS);
    });

    it('table with large amount of columns', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['any thing', 'another thing'],
        },
        ...new Array(MIN_TABLE_COLUMNS + 1).fill({
          data: ['more thing', 'more more thing'],
        }),
      ];

      const validatedData = extendSeriesData(testData);

      expect(validatedData.length).toBe(testData.length);
      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS);
    });

    it('table with large amount of rows', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: new Array(MIN_TABLE_ROWS + 1).fill('random data'),
        },
      ];

      const validatedData = extendSeriesData(testData);

      expect(validatedData.length).toBe(MIN_TABLE_COLUMNS);
      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS + 1);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS + 1);
    });

    it('table with large amount of data', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: new Array(MIN_TABLE_ROWS + 1).fill('random data'),
        },
        ...new Array(MIN_TABLE_COLUMNS).fill({
          name: 'header column',
          data: new Array(MIN_TABLE_ROWS + 1).fill('random data'),
        }),
      ];

      const validatedData = extendSeriesData(testData);

      expect(validatedData.length).toBe(MIN_TABLE_COLUMNS + 1);
      expect(validatedData[0].data.length).toBe(MIN_TABLE_ROWS + 1);
      expect(validatedData[validatedData.length - 1].data.length).toBe(MIN_TABLE_ROWS + 1);
    });
  });
});
