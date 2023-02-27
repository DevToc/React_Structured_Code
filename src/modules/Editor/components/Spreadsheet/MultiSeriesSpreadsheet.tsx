import React, { ReactElement } from 'react';
import { Spreadsheet } from './Spreadsheet';
import { MultiSeriesSpreadsheetProps } from './Spreadsheet.types';

export const MultiSeriesSpreadsheet = (inProps: MultiSeriesSpreadsheetProps): ReactElement => {
  return <Spreadsheet {...inProps} />;
};
