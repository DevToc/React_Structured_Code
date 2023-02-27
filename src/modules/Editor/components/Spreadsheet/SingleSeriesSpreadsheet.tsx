import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Spreadsheet } from './Spreadsheet';
import { SingleSeriesSpreadsheetProps } from './Spreadsheet.types';

export const SingleSeriesSpreadsheet = (inProps: SingleSeriesSpreadsheetProps): ReactElement => {
  const { t } = useTranslation('editor_spreadsheet', { useSuspense: false });
  const headers = [t('sideMenu.dataTable.category'), t('sideMenu.dataTable.Value')];

  return <Spreadsheet maxCols={2} colHeaders={headers} {...inProps} />;
};
