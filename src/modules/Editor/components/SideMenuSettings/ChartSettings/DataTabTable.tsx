import React, { useEffect, useMemo, useRef, useState } from 'react';
import HotTable from '@handsontable/react';
import { validateSpreadsheetData } from 'widgets/ChartWidgets/ChartWidget.helpers';
import { ChartDataSeries, ChartWidgetData, SpreadsheetRow } from 'widgets/ChartWidgets/ChartWidget.types';
import { Spreadsheet } from '../../Spreadsheet';
import { CellChange, CellValue } from '../../Spreadsheet/Spreadsheet.types';
import { updateColorPalette } from './ChartSettings.helpers';

type TableColumn = {
  name?: string | number;
  data: CellValue[];
};

interface DataTabTableProps {
  seriesData: ChartDataSeries;

  /**
   * Since we do not use the redux thunk,
   * this is used to passed any data that the Spreadsheet does not depend on but requested on data saving.
   */
  optionRef?: React.RefObject<Pick<ChartWidgetData, 'seriesMeta'>>;
  doUpdateWidget: (props: Partial<ChartWidgetData>) => void;

  // To address bug where handsontable doesn't render until user clicks on side panel due to parent not being completely rendered yet
  // Ref: https://forum.handsontable.com/t/table-not-fully-rendered-until-click/1482
  doTableReloadWorkaround?: boolean;
}

type UpdateFn = (prop: CellChange[]) => void;
type TableChangeFn = (index: number, amount: number) => void;

const DataTabTable = ({
  seriesData,
  optionRef,
  doUpdateWidget,
  doTableReloadWorkaround = false,
}: DataTabTableProps): ReturnType<React.FC> => {
  const tableRef = useRef<HotTable>(null);
  const seriesDataRef = useRef<TableColumn[]>(seriesData);
  const dataRef = useRef<SpreadsheetRow[]>(validateSpreadsheetData(seriesData));
  const [show, setShow] = useState<boolean>(!doTableReloadWorkaround);

  const updateFn = useRef<UpdateFn>(() => {});
  const addRowFn = useRef<TableChangeFn>(() => {});
  const addColFn = useRef<TableChangeFn>(() => {});
  const removeRowFn = useRef<TableChangeFn>(() => {});
  const removeColFn = useRef<TableChangeFn>(() => {});

  // To address bug where handsontable doesn't render until user clicks on side panel due to parent not being completely rendered yet
  // Ref: https://forum.handsontable.com/t/table-not-fully-rendered-until-click/1482
  useEffect(() => {
    if (doTableReloadWorkaround) {
      setShow(true);
    }
  }, [doTableReloadWorkaround]);

  // Update the table if the data changed
  useEffect(() => {
    if (JSON.stringify(seriesData) !== JSON.stringify(seriesDataRef.current)) {
      seriesDataRef.current = seriesData;
      tableRef.current?.hotInstance?.loadData(validateSpreadsheetData(seriesData));
    }
  }, [seriesData]);

  useEffect(() => {
    // TODO, all these should be redux thunk functions
    updateFn.current = (changes: CellChange[]) => {
      let isUpdated = false;
      const updatedSeriesData = changes.length > 0 ? [...seriesData] : seriesData;

      changes.forEach(([row, col, prevValue, nextValue]) => {
        // Not gonna to support array of objects for now
        if (typeof col === 'string') {
          return;
        }

        // Check if it is first row, which means it is a header
        if (row === 0) {
          updatedSeriesData[col] = {
            ...updatedSeriesData[col],
            name: nextValue,
          };

          isUpdated = true;
          return;
        }

        const notNullNext = nextValue ?? '';
        if (prevValue !== notNullNext) {
          const copiedColumn = [...updatedSeriesData[col].data];

          // Since the first row is the header, so the row number on the datastructure should be -1
          copiedColumn.splice(row - 1, 1, notNullNext);

          updatedSeriesData[col] = {
            ...updatedSeriesData[col],
            data: copiedColumn,
          };

          isUpdated = true;
        }
      });

      if (isUpdated) {
        seriesDataRef.current = updatedSeriesData;

        const updatedWidgetData: Parameters<typeof doUpdateWidget>[0] = {
          seriesData: updatedSeriesData as ChartDataSeries,
        };

        const currentColors = optionRef?.current?.seriesMeta?.colors ?? [];
        const colors = updateColorPalette(updatedSeriesData as ChartDataSeries, currentColors);

        if (JSON.stringify(currentColors) !== JSON.stringify(colors)) {
          updatedWidgetData['seriesMeta'] = {
            ...optionRef?.current?.seriesMeta,
            colors,
          };
        }

        doUpdateWidget(updatedWidgetData);
      }
    };

    addRowFn.current = (index, amount) => {
      const updatedSeriesData = seriesData.map(({ data, ...otherData }) => {
        const copiedData = [...data];

        // Since the first row is the header, so the row number on the datastructure should be -1
        copiedData.splice(index - 1, 0, ...Array(amount).fill(''));

        return {
          ...otherData,
          data: copiedData,
        };
      });

      seriesDataRef.current = updatedSeriesData;

      doUpdateWidget({
        seriesData: updatedSeriesData as unknown as ChartDataSeries,
      });
    };

    addColFn.current = (index, amount) => {
      const updatedSeriesData = [...seriesData];
      const tableRows = tableRef.current?.hotInstance?.countSourceRows() ?? 0;
      updatedSeriesData.splice(
        index,
        0,
        ...Array(amount).fill({
          name: '',
          // The first row is the header, so need to -1
          data: Array(tableRows > 0 ? tableRows - 1 : 0).fill(''),
        }),
      );

      seriesDataRef.current = updatedSeriesData;

      doUpdateWidget({
        seriesData: updatedSeriesData as unknown as ChartDataSeries,
      });
    };

    removeRowFn.current = (index, amount) => {
      const updatedSeriesData = seriesData.map(({ data, ...otherData }) => {
        const copiedData = [...data];

        // Since the first row is the header, so the row number on the datastructure should be -1
        copiedData.splice(index - 1, amount);

        return {
          ...otherData,
          data: copiedData,
        };
      });

      seriesDataRef.current = updatedSeriesData;

      doUpdateWidget({
        seriesData: updatedSeriesData as unknown as ChartDataSeries,
      });
    };

    removeColFn.current = (index, amount) => {
      const updatedSeriesData = [...seriesData];
      updatedSeriesData.splice(index, amount);

      seriesDataRef.current = updatedSeriesData;

      doUpdateWidget({
        seriesData: updatedSeriesData as unknown as ChartDataSeries,
      });
    };
  }, [doUpdateWidget, seriesData, optionRef]);

  const spreadsheetHooks = useMemo(() => {
    const afterChange = (changes: CellChange[] | null) => {
      updateFn.current(changes ?? []);
    };

    const afterCreateRow = (index: number, amount: number) => {
      addRowFn.current(index, amount);
    };

    const afterCreateCol = (index: number, amount: number) => {
      addColFn.current(index, amount);
    };

    const afterRemoveRow = (index: number, amount: number) => {
      removeRowFn.current(index, amount);
    };

    const afterRemoveCol = (index: number, amount: number) => {
      removeColFn.current(index, amount);
    };

    return {
      afterChange,
      afterCreateRow,
      afterCreateCol,
      afterRemoveRow,
      afterRemoveCol,
    };
  }, []);

  return show ? <Spreadsheet ref={tableRef} data={dataRef.current} {...spreadsheetHooks} /> : null;
};

const MemorizedDataTabTable = React.memo(DataTabTable) as typeof DataTabTable;
export { MemorizedDataTabTable as DataTabTable };
