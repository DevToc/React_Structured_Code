import React, { useRef, useCallback, memo } from 'react';
import { Box, Tooltip, Text, IconButton, SimpleGrid, useBoolean } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { usePrevious } from 'hooks/usePrevious';
import { useUpdateEffect } from 'hooks/useUpdateEffect';
import {
  ColorSwatchProps,
  SwatchButtonProps,
  SwatchListProps,
  CheckeredOverlayProps,
  Color,
} from './ColorPicker.types';
import { parseColorToRgba } from './ColorPicker.helpers';
import { NO_COLOR, MAX_SWATCH_COLORS } from './ColorPicker.constants';

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as LineIcon } from 'assets/icons/line.svg';

const CHECKERED_BACKGROUND =
  'repeating-conic-gradient(var(--vg-colors-gray-200) 0% 25%, white 0% 50%)  50% / 15px 15px';
const SWATCH_BUTTON_SIZE = 'var(--vg-sizes-9)';
const SWATCH_BUTTON_CLOSE_SIZE = 'var(--vg-sizes-4)';

const CloseIconStyled = styled(CloseIcon)`
  path {
    stroke: white;
  }
`;

const getSwatchId = (color: Color): string => `swatch-color-${color}`;

export const ColorSwatch = ({
  colorSwatch,
  onSetSwatchColor,
  onRemoveSwatchColor,
  onChange,
  color,
  showNoColorOption = true,
}: ColorSwatchProps) => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const noColorButtonRef = useRef<HTMLButtonElement>(null);
  const previousColorSwatchLength = usePrevious(colorSwatch.length);

  const isSwatchColor = colorSwatch.includes(color);
  const hasMaxSwatchColors = colorSwatch?.length >= MAX_SWATCH_COLORS;
  const isDisabled = isSwatchColor || hasMaxSwatchColors;

  const noColorLabel = 'No Color';
  const addColorLabel = 'Add Color';
  const swatchTitle = 'Project Colors';

  const onClickNoColor = () => onChange(NO_COLOR);

  const resetFocus = useCallback(
    (idx: number) => {
      if (idx < 0) return noColorButtonRef.current?.focus();

      const swatchColor = colorSwatch[idx];
      if (!swatchColor) return addButtonRef.current?.focus();

      const nextSwatchEl = document.getElementById(getSwatchId(swatchColor));
      if (nextSwatchEl) return nextSwatchEl.focus();
    },
    [colorSwatch],
  );

  // when new a new swatch color is added set focus to the new swatch color
  useUpdateEffect(() => {
    if (typeof previousColorSwatchLength !== 'number') return;

    if (colorSwatch.length > previousColorSwatchLength) {
      resetFocus(colorSwatch.length - 1);
    }
  }, [colorSwatch.length]);

  return (
    <>
      <Text fontWeight='medium' fontSize='sm'>
        {swatchTitle}
      </Text>
      <SimpleGrid
        data-testid='color-swatch-list'
        spacingX='var(--vg-space-2)'
        spacingY='var(--vg-space-3)'
        py='var(--vg-space-3)'
        columns={6}
      >
        {showNoColorOption && (
          <Tooltip hasArrow placement='bottom' label={noColorLabel}>
            <Box>
              <SwatchButton
                onClick={onClickNoColor}
                label={noColorLabel}
                swatchRef={noColorButtonRef}
                icon={<LineIcon stroke={'var(--vg-colors-gray-600)'} />}
                testId='color-swatch-no-color'
                color='white'
                border='1.5px solid var(--vg-colors-gray-600)'
              />
            </Box>
          </Tooltip>
        )}
        <SwatchList
          onRemoveSwatchColor={onRemoveSwatchColor}
          colorSwatch={colorSwatch}
          onChange={onChange}
          resetFocus={resetFocus}
        />
        <Tooltip hasArrow label={addColorLabel} placement='bottom'>
          <Box>
            <SwatchButton
              isDisabled={isDisabled}
              label={addColorLabel}
              onClick={onSetSwatchColor}
              swatchRef={addButtonRef}
              icon={
                <PlusIcon
                  height='24px'
                  width='24px'
                  fill={'var(--vg-colors-gray-600)'}
                  stroke={'var(--vg-colors-gray-600)'}
                />
              }
              color='white'
              testId='color-swatch-add-color'
              border='1.5px solid var(--vg-colors-gray-600)'
            />
          </Box>
        </Tooltip>
      </SimpleGrid>
    </>
  );
};

