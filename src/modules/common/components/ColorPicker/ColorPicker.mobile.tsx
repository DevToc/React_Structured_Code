import { ReactElement, useMemo, useRef, useCallback, useEffect } from 'react';
import { RgbaStringColorPicker, HexColorInput } from 'react-colorful';
import { Box, FormLabel } from '@chakra-ui/react';
import { ColorSwatch } from './ColorSwatch';
import { EyeDropper } from './EyeDropper';
import { ColorPickerProps } from './ColorPicker.types';
import { NO_COLOR } from './ColorPicker.constants';
import { ColorDisplay } from './ColorDisplay/ColorDisplay';
import { ColorPickerMobileCustomStyle } from './ColorPicker.style';
import { toRgbString, removeAlpha, toHex } from './ColorPicker.helpers';

const hueLabel = 'Hue';
const opacityLabel = 'Opacity';
const hexLabel = 'Hex';
const hexInputId = 'colorpicker-hex-input';
const hexInputTestId = 'colorpicker-hex-color-input';
const panelTestId = 'colorpicker-panel';

export const ColorPickerMobile = ({
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
}: ColorPickerProps): ReactElement => {
  const colorRef = useRef(color);

  const rgbaString = useMemo(() => (color.startsWith('rgba') ? color : toRgbString(color)), [color]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  const setSwatchColor = () => onSetSwatchColor(color);

  const onChangeColor = useCallback(
    (newColor: string) => {
      // if the selected color is "no-color" remove the alpha transparency for the new color
      if (colorRef.current === NO_COLOR) return onChange(removeAlpha(newColor));
      return onChange(newColor);
    },
    [onChange],
  );

  return (
    <ColorPickerMobileCustomStyle>
      <Box>
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
              <RgbaStringColorPicker color={rgbaString} onChange={onChangeColor} />
              <ColorDisplay color={color} />
              <FormLabel aria-hidden='true' position='absolute' top='6.31rem' fontWeight='medium' fontSize='xs'>
                {hueLabel}
              </FormLabel>
              <EyeDropper onChange={onChangeColor} />
              <FormLabel aria-hidden='true' position='absolute' top='9.31rem' fontWeight='medium' fontSize='xs'>
                {opacityLabel}
              </FormLabel>
              <Box textAlign='center' mt='4.625rem' w='6rem'>
                <HexColorInput
                  data-testid={hexInputTestId}
                  prefixed
                  id={hexInputId}
                  color={toHex(color)}
                  onChange={onChange}
                />
                <FormLabel mt={1} htmlFor={hexInputId} textAlign='center' fontWeight='medium' fontSize='xs'>
                  {hexLabel}
                </FormLabel>
              </Box>
            </Box>
          </Box>
          <Box>{children}</Box>
        </Box>
      </Box>
    </ColorPickerMobileCustomStyle>
  );
};