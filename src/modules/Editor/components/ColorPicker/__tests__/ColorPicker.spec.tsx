import { screen, fireEvent, act } from '@testing-library/react';

import { renderWithRedux, mockAddBasicShapeWidget, mockSetActiveWidget } from 'utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import Editor from 'modules/Editor';
import { InfographLoader } from 'modules/InfographLoader';

describe('components/ColorPicker', () => {
  it('should set load / add / set swatch colors to the infograph in the editor', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    mockSetActiveWidget(widget.id);
    fireEvent.click(screen.queryAllByTestId('colorpicker-button')[0]);

    const swatchButtons = screen.getAllByTestId(/color-swatch-color/);
    expect(swatchButtons.length).toBe(2);

    // add swatch color to infograph
    const addSwatchColorButton = screen.getByTestId('color-swatch-add-color');
    fireEvent.click(addSwatchColorButton);
    expect(screen.getAllByTestId(/color-swatch-color/).length).toBe(3);

    //  remove swatch color to infograph
    act(() => swatchButtons[0].focus());
    const deleteSwatchColorButton = screen.getByTestId(/color-swatch-button-delete/);
    fireEvent.click(deleteSwatchColorButton);
    expect(screen.getAllByTestId(/color-swatch-color/).length).toBe(2);
  });

  it('should open visual simulator by clicking the visual simulator button', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const colorPickerButton = screen.getByTestId('colorpicker-button');
    expect(colorPickerButton).toBeInTheDocument();
    fireEvent.click(colorPickerButton);

    const visulaSimulatorButton = screen.getByTestId('colorpicker-visual-simulator');
    expect(visulaSimulatorButton).toBeInTheDocument();
    fireEvent.click(visulaSimulatorButton);

    await act(async () => {
      const simulatorTab = await screen.findByRole('tab', { name: /Visual Simulator/, selected: true });
      expect(simulatorTab).toBeInTheDocument();
    });
  });
});