const SwatchButton = ({
  onClick,
  label,
  color,
  icon,
  onRemove,
  isDisabled,
  id,
  swatchRef,
  testId,
  border,
}: SwatchButtonProps) => {
  const [isHover, setIsHover] = useBoolean(false);
  const [isFocused, setIsFocused] = useBoolean(false);

  const removeButtonId = `color-swatch-remove-${color}`;
  const dataTestId = testId || `color-swatch-color-${color}`;
  const removeDataTestId = `color-swatch-button-delete-${color}`;
  const removeSwatchButtonLabel = `Remove Color ${color}`;

  const onBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.relatedTarget && e.relatedTarget.id === removeButtonId) return;
    setIsFocused.off();
  };

  const hasRemove = !!onRemove && (isFocused || isHover);
  const parsedColor = parseColorToRgba(color);
  const alpha = parsedColor?.a;

  return (
    <Box position='relative' onMouseOver={setIsHover.on} onMouseLeave={setIsHover.off}>
      <IconButton
        data-testid={dataTestId}
        ref={swatchRef}
        onClick={onClick}
        aria-label={label}
        bg={color}
        _active={{ backgroundColor: color }}
        onFocus={setIsFocused.on}
        onBlur={onBlur}
        isDisabled={isDisabled}
        icon={icon}
        w={SWATCH_BUTTON_SIZE}
        minW={SWATCH_BUTTON_SIZE}
        height={SWATCH_BUTTON_SIZE}
        minH={SWATCH_BUTTON_SIZE}
        position='relative'
        overflow='hidden'
        borderRadius='50%'
        border={border || '1.5px solid var(--vg-colors-gray-200)'}
        id={id}
        _hover={{
          outlineOffset: '0px',
          outline: '1.5px solid var(--vg-colors-divider-gray)',
          backgroundColor: color,
        }}
      >
        {alpha < 1 && <CheckeredOverlay color={color} parsedColor={parsedColor} />}
      </IconButton>
      {hasRemove && (
        <IconButton
          onBlur={onBlur}
          id={removeButtonId}
          onFocus={setIsFocused.on}
          onClick={onRemove}
          data-testid={removeDataTestId}
          aria-label={removeSwatchButtonLabel}
          w={SWATCH_BUTTON_CLOSE_SIZE}
          minW={SWATCH_BUTTON_CLOSE_SIZE}
          height={SWATCH_BUTTON_CLOSE_SIZE}
          minH={SWATCH_BUTTON_CLOSE_SIZE}
          icon={<CloseIconStyled />}
          position='absolute'
          right='-2px'
          top='-4px'
          zIndex={1}
          bg='black'
          borderRadius='50%'
          border='0.5px solid var(--vg-colors-divider-gray)'
          _hover={{ backgroundColor: 'black' }}
        />
      )}
    </Box>
  );
};

const CheckeredOverlay = ({ color, parsedColor }: CheckeredOverlayProps) => (
  <>
    <Box zIndex={1} w='50%' right='0' position='absolute' h='100%' bg={color} />
    <Box
      bg={`rgb(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b})`}
      position='absolute'
      w='50%'
      h='100%'
      left='0'
    />
    <Box sx={{ background: CHECKERED_BACKGROUND }} position='absolute' w='50%' h='100%' right='0' />
  </>
);

const SwatchList = memo(({ colorSwatch, onChange, resetFocus, onRemoveSwatchColor }: SwatchListProps) => (
  <>
    {colorSwatch.map((swatchColor: Color, idx: number) => {
      const id = getSwatchId(swatchColor);
      const label = `Color ${swatchColor}`;

      const onClick = () => onChange(swatchColor);
      const onRemove = () => {
        onRemoveSwatchColor(swatchColor);
        resetFocus(idx - 1);
      };

      return (
        <SwatchButton
          id={id}
          color={swatchColor}
          label={label}
          onClick={onClick}
          key={swatchColor}
          onRemove={onRemove}
        />
      );
    })}
  </>
));
