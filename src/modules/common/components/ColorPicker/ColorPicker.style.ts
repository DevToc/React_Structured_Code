import {
  COLOR_DISPLAY_WIDTH,
  COLOR_PICKER_WIDTH,
  COLOR_PICKER_HEIGHT,
  SATURATION_BORDER,
  SATURATION_BORDER_RADIUS,
  SLIDER_BORDER_RADIUS,
  SLIDER_HEIGHT,
} from './ColorPicker.constants';
import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

// Custom style for the react-colorful colorpicker components
// Requires absolute positioning for hue / alpha sliders
export const ColorPickerCustomStyle = styled(Box)`
  .chakra-popover__popper {
    z-index: var(--vg-zIndices-popOver);
  }

  .react-colorful {
    width: ${COLOR_PICKER_WIDTH}px;
    height: ${COLOR_PICKER_HEIGHT}px;
    margin-left: ${COLOR_DISPLAY_WIDTH}px;
  }

  .react-colorful__saturation {
    border-radius: 0px;
    border-top: ${SATURATION_BORDER};
    border-bottom: ${SATURATION_BORDER};
    border-right: ${SATURATION_BORDER};
    border-top-right-radius: ${SATURATION_BORDER_RADIUS};
    border-bottom-right-radius: ${SATURATION_BORDER_RADIUS};
  }

  .react-colorful__hue {
    top: 28px;
    left: -${COLOR_DISPLAY_WIDTH}px;
    height: ${SLIDER_HEIGHT};
    border-radius: ${SLIDER_BORDER_RADIUS};
  }

  .react-colorful__alpha {
    top: 60px;
    left: -${COLOR_DISPLAY_WIDTH}px;
    height: ${SLIDER_HEIGHT};
    border-radius: ${SLIDER_BORDER_RADIUS};
  }

  .react-colorful__pointer {
    width: var(--vg-sizes-5);
    height: var(--vg-sizes-5);

    border: 1.5px solid var(--vg-colors-gray-50);
    box-shadow: 0px 0px 2px var(--vg-colors-blackAlpha-600);
  }

  .react-colorful__pointer:hover {
    cursor: pointer;
  }

  .react-colorful__interactive:focus .react-colorful__pointer {
    box-shadow: var(--vg-shadows-outline);
  }

  input {
    border: 1px solid var(--vg-colors-outline-gray);
    border-radius: var(--vg-radii-base);
    width: 100%;
    height: var(--vg-sizes-6);
    font-size: var(--vg-fontSizes-xs);
    text-transform: uppercase;
    text-align: center;
  }
`;

export const ColorPickerMobileCustomStyle = styled(Box)`
  .react-colorful {
    width: 250px;
    height: 128px;
    margin-left: 64px;
  }

  .react-colorful__saturation {
    border-radius: 0px;
    border-top: ${SATURATION_BORDER};
    border-bottom: ${SATURATION_BORDER};
    border-right: ${SATURATION_BORDER};
    border-top-right-radius: ${SATURATION_BORDER_RADIUS};
    border-bottom-right-radius: ${SATURATION_BORDER_RADIUS};
  }

  .react-colorful__hue {
    top: 28px;
    left: -55px;
    height: ${SLIDER_HEIGHT};
    border-radius: ${SLIDER_BORDER_RADIUS};
  }

  .react-colorful__alpha {
    top: 60px;
    left: -55px;
    height: ${SLIDER_HEIGHT};
    border-radius: ${SLIDER_BORDER_RADIUS};
  }

  .react-colorful__pointer {
    width: var(--vg-sizes-5);
    height: var(--vg-sizes-5);

    border: 1.5px solid var(--vg-colors-gray-50);
    box-shadow: 0px 0px 2px var(--vg-colors-blackAlpha-600);
  }

  .react-colorful__pointer:hover {
    cursor: pointer;
  }

  .react-colorful__interactive:focus .react-colorful__pointer {
    box-shadow: var(--vg-shadows-outline);
  }

  input {
    border: 1px solid var(--vg-colors-outline-gray);
    border-radius: var(--vg-radii-base);
    width: 100%;
    height: var(--vg-sizes-6);
    font-size: var(--vg-fontSizes-xs);
    text-transform: uppercase;
    text-align: center;
  }
`;
