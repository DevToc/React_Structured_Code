import cloneDeep from 'lodash.clonedeep';
import { swapXYAxisSettings } from '../DataTableChartCommon.helpers';
import { HighchartsOptions } from '../DataTableChartCommon.types';

describe('widgets/chartWidgets/DataTableChartCommon/ChartWidget.helpers', () => {
  describe('swapXYAxisSettings', () => {
    it('swap x and y settings successfully', () => {
      const originalData = {
        xAxis: {
          labels: {
            enabled: true,
            style: {
              color: 'red',
              fontSize: '12px',
              fontFamily: 'X font family',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
            },
          },
        },
        yAxis: {
          labels: {
            enabled: false,
            style: {
              color: 'blue',
              fontSize: '24px',
              fontFamily: 'Y font family',
              fontWeight: 'bold',
              fontStyle: 'italic',
              textDecoration: 'none',
            },
          },
        },
      };

      const testData = cloneDeep(originalData);

      const expectedData: HighchartsOptions = {
        xAxis: originalData.yAxis,
        yAxis: originalData.xAxis,
      };

      swapXYAxisSettings(testData);

      expect(testData).toEqual(expectedData);
    });
  });
});
