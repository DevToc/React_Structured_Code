import { useEffect, useState, KeyboardEvent, useRef } from 'react';
import { NumberInput, Text, Tooltip } from '@chakra-ui/react';

import { NumberInputField } from 'modules/common/components/Input/NumberInputField';

import { Code } from 'constants/keyboard';
import { normalizeNumber } from 'utils/number';

interface ToolbarNumberInputProps {
  value: number;
  label: string;
  precision?: number;
  suffix?: string;
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
}

const computeNormalizedNumberFromString = (min: number, max: number, value: string, precision: number) => {
  let normalized = normalizeNumber(min, max, parseFloat(value)).toFixed(precision);
  return Number.isNaN(parseFloat(normalized)) ? 0 : parseFloat(normalized);
};

/**
 * TOOLBAR NUMBER INPUT
 *
 * Renders a number input field to be used in the toolbar.
 * Triggers onChange() prop when input field is blurred, enter is pressed and when the component is unmounted.
 */
export const ToolbarNumberInput = ({
  value,
  label,
  precision = 2,
  suffix = '',
  max = 100,
  min = 0,
  onChange = () => {},
}: ToolbarNumberInputProps) => {
  const [numberInputValue, setNumberInputValue] = useState<string>(`${value}`);
  const numberInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setNumberInputValue(`${value}`), [value]);

  // Trigger onChange on unmount
  useEffect(() => {
    const numberInputEl = numberInputRef.current;

    return () => {
      if (!numberInputEl) return;

      const inputElValue = numberInputEl.value;
      const parsedNumber = computeNormalizedNumberFromString(min, max, inputElValue, precision);

      if (parsedNumber === value) return;

      onChange?.(parsedNumber);
    };
  }, [max, min, onChange, precision, value]);

  const onNumberInputBlur = () => {
    const parsedNumber = computeNormalizedNumberFromString(min, max, numberInputValue, precision);
    onChange?.(parsedNumber);
  };

  const onNumberInputChange = (valueAsString: string, valueAsNumber: number) => setNumberInputValue(valueAsString);
  const focusInput = () => numberInputRef.current?.focus();

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = (e.key || e.code) as Code;

    if (key === Code.Enter) onNumberInputBlur();
  };

  return (
    <Tooltip hasArrow placement={'bottom'} label={label} bg='black'>
      <NumberInput
        size={'xs'}
        max={max}
        min={min}
        w={12}
        onChange={onNumberInputChange}
        onBlur={onNumberInputBlur}
        value={numberInputValue}
        precision={precision}
        display={'flex'}
        alignItems={'center'}
        color='font.500'
      >
        <NumberInputField
          onKeyDown={onKeyDown}
          textAlign={'right'}
          p={1}
          pr={'1rem'}
          m={0}
          border={'1px solid'}
          borderColor={'outline.gray.500'}
          borderRadius={4}
          data-testid={'toolbar-number-input'}
          ref={numberInputRef}
        />
        <Text as='span' onClick={focusInput} fontSize='xs' position={'absolute'} left={'2rem'} color='font.500'>
          {suffix}
        </Text>
      </NumberInput>
    </Tooltip>
  );
};
