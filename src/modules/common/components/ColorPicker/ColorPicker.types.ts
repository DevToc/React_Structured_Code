import React, { ReactElement, ReactNode } from 'react';
import { PlacementWithLogical } from '@chakra-ui/react';

type Color = string;
type ColorSwatch = Color[];
export type OnChange = (color: Color) => void;
type OnSetSwatchColor = (color: Color) => void;
type OnRemoveSwatchColor = (color: Color) => void;
type IconStyle = 'fill' | 'border' | 'text';

interface DefaultTriggerProps {
  onClick: () => void;
  'aria-label': string | undefined;
  'data-testid': string;
  onFocus: () => void;
  onBlur: () => void;
}

interface ColorPickerProps {
  children?: ReactNode;
  color: Color;
  // The tooltip label - for a colorpicker without tooltip don't pass this prop
  label?: string;
  onChange: OnChange;
  showNoColorOption?: boolean;
  showNoColorChecker?: boolean;
  iconStyle?: IconStyle;
  placement?: PlacementWithLogical;
  colorSwatch: ColorSwatch;
  onSetSwatchColor: OnSetSwatchColor;
  onRemoveSwatchColor: OnRemoveSwatchColor;
  colorChecker?: ReactElement;
  customTrigger?: (props: DefaultTriggerProps) => ReactElement | string;
  hasArrow?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

type ColorSwatchProps = {
  showNoColorOption?: boolean;
  color: Color;
  onChange: OnChange;
  colorSwatch: ColorSwatch;
  onSetSwatchColor: () => void;
  onRemoveSwatchColor: OnRemoveSwatchColor;
};

interface SwatchListProps {
  colorSwatch: ColorSwatch;
  onChange: OnChange;
  resetFocus: (idx: number) => void;
  onRemoveSwatchColor: OnRemoveSwatchColor;
}

interface SwatchButtonProps {
  onClick: () => void;
  label: string;
  color: Color;
  testId?: string;
  swatchRef?: React.RefObject<HTMLButtonElement> | null;
  icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  onRemove?: () => void;
  isDisabled?: boolean;
  id?: string;
  border?: string;
}

interface RGBAParsed {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface CheckeredOverlayProps {
  color: Color;
  parsedColor: RGBAParsed;
}

interface SingleColorContrastCheckerProps {
  /**
   * Current selected text color to validate
   */
  color: Color;

  /**
   * Current selected target area
   */
  targetRect?: DOMRect;

  /**
   * Selected text style within target area
   */
  textStyle?: {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
  };
}

export type {
  RGBAParsed,
  Color,
  ColorPickerProps,
  ColorSwatchProps,
  SwatchButtonProps,
  SwatchListProps,
  CheckeredOverlayProps,
  SingleColorContrastCheckerProps,
  IconStyle,
  DefaultTriggerProps,
};
