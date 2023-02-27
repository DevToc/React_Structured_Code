import HotTable from '@handsontable/react';

/**
 * A cell value, which can be anything to support custom cell data types, but by default is `string | number | boolean | undefined`.
 * @see https://github.com/handsontable/handsontable/blob/develop/handsontable/types/common.d.ts
 */
export type CellValue = any;

/**
 * A cell change represented by `[row, column, prevValue, nextValue]`.
 * @see https://github.com/handsontable/handsontable/blob/develop/handsontable/types/common.d.ts
 */
export type CellChange = [number, string | number, CellValue, CellValue];

export interface SpreadsheetProps extends React.ComponentProps<typeof HotTable> {}

export interface SingleSeriesSpreadsheetProps extends SpreadsheetProps {}

export interface MultiSeriesSpreadsheetProps extends SpreadsheetProps {}
