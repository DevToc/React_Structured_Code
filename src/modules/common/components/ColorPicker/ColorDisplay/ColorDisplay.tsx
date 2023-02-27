import { Box } from '@chakra-ui/react';
import {
  COLOR_DISPLAY_WIDTH,
  SATURATION_HEIGHT,
  SATURATION_BORDER,
  SATURATION_BORDER_RADIUS,
} from './ColorDisplay.constants';
import { Color } from '../ColorPicker.types';

interface ColorDisplayProps {
  color: Color;
}

export const ColorDisplay = ({ color }: ColorDisplayProps) => (
  <Box
    position='absolute'
    top='0'
    borderTop={SATURATION_BORDER}
    borderBottom={SATURATION_BORDER}
    borderLeft={SATURATION_BORDER}
    borderTopLeftRadius={SATURATION_BORDER_RADIUS}
    borderBottomLeftRadius={SATURATION_BORDER_RADIUS}
    backgroundColor={color}
    w={`${COLOR_DISPLAY_WIDTH}px`}
    h={`${SATURATION_HEIGHT}px`}
  />
);
