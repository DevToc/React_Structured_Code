import React, { ReactElement } from 'react';
import { SpreadsheetProps } from './Spreadsheet.types';

// handson table
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { forwardRef } from '@chakra-ui/react';
import { ContextMenu } from 'handsontable/plugins';

// register Handsontable's modules
registerAllModules();

const HANDSON_TABLE_LICENCE = process.env.REACT_APP_HANDSON_TABLE_LICENCE;

export const Spreadsheet = React.memo(
  forwardRef(function Spreadsheet({ data = [], ...otherProps }: SpreadsheetProps, ref): ReactElement {
    return (
      <HotTable
        licenseKey={HANDSON_TABLE_LICENCE}
        id={'hot-spreadsheet'}
        ref={ref}
        data={data}
        colHeaders={true}
        rowHeaders={true}
        width={'auto'}
        height={'auto'}
        undo={false}
        contextMenu={{
          items: {
            row_above: {
              disabled() {
                // Disable add row above when the first row is selected
                return (this.getSelectedLast()?.[0] ?? 0) <= 0;
              },
            },
            row_below: {},
            col_left: {
              disabled() {
                // Disable add col left when the first col is selected
                return (this.getSelectedLast()?.[1] ?? 0) <= 0;
              },
            },
            col_right: {},
            separator_02: ContextMenu.SEPARATOR,
            remove_row: {
              disabled() {
                // Disable remove row when the first row is selected
                return this.getSelectedLast()?.[0] === 0;
              },
            },
            remove_col: {
              disabled() {
                // Disable add col left when the first col is selected
                return (this.getSelectedLast()?.[1] ?? 0) <= 0;
              },
            },
          },
        }}
        {...otherProps}
      />
    );
  }),
);
