import { screen, fireEvent, render } from '@testing-library/react';
import { Input } from '../Input';

describe('components/Input/Input', () => {
  it('should highlight all text and trigger click event handlers', async () => {
    const onClick = jest.fn();
    const onFocus = jest.fn();

    const valueText = 'random text';

    render(<Input onClick={onClick} onFocus={onFocus} placeholder='placeholder' />);

    const inputEl = (await screen.findByPlaceholderText('placeholder')) as HTMLInputElement;

    expect(inputEl).toBeInTheDocument();

    fireEvent.change(inputEl, { target: { value: valueText } });
    fireEvent.click(inputEl);

    // Check all text is selected
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(valueText.length);

    expect(onClick).toBeCalledTimes(1);
  });
  it('should highlight all text and trigger focus event handlers', async () => {
    const onFocus = jest.fn();

    const valueText = 'random text';

    render(<Input onFocus={onFocus} placeholder='placeholder' />);

    const inputEl = (await screen.findByPlaceholderText('placeholder')) as HTMLInputElement;

    expect(inputEl).toBeInTheDocument();

    fireEvent.change(inputEl, { target: { value: valueText } });
    fireEvent.focus(inputEl);

    // Check all text is selected
    expect(inputEl.selectionStart).toBe(0);
    expect(inputEl.selectionEnd).toBe(valueText.length);

    expect(onFocus).toBeCalledTimes(1);
  });
});
