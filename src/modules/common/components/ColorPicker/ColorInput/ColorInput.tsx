import { Box, FormLabel } from '@chakra-ui/react';
import { KeyboardEvent, memo, useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import { HexColorInput } from 'react-colorful';
import { toHex } from '../ColorPicker.helpers';
import { ColorInputProps } from './ColorInput.types';

const hexInputTestId = 'colorpicker-hex-color-input';
const hexInputId = 'colorpicker-hex-input';
const hexLabel = 'Hex';

const ColorInput = memo(({ color, onChange, isPopoverOpen }: ColorInputProps) => {
  const [inputColor, setInputColor] = useState(color);
  // We should use isSyncinfRef for now to avoid bad useCallback issues with wrapper components.
  // TODO: Refactor the component who use the color picker to use useCallback properly: https://github.com/Venngage/editor2/pull/584#discussion_r1039658473
  const isSyncingRef = useRef(false);
  const inputColorRef = useRef(inputColor);

  const onChangeColor = useCallback(
    (newColor: string) => {
      if (color === inputColorRef.current || isSyncingRef.current) return;

      isSyncingRef.current = true;
      const newColorHex = toHex(newColor);
      onChange(newColorHex);
      setInputColor(newColor);
    },
    [onChange, color],
  );

  const onChangeInputValue = (newColor: string) => setInputColor(newColor);

  const onBlurInput = () => onChangeColor(inputColor);

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onChangeColor(inputColor);
  };

  useEffect(() => {
    if (isSyncingRef.current) isSyncingRef.current = false;

    const isPropColorDifferent = color !== inputColorRef.current;
    const isPropColorIncomplete = toHex(color) !== color;
    const shouldSyncColor = isPropColorDifferent || isPropColorIncomplete;
    const isColorDefined = color && isPopoverOpen;
    if (isColorDefined && shouldSyncColor) setInputColor(toHex(color));
  }, [color, isPopoverOpen]);

  useEffect(() => {
    return () => {
      const isMounted = color && inputColorRef.current;
      const isColorDiff = color !== inputColorRef.current;
      const colorIncomplete = inputColorRef.current.length < 7;
      const needToUpdate = isMounted && isColorDiff && colorIncomplete;

      if (needToUpdate) onChangeColor(inputColorRef.current);
    };
  }, [color, onChangeColor]);

  // Highlight all text when click on hex colour input
  const onClick = useCallback((e: MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  }, []);

  if (inputColorRef.current !== inputColor) inputColorRef.current = inputColor;

  return (
    <Box textAlign='center' mt='4.625rem' w='6rem'>
      <HexColorInput
        data-testid={hexInputTestId}
        prefixed
        color={inputColor}
        id={hexInputId}
        onChange={onChangeInputValue}
        onKeyDown={onInputKeyDown}
        onBlur={onBlurInput}
        onClick={onClick}
      />
      <FormLabel mt={1} htmlFor={hexInputId} textAlign='center' fontWeight='medium' fontSize='xs'>
        {hexLabel}
      </FormLabel>
    </Box>
  );
});

export default ColorInput;
