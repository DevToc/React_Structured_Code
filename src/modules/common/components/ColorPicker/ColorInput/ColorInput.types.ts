import { Color, OnChange } from '../ColorPicker.types';

export interface ColorInputProps {
  color: Color;
  onChange: OnChange;
  isPopoverOpen: boolean;
}
