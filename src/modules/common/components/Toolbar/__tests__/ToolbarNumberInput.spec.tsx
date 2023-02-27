import { screen, fireEvent, render } from '@testing-library/react';
import { ToolbarNumberInput } from '../ToolbarNumberInput';

describe('ToolbarNumberInput', () => {
  it('should trigger onChange on blur', () => {
    const onChange = jest.fn();
    render(<ToolbarNumberInput value={1} onChange={onChange} />);

    const input = screen.getByTestId('toolbar-number-input');

    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.change(input, { target: { value: '19' } });
    fireEvent.change(input, { target: { value: '88' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(88);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should trigger onChange when enter is pressed', () => {
    const onChange = jest.fn();
    render(<ToolbarNumberInput value={1} onChange={onChange} />);

    const input = screen.getByTestId('toolbar-number-input');
    fireEvent.change(input, { target: { value: '88' } });
    fireEvent.keyDown(input as HTMLElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onChange).toHaveBeenCalledWith(88);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should round to precision', () => {
    const onChange = jest.fn();
    render(<ToolbarNumberInput value={1} onChange={onChange} precision={2} />);

    const input = screen.getByTestId('toolbar-number-input');
    fireEvent.change(input, { target: { value: '1.234' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(1.23);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should clamp to min and max', () => {
    const onChange = jest.fn();
    const max = 10;
    const min = 2;

    render(<ToolbarNumberInput value={1} onChange={onChange} min={min} max={max} />);

    const input = screen.getByTestId('toolbar-number-input');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(min);
    expect(onChange).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '999.999' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(max);
  });

  it('should trigger onChange when component is unmounted', () => {
    const onChange = jest.fn();
    const { unmount, rerender } = render(<ToolbarNumberInput value={1} onChange={onChange} />);
    const input = screen.getByTestId('toolbar-number-input');
    fireEvent.change(input, { target: { value: '88' } });

    // shouldn't call onChange if the component is not unmounted
    rerender(<ToolbarNumberInput value={33} onChange={onChange} />);

    unmount();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should update value when changed from outside', () => {
    const onChange = jest.fn();
    const { rerender } = render(<ToolbarNumberInput value={1} onChange={onChange} />);
    rerender(<ToolbarNumberInput value={2} onChange={onChange} />);

    const input = screen.getByTestId('toolbar-number-input');
    expect(input).toHaveValue('2');
  });
});
