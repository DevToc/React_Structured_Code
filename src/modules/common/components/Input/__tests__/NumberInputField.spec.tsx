import { screen, fireEvent, render } from '@testing-library/react';
import { NumberInput } from '@chakra-ui/react';
import { NumberInputField } from '../NumberInputField';

describe('components/Input/NumberInputField', () => {
  it('should highlight all text and trigger click event handlers', async () => {
    const onClick = jest.fn();
    const valueText = '100';

    render(
      <NumberInput min={0} max={999}>
        <NumberInputField onClick={onClick} placeholder='placeholder' />
      </NumberInput>,
    );

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
    const valueText = '100';

    render(
      <NumberInput min={0} max={999}>
        <NumberInputField onFocus={onFocus} placeholder='placeholder' />
      </NumberInput>,
    );

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
