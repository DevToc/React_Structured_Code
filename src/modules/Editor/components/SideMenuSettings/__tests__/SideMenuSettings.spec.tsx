import { screen, fireEvent } from '@testing-library/react';
import { mockAddLineChartWidget, mockSetActiveWidget, renderWithRedux } from '../../../../../utils/test-utils.test';
import Editor from '../../../Editor';
import { InfographLoader } from '../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

// Helper to trigger opening accessibility menu
const openAccessibilityMenu = () => {
  const openMenuBtn = screen.getByTestId('navbar-accessibility-button');
  fireEvent.click(openMenuBtn);
};

// Helper to trigger adding chart widget + opening edit panel
const openChartPanel = () => {
  mockAddLineChartWidget();
  const widget = screen.queryAllByTestId(/widgetbase-/)[0];
  mockSetActiveWidget(widget.id);

  const editChartButton = screen.getByRole('button', { name: /Edit Chart/ });
  fireEvent.click(editChartButton);
};

// Warning this test still runs on react 17
// See: https://github.com/testing-library/react-testing-library/issues/1051
describe('SideMenuSettings/SideMenuSettings.tsx', () => {
  // TODO: remove this once it has been updated to React 18
  // hide legacy error
  jest.spyOn(global.console, 'error').mockImplementationOnce((message) => {
    if (!message.includes('ReactDOM.render')) {
      global.console.warn(message);
    }
  });

  it('should close a11y menu when chart panel is opened', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
      // React 17
      { legacyRoot: true },
    );
    // Open a11y menu
    openAccessibilityMenu();
    expect(screen.getByTestId('accessibility-menu')).toBeInTheDocument();
    // Open chart panel
    openChartPanel();
    const editPanel = screen.getByTestId('widget-sidemenu-settings');
    expect(editPanel).not.toHaveStyle('display: none');
    expect(screen.queryByTestId('accessibility-menu')).not.toBeInTheDocument();
  });

  it('should close chart panel when a11y menu is opened', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
      // React 17
      { legacyRoot: true },
    );

    // Open chart panel
    openChartPanel();

    let editPanel = screen.getByTestId('widget-sidemenu-settings');
    expect(editPanel).not.toHaveStyle('display: none');

    // Open a11y menu
    openAccessibilityMenu();

    editPanel = screen.getByTestId('widget-sidemenu-settings');
    expect(editPanel).toHaveStyle('display: none');
    expect(screen.getByTestId('accessibility-menu')).toBeInTheDocument();
  });
});
