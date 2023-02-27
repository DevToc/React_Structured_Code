import { screen, fireEvent } from '@testing-library/react';
import { EMPTY_INFOGRAPH } from '../../../../../../../utils/loadSampleInfograph';
import { renderWithRedux } from '../../../../../../../utils/test-utils.test';
import { InfographLoader } from '../../../../../../InfographLoader';
import Editor from '../../../../../Editor';

describe('WidgetMenu/ChartsWidgetMenu', () => {
  it('should add chart', () => {
    global.window.scrollTo = jest.fn();

    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // Open charts menu
    const chartMenuButton = screen.getByRole('button', { name: /Charts/ });
    fireEvent.click(chartMenuButton);

    expect(screen.getByTestId('widgetmenu-chart-panel')).toBeInTheDocument();

    // Add widget
    const pieChartButton = screen.getByTestId('chartsmenu-pie-btn');
    fireEvent.click(pieChartButton);

    const widgets = screen.queryAllByTestId(/widgetbase-009/);
    expect(widgets).toHaveLength(1);
  });
});
