import { ReactElement, useMemo, useRef, useCallback, useEffect } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import {
  Popover,
  PopoverHeader,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  VisuallyHidden,
  Box,
  Tooltip,
  FormLabel,
  Flex,
  useBoolean,
} from '@chakra-ui/react';

import { ColorSwatch } from './ColorSwatch';
import { EyeDropper } from './EyeDropper';
import { ColorPickerProps, DefaultTriggerProps } from './ColorPicker.types';
import { TRIGGER_BUTTON_SIZE, HEX_NO_COLOR, NO_COLOR } from './ColorPicker.constants';
import { ColorPickerCustomStyle } from './ColorPicker.style';
import { toHex, removeHexAlpha } from './ColorPicker.helpers';
import DefaultTrigger from './DefaultTrigger';
import ColorInput from './ColorInput/ColorInput';
import { ColorDisplay } from './ColorDisplay/ColorDisplay';

const hueLabel = 'Hue';
const opacityLabel = 'Opacity';
const colorPickerTriggerTestId = 'colorpicker-button';
const panelTestId = 'colorpicker-panel';
const NO_COLOR_OPTIONS = [HEX_NO_COLOR, NO_COLOR];

export const ColorPicker = ({
  children,
  color,
  onChange,
  label,
  showNoColorOption = true,
  iconStyle = 'fill',
  placement = 'bottom-start',
  colorSwatch = [],
  onSetSwatchColor,
  onRemoveSwatchColor,
  customTrigger,
  hasArrow = false,
  onOpen,
  onClose,
}: ColorPickerProps): ReactElement => {
  const initialFocusRef = useRef(null);
  const colorRef = useRef(color);

  const [isTooltipOpen, setIsTooltipOpen] = useBoolean(false);
  const [isPopoverOpen, setIsPopoverOpen] = useBoolean(false);

  const hexString = toHex(color) !== color ? toHex(color) : color;

  // A flag ref to avoid first hook call
  const isMounted = useRef(false);

  // A hook calling the optional onClose and onOpen event to notify the state change
  useEffect(() => {
    if (isMounted.current) isPopoverOpen ? onOpen?.() : onClose?.();
    isMounted.current = true;
  }, [isPopoverOpen, onOpen, onClose]);

  const defaultTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: setIsPopoverOpen.toggle,
      'aria-label': label,
      'data-testid': colorPickerTriggerTestId,
      onFocus: setIsTooltipOpen.on,
      onBlur: setIsTooltipOpen.off,
    }),
    [label, setIsPopoverOpen.toggle, setIsTooltipOpen.off, setIsTooltipOpen.on],
  );

  const setSwatchColor = () => onSetSwatchColor(color);

  const onChangeColor = useCallback(
    (newColor: string) => {
      // if the selected color is "no-color" remove the alpha transparency for the new color
      if (NO_COLOR_OPTIONS.includes(colorRef.current)) return onChange(removeHexAlpha(newColor));
      return onChange(toHex(newColor));
    },
    [onChange],
  );

  if (colorRef.current !== color) colorRef.current = color;

  return (
    <ColorPickerCustomStyle>
      <Tooltip hasArrow isOpen={isTooltipOpen && !isPopoverOpen} placement='bottom' label={label}>
        <Box maxH={TRIGGER_BUTTON_SIZE} onMouseEnter={setIsTooltipOpen.on} onMouseLeave={setIsTooltipOpen.off}>
          <Popover
            initialFocusRef={initialFocusRef}
            isOpen={isPopoverOpen}
            placement={placement}
            onClose={setIsPopoverOpen.off}
            closeOnBlur
            closeOnEsc
            isLazy
          >
            <PopoverTrigger>
              <Flex>
                {customTrigger ? (
                  customTrigger(defaultTriggerProps)
                ) : (
                  <DefaultTrigger iconStyle={iconStyle} color={hexString} {...defaultTriggerProps} />
                )}
              </Flex>
            </PopoverTrigger>
            <PopoverContent w='fit-content' boxShadow='md' padding={0}>
              {hasArrow && <PopoverArrow />}
              <VisuallyHidden>
                <PopoverHeader>{label}</PopoverHeader>
              </VisuallyHidden>
              <Box w='fit-content' data-testid={panelTestId}>
                <Box m={4}>
                  <ColorSwatch
                    onSetSwatchColor={setSwatchColor}
                    onRemoveSwatchColor={onRemoveSwatchColor}
                    colorSwatch={colorSwatch}
                    onChange={onChangeColor}
                    color={color}
                    showNoColorOption={showNoColorOption}
                  />
                  <Box h='15.75rem' position='relative'>
                    <HexAlphaColorPicker color={hexString} onChange={onChangeColor} />
                    <ColorDisplay color={color} />
                    <FormLabel aria-hidden='true' position='absolute' top='101px' fontWeight='medium' fontSize='xs'>
                      {hueLabel}
                    </FormLabel>
                    <EyeDropper onChange={onChangeColor} />
                    <FormLabel aria-hidden='true' position='absolute' top='149px' fontWeight='medium' fontSize='xs'>
                      {opacityLabel}
                    </FormLabel>
                    <ColorInput color={color} onChange={onChange} isPopoverOpen={isPopoverOpen} />
                  </Box>
                </Box>
                <Box>{children}</Box>
              </Box>
            </PopoverContent>
          </Popover>
        </Box>
      </Tooltip>
    </ColorPickerCustomStyle>
  );
};