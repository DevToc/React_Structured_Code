import { useCallback } from 'react';
import { Box, Divider } from '@chakra-ui/react';
import { ColorPickerMobile as BaseColorPicker } from 'modules/common/components/ColorPicker';
import { ColorPickerProps as BaseColorPickerProps } from 'modules/common/components/ColorPicker/ColorPicker.types';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { selectColorSwatch } from 'modules/Editor/store/infographSelector';
import { setSwatchColor, removeSwatchColor } from 'modules/Editor/store/infographSlice';
import { SingleColorContrastChecker } from './SingleColorContrastChecker';

type EditorColorPickerProps = Omit<BaseColorPickerProps, 'colorSwatch' | 'onSetSwatchColor' | 'onRemoveSwatchColor'>;

// Extend the ColorPicker with editor specific swatch state
export const ColorPickerInContext = ({
  color,
  label,
  iconStyle,
  onChange,
  showNoColorOption,
  showNoColorChecker,
  placement,
  colorChecker,
  customTrigger,
  hasArrow,
}: EditorColorPickerProps) => {
  const colorSwatch = useAppSelector(selectColorSwatch);
  const dispatch = useAppDispatch();

  const onSetSwatchColor = useCallback((swatchColor: string) => dispatch(setSwatchColor({ swatchColor })), [dispatch]);
  const onRemoveSwatchColor = useCallback(
    (swatchColor: string) => dispatch(removeSwatchColor({ swatchColor })),
    [dispatch],
  );

  return (
    <BaseColorPicker
      color={color}
      iconStyle={iconStyle}
      onChange={onChange}
      label={label}
      colorSwatch={colorSwatch}
      showNoColorOption={showNoColorOption}
      onSetSwatchColor={onSetSwatchColor}
      onRemoveSwatchColor={onRemoveSwatchColor}
      placement={placement}
      customTrigger={customTrigger}
      hasArrow={hasArrow}
    >
      {!showNoColorChecker && (
        <>
          <Divider />
          <Box m={4}>{colorChecker || <SingleColorContrastChecker color={color} />}</Box>
        </>
      )}
    </BaseColorPicker>
  );
};
