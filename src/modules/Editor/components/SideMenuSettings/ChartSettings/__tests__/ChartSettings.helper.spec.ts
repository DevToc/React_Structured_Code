import { Color } from 'types/basic.types';
import { chartColorPalette, extendedChartColorPalette } from 'widgets/ChartWidgets/ChartWidget.config';
import { ChartWidgetData } from 'widgets/ChartWidgets/ChartWidget.types';
import { updateColorPalette } from '../ChartSettings.helpers';

describe('modules/Editor/components/SideMenuSettings/ChartSettings/ChartSettings.helpers', () => {
  describe('updateColorPalette', () => {
    it('no data and no color', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          data: [],
        },
      ];

      const initialColors: Color[] = [];

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(0);
    });

    it('no data and with colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: [],
        },
        {
          data: [],
        },
      ];

      const initialColors: Color[] = chartColorPalette;

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(chartColorPalette.length);
    });

    it('data and with no colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['test'],
        },
        {
          data: [123],
        },
      ];

      const initialColors: Color[] = [];

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(extendedChartColorPalette.length);
    });

    it('data and with more colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['test'],
        },
        {
          data: [123],
        },
      ];

      const initialColors: Color[] = chartColorPalette;

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(chartColorPalette.length);
    });

    it('more column data and with colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['test'],
        },
        {
          data: [123],
        },
        ...new Array(chartColorPalette.length).fill({
          data: [123],
        }),
      ];
      const initialColors: Color[] = chartColorPalette;

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(chartColorPalette.length + extendedChartColorPalette.length);
    });

    it('more row data and with colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['test', ...new Array(chartColorPalette.length).fill('123')],
        },
        {
          data: [123, ...new Array(chartColorPalette.length).fill(123)],
        },
      ];
      const initialColors: Color[] = chartColorPalette;

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(chartColorPalette.length + extendedChartColorPalette.length);
    });

    it('much more column data and with colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['test'],
        },
        {
          data: [123],
        },
        ...new Array(chartColorPalette.length + extendedChartColorPalette.length).fill({
          data: [123],
        }),
      ];
      const initialColors: Color[] = chartColorPalette;

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(chartColorPalette.length + extendedChartColorPalette.length * 2);
    });

    it('much more row data and with colors', () => {
      const testData: ChartWidgetData['seriesData'] = [
        {
          name: 'header column',
          data: ['test', ...new Array(chartColorPalette.length + extendedChartColorPalette.length).fill('123')],
        },
        {
          data: [123, ...new Array(chartColorPalette.length + extendedChartColorPalette.length).fill(123)],
        },
      ];
      const initialColors: Color[] = chartColorPalette;

      const colors = updateColorPalette(testData, initialColors);

      expect(colors.length).toEqual(chartColorPalette.length + extendedChartColorPalette.length * 2);
    });
  });
});
