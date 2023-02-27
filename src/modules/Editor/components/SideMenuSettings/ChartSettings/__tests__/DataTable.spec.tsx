// widget-sidemenu-settings

import { render } from '@testing-library/react';
import { DataTabTable } from 'modules/Editor/components/SideMenuSettings/ChartSettings/DataTabTable';
import { ChartDataSeries } from 'widgets/ChartWidgets/ChartWidget.types';

describe('DataTable.spec.tsx', () => {
  const DEFAULT_DATA: ChartDataSeries = [
    {
      data: ['Public Sector', 'Education', 'Technology'],
    },
    {
      data: [18, 12, 6],
      name: '2010',
    },
    {
      data: [24, 16, 8],
      name: '2020',
    },
    {
      data: [30, 20, 10],
      name: '2030',
    },
  ];

  it('should render Data Table', () => {
    const { asFragment } = render(
      <DataTabTable doUpdateWidget={() => {}} id='data-table-id' seriesData={DEFAULT_DATA} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  /**
   * doTableReloadWorkaround is mostly suited to be tested in an integration test, since the Table is affected
   * by its parent. However, even with this parameter set to true, the table should be rendered when doing unit test.
   */
  it('should render Data Table if doTableReloadWorkaround is true', () => {
    const { asFragment } = render(
      <DataTabTable
        doUpdateWidget={() => {}}
        id='data-table-id'
        seriesData={DEFAULT_DATA}
        doTableReloadWorkaround={true}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
