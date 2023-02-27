import { ComponentProps, useRef, useState, useEffect, KeyboardEvent } from 'react';
import { Text, NumberInput, Box, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { Code } from 'constants/keyboard';
import { NumberInputField } from './NumberInputField';

/**
 * SLIDER + NUMBER INPUT COMPONENT
 *
 * Renders a row containing a title, slider, and
 * number input.
 */
interface SliderNumberInputProps {
  title: string;
  value: number;
  onChange: (value: number) => void;

  minValue?: number;
  maxValue?: number;
  suffix?: string;
  fontSize?: string;
  sliderWidth?: string | number;

  // Custom styling for title and number input elements
  titleProps?: ComponentProps<typeof Text>;
  numberInputProps?: ComponentProps<typeof NumberInput>;
  containerProps?: ComponentProps<typeof Box>;
}

export const SliderNumberInput = ({
  fontSize = 'xs',
  title,
  value,
  onChange,
  sliderWidth = '55%',
  suffix = '',
  minValue = 0,
  maxValue = 100,
  titleProps,
  numberInputProps,
  containerProps,
}: SliderNumberInputProps) => {
  const [numberInputValue, setNumberInputValue] = useState(value);
  const numberInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNumberInputValue(value);
  }, [value]);

  const onNumberInputBlur = () => {
    let normalized = numberInputValue;
    if (numberInputValue > maxValue) {
      normalized = maxValue;
    } else if (numberInputValue < minValue) {
      normalized = minValue;
    }

    setNumberInputValue(normalized);
    onChange(normalized);
  };

  const onNumberInputChange = (_: string, valueAsNumber: number) => {
    setNumberInputValue(valueAsNumber || 0);
  };

  const formatNumberInput = (value: string | number) => `${value}${suffix}`;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = (e.key || e.code) as Code;

    if (key === Code.Enter) {
      onNumberInputBlur();
    }
  };
  return (
    <Box w='100%' {...containerProps}>
      <Flex mb={1} alignItems={'center'} gap={3} justifyContent={'space-between'} color={'font.500'}>
        <Text fontSize={fontSize} fontWeight={500} {...titleProps}>
          {title}
        </Text>
        <Flex gap={2} justifyContent={'flex-end'} alignItems={'center'}>
          <Slider
            w={sliderWidth}
            aria-label={title}
            onChange={onChange}
            value={value}
            min={minValue}
            max={maxValue}
            focusThumbOnChange={false}
            marginRight='10px'
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb
              style={{
                border: '1px solid var(--vg-colors-gray-200)',
              }}
            />
          </Slider>
          <NumberInput
            size={'xs'}
            max={maxValue}
            min={minValue}
            w={10}
            onChange={onNumberInputChange}
            onBlur={onNumberInputBlur}
            value={numberInputValue}
            format={formatNumberInput}
            textAlign={'center'}
            {...numberInputProps}
          >
            <NumberInputField
              ref={numberInputRef}
              onKeyDown={onKeyDown}
              p={1}
              m={0}
              border={'1px solid'}
              borderColor={'outline.gray'}
              borderRadius={4}
              data-testid={'slider-number-input'}
            />
          </NumberInput>
        </Flex>
      </Flex>
    </Box>
  );
};
