import { fireEvent, screen } from '@testing-library/react';
import Editor from 'modules/Editor/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { mockAddLineChartWidget, mockSetActiveWidget, renderWithRedux } from 'utils/test-utils.test';

describe('components/PageArea', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const accessibilityMenuBtn = screen.getByRole('button', { name: /Open Accessibility Menu/ });
    return {
      accessibilityMenuBtn,
    };
  };

  it('should have page menu displayed when accessibility checker opened and close it with slide view open', async () => {
    const { accessibilityMenuBtn } = setup();

    await fireEvent.click(accessibilityMenuBtn);

    const accessibilityView = await screen.findByTestId(/accessibility-menu/);
    const showSlideBtn = await screen.findByLabelText(/Show All Pages/);
    expect(accessibilityView).toBeInTheDocument();
    expect(showSlideBtn).toBeInTheDocument();

    await fireEvent.click(showSlideBtn);

    const hideSlideBtn = await screen.findByLabelText(/Hide All Pages/);
    expect(hideSlideBtn).toBeInTheDocument();
    expect(accessibilityView).not.toBeInTheDocument();

    fireEvent.click(hideSlideBtn);
    expect(screen.getByLabelText(/Find Page/)).toBeInTheDocument();
  });

  it('should have page menu displayed when widget settings view opened and close it with slide view open', async () => {
    global.window.scrollTo = jest.fn();
    setup();

    mockAddLineChartWidget();
    const [widget] = screen.queryAllByTestId(/widgetbase-/);
    mockSetActiveWidget(widget.id);

    const editChartButton = screen.getByRole('button', { name: /Edit Chart/ });
    fireEvent.click(editChartButton);

    const widgetSettingsView = screen.getByTestId('widget-sidemenu-settings');
    const showSlideBtn = screen.getByLabelText(/Show All Pages/);
    expect(widgetSettingsView).toBeVisible();
    expect(showSlideBtn).toBeInTheDocument();

    await fireEvent.click(showSlideBtn);

    const hideSlideBtn = await screen.findByLabelText(/Hide All Pages/);
    expect(hideSlideBtn).toBeInTheDocument();
    expect(widgetSettingsView).not.toBeVisible();

    fireEvent.click(hideSlideBtn);
  });
});
