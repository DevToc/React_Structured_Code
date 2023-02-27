import { screen, fireEvent, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppProviders } from 'utils/test-utils.test';
import { ColorPicker } from '../ColorPicker';

// Fix to pass `pageX` and `pageY`
// See https://github.com/testing-library/react-testing-library/issues/268
class FakeMouseEvent extends MouseEvent {
  constructor(type: string, values = { pageX: 0, pageY: 0 }) {
    super(type, { buttons: 1, bubbles: true, ...values });

    Object.assign(this, {
      pageX: values.pageX || 0,
      pageY: values.pageY || 0,
    });
  }
}

const DEFAULT_PROPS = {
  onChange() {},
  onSetSwatchColor() {},
  onRemoveSwatchColor() {},
  colorSwatch: [],
};

describe('components/ColorPicker', () => {
  it('should render ColorPicker button and panel', () => {
    renderWithAppProviders(<ColorPicker color='#ddd' label='ColorPickerLabel' {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('colorpicker-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    expect(screen.getByTestId('colorpicker-panel')).toBeInTheDocument();
  });
  it('should render TextColorPicker button and panel', () => {
    renderWithAppProviders(<ColorPicker iconStyle='text' color='red' label='ColorPickerLabel' {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('colorpicker-button')).toBeInTheDocument();
    expect(screen.getByTestId('colorpicker-button')).toContainHTML('<svg fill="#ff0000">text_color_picker.svg</svg>');
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    expect(screen.getByTestId('colorpicker-panel')).toBeInTheDocument();
  });
  it('should return the color code by clicking on the panel', () => {
    const handleChange = jest.fn((hsla) => hsla);
    const { container } = renderWithAppProviders(
      <ColorPicker color='#dddddd' label='ColorPickerLabel' {...DEFAULT_PROPS} onChange={handleChange} />,
    );
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    const saturation = container.querySelector('.react-colorful__saturation .react-colorful__interactive');
    expect(screen.getByTestId('colorpicker-panel')).toBeInTheDocument();
    expect(saturation).toBeInTheDocument();
    fireEvent(saturation as HTMLElement, new FakeMouseEvent('mousedown', { pageX: 10, pageY: 10 }));
    expect(handleChange).toHaveReturned();
    expect(handleChange).toHaveBeenCalledTimes(1);
    // FIXME: [JB] Calling the mousedown event with pageX/y does not returns an appropriate value.
    expect(handleChange.mock.results[0].value).toBe('#000000');
  });
  it('should have a aria-label and aria-expanded', () => {
    renderWithAppProviders(<ColorPicker color='#ddd' label='ColorPickerLabel' {...DEFAULT_PROPS} />);
    expect(screen.getByLabelText('ColorPickerLabel')).toBeInTheDocument();
  });
  it('should add/set/delete swatch colors', () => {
    const mockColorSwatch = ['red', 'green', 'blue'];
    const onChange = jest.fn((color) => color);
    const onSetSwatchColor = jest.fn((color) => color);
    const onRemoveSwatchColor = jest.fn((color) => color);
    renderWithAppProviders(
      <ColorPicker
        color='#D4AAAD'
        label='ColorPickerLabel'
        onSetSwatchColor={onSetSwatchColor}
        onRemoveSwatchColor={onRemoveSwatchColor}
        colorSwatch={mockColorSwatch}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    // add swatch color
    const addSwatchColorButton = screen.getByTestId('color-swatch-add-color');
    fireEvent.click(addSwatchColorButton);
    expect(onSetSwatchColor).toHaveBeenCalledTimes(1);
    // set color from clicking swatch
    const swatchButtons = screen.getAllByTestId(/color-swatch-color/);
    fireEvent.click(swatchButtons[0]);
    expect(onChange).toHaveBeenCalledTimes(1);
    // delete swatch color
    act(() => swatchButtons[0].focus());
    const deleteSwatchColorButton = screen.getByTestId(/color-swatch-button-delete/);
    fireEvent.click(deleteSwatchColorButton);
    expect(onRemoveSwatchColor).toHaveBeenCalledTimes(1);
  });
  it('swatch list should be keyboard accessible', () => {
    const mockColorSwatch = ['red'];
    const onChange = jest.fn((color) => color);
    const onSetSwatchColor = jest.fn((color) => color);
    const onRemoveSwatchColor = jest.fn((color) => color);

    renderWithAppProviders(
      <ColorPicker
        color='#D4AAAD'
        label='ColorPickerLabel'
        onSetSwatchColor={onSetSwatchColor}
        onRemoveSwatchColor={onRemoveSwatchColor}
        colorSwatch={mockColorSwatch}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByTestId('colorpicker-button'));
    const swatchButtons = screen.getAllByTestId(/color-swatch-color/);

    act(() => swatchButtons[0].focus());
    expect(swatchButtons[0]).toHaveFocus();

    userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);

    userEvent.tab();
    const deleteSwatchColorButton = screen.getByTestId(/color-swatch-button-delete/);
    expect(deleteSwatchColorButton).toHaveFocus();

    userEvent.keyboard('{Enter}');
    expect(onRemoveSwatchColor).toHaveBeenCalledTimes(1);
  });
  it('should set color from hex input only hitting enter', () => {
    const onChange = jest.fn((color) => color);
    renderWithAppProviders(
      <ColorPicker color='#D4AAAD' label='ColorPickerLabel' {...DEFAULT_PROPS} onChange={onChange} />,
    );
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    const hexColorInput = screen.getByTestId('colorpicker-hex-color-input');
    expect(hexColorInput).toBeInTheDocument();
    fireEvent.change(hexColorInput, { target: { value: '#8c8c8c' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(hexColorInput, { key: 'Enter' });
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  it('should not show "No Color" option if props is set to false', () => {
    renderWithAppProviders(
      <ColorPicker color='#ddd' label='ColorPickerLabel' showNoColorOption={false} {...DEFAULT_PROPS} />,
    );
    expect(screen.getByTestId('colorpicker-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    expect(screen.queryByTestId('color-swatch-no-color')).not.toBeInTheDocument();
  });
  it('should show "No Color" option if props is set to true', () => {
    renderWithAppProviders(
      <ColorPicker color='#ddd' label='ColorPickerLabel' showNoColorOption={true} {...DEFAULT_PROPS} />,
    );
    expect(screen.getByTestId('colorpicker-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('colorpicker-button'));
    expect(screen.getByTestId('color-swatch-no-color')).toBeInTheDocument();
  });
  describe('ColorPicker custom trigger', () => {
    it('should render ColorPicker with a custom trigger', () => {
      renderWithAppProviders(
        <ColorPicker
          color='#ddd'
          {...DEFAULT_PROPS}
          customTrigger={(props) => <span {...props}> Color Picker Label </span>}
        />,
      );
      const colorPickerButton = screen.getByTestId('colorpicker-button');
      expect(within(colorPickerButton).getByText(/Color Picker Label/, { selector: 'span' })).toBeInTheDocument();
    });
  });
});
