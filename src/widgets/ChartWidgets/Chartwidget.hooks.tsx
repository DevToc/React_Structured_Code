import { useEffect, useCallback, useRef, useState } from 'react';
import throttle from 'lodash.throttle';
import HighchartsReact from 'highcharts-react-official';

import { CustomOnResize } from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { UseHighchartsDataProps } from './ChartWidget.types';
import { validateSpreadsheetRows, validateSpreadsheetColumns } from './ChartWidget.helpers';
import { SeriesColorPickerProps } from 'modules/Editor/components/SideMenuSettings/ChartSettings/ChartSettings.types';

const UPDATE_TIME = 100;

interface UseResponsiveHighchartProps {
  chartRef: React.RefObject<HighchartsReact.RefObject> | null;
  heightPx: number;
  widthPx: number;
}

export const useResponsiveHighchart = ({ chartRef, heightPx, widthPx }: UseResponsiveHighchartProps) => {
  useEffect(() => {
    if (!chartRef?.current) return;

    chartRef.current.chart.setSize(widthPx, heightPx);
  }, [heightPx, widthPx, chartRef]);

  // keep the chart size in sync with widget size while resizing
  const customOnResize = useCallback(
    ({ onResize, event }: CustomOnResize) => {
      onResize(event);

      if (!chartRef?.current) return;
      const target = event.target as HTMLDivElement;
      chartRef.current.chart.setSize(target.clientWidth ?? event.width, target.clientHeight ?? event.height);
    },
    [chartRef],
  );

  return { customOnResize };
};

export type HighchartsSeriesData = { name: string; color: string; data: number[] };

interface UseHighchartsDataResult {
  categories: string[];
  series: HighchartsSeriesData[];
  colorPickerSeries: SeriesColorPickerProps['series'];

  /**
   * Custom key is used to remember the time of data changed.
   * This is required on highchart wrapper to force an update on highchart.
   *
   * This fix the bug that
   * when the data is changed from the number to NaN or empty string, the chart would not be updated
   */
  keyCustom: number;

  mostLengthyLabel: string;
}

/**
 * A hook to generate the 'series' requested by the Highcharts lib
 * from the 'seriesData' which is used by the handsontable
 * @param {object} props see UseHighchartsDataProps interface
 * @returns A 'series' object used by Highchart.
 */
export const useHighchartsData = ({
  seriesData,
  seriesMeta,
  allowSingleSeries = false,
  forceSingleSeries,
  disableHeader = false,
  seriesOption,
}: UseHighchartsDataProps): UseHighchartsDataResult => {
  const [{ rowNum, seriesData: partialValidSeriesData }, setValidRows] = useState(validateSpreadsheetRows(seriesData));
  const prev = useRef<UseHighchartsDataResult>({
    categories: [],
    series: [],
    colorPickerSeries: [],
    keyCustom: 0,
    mostLengthyLabel: '',
  });
  const [returnVal, setReturnVal] = useState<UseHighchartsDataResult>(prev.current);
  const throttledUpdate = useRef<typeof setReturnVal>(
    throttle((...val: Parameters<typeof setReturnVal>) => {
      setReturnVal(...val);
    }, UPDATE_TIME),
  );

  useEffect(() => {
    const validRowSeries = validateSpreadsheetRows(seriesData);
    setValidRows((currentData) => {
      return JSON.stringify(currentData) !== JSON.stringify(validRowSeries) ? validRowSeries : currentData;
    });
  }, [seriesData]);

  const calculateChangesAndUpdateData = useCallback(() => {
    let next = prev.current;
    let mostLengthyLabel = '';

    // Destruct and remove the first column, so we can still keep the type info
    const [rowHeaderColumn, ...validColumnData] = validateSpreadsheetColumns(partialValidSeriesData, {
      disableHeader,
    });

    // No data, skip
    if (rowNum === 0 || validColumnData.length === 0) {
      if (prev.current.categories.length !== 0) {
        next = { ...next, categories: [], mostLengthyLabel };
      }

      if (prev.current.series.length !== 0) {
        next = { ...next, series: [], mostLengthyLabel };
      }

      if (next !== prev.current) {
        // Add the key with time indicating that it is changed
        prev.current = { ...next, keyCustom: Date.now() };
        throttledUpdate.current(next);
      }

      return;
    }

    let colorPickerSeries: UseHighchartsDataResult['colorPickerSeries'] = [];
    let series: UseHighchartsDataResult['series'] = [];
    const colors = [...seriesMeta.colors];

    if (forceSingleSeries || (allowSingleSeries && validColumnData.length === 1)) {
      // Generate the single series data
      const { data: numData } = validColumnData[0];

      const data = numData.map((y, index) => {
        const colorPickerToken = {
          name: rowHeaderColumn.data[index],
          color: colors[index],
        };
        colorPickerSeries.push(colorPickerToken);

        const numberAsString = y.toString();
        if (numberAsString.length > mostLengthyLabel.length) {
          mostLengthyLabel = numberAsString;
        }

        return {
          ...colorPickerToken,
          y: Number.isNaN(y) ? null : y,
        };
      });

      series = [{ data }] as unknown as HighchartsSeriesData[]; // Ignore the type for now
    } else {
      // Generate the multi series data
      series = validColumnData.map(({ name, data }, index) => {
        const colorPickerToken = {
          name: name ?? '',
          color: colors[index],
        };
        colorPickerSeries.push(colorPickerToken);

        return {
          ...colorPickerToken,
          data: data.map((value) => {
            return Number.isNaN(value) ? null : value;
          }),
        };
      }) as unknown as HighchartsSeriesData[]; // Ignore the type for now
      colorPickerSeries = series;
    }

    // Store the highcharts series only if it is changed
    if (
      rowHeaderColumn.data.length !== next.categories.length ||
      JSON.stringify(rowHeaderColumn.data) !== JSON.stringify(next.categories)
    ) {
      next = { ...next, categories: rowHeaderColumn.data, mostLengthyLabel };
    }

    if (series.length !== next.series.length || JSON.stringify(series) !== JSON.stringify(next.series)) {
      next = { ...next, series, mostLengthyLabel };
    }

    if (
      colorPickerSeries.length !== next.colorPickerSeries.length ||
      JSON.stringify(colorPickerSeries) !== JSON.stringify(next.colorPickerSeries)
    ) {
      next = { ...next, colorPickerSeries, mostLengthyLabel };
    }

    // Check if anything changed
    if (next !== prev.current) {
      // Add the key with time indicating that it is changed
      prev.current = { ...next, keyCustom: Date.now() };
      throttledUpdate.current(next);
    }
  }, [allowSingleSeries, disableHeader, forceSingleSeries, partialValidSeriesData, rowNum, seriesMeta.colors]);

  // Workaround until rewrite of this hook. If it is the first render, update the return values, so they
  // don't go out empty and wait for a useEffect to calculate, as we already have the data from the beginning,
  // and so we should be able to compute the result.
  // This fixes the issue on scale changing without doing anything, or sometimes onClick of the widget
  // after page load.
  if (prev.current.keyCustom === 0) {
    calculateChangesAndUpdateData();
  }

  useEffect(() => {
    calculateChangesAndUpdateData();
  }, [calculateChangesAndUpdateData]);

  return returnVal;
};
