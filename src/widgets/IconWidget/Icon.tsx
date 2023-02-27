import SVG from 'react-inlinesvg';
import { Box } from '@chakra-ui/react';
import { IconApiResponse } from 'hooks/useIcon';
import { preProcessSvg, generateClipPath, getIconStyle } from './IconWidget.helpers';
import { FillDirection } from './IconWidget.types';

interface IconProps {
  iconConfig: {
    shapeColorOne: string;
    shapeColorTwo?: string;
    shapeFill: number;
    fillDirection: FillDirection;
    isMirrored?: boolean;
  };
  iconData: IconApiResponse;
}

export const Icon = ({ iconConfig, iconData }: IconProps) => {
  const { shapeColorOne, isMirrored = false, shapeColorTwo, shapeFill, fillDirection } = iconConfig;
  const { svg, viewBox, description, color } = iconData;

  const iconStyle = getIconStyle(isMirrored);
  const hasSecondaryColorFill = !!(typeof shapeFill === 'number' && shapeFill <= 100 && shapeFill > 0 && shapeColorTwo);
  const formattedSvg: string = preProcessSvg(svg, color);

  // could be added to iconData response?
  const title = 'icon';
  // seems to be "missing" for most icons
  const iconDescription = description || 'icon description';

  return (
    <Box w='100%' h='100%' position='absolute'>
      <SVG
        title={title}
        description={iconDescription}
        role='img'
        src={formattedSvg}
        fill={color ? '' : shapeColorOne}
        style={{ ...iconStyle, position: 'absolute' }}
        uniquifyIDs={true}
        {...(viewBox && { viewBox })}
      />
      {hasSecondaryColorFill && (
        <Box
          position='absolute'
          zIndex={1}
          w='100%'
          h='100%'
          clipPath={generateClipPath(shapeFill, fillDirection)}
          bottom='0'
        >
          <SVG
            title={title}
            description={iconDescription}
            role='img'
            src={formattedSvg}
            fill={shapeColorTwo}
            style={iconStyle}
            uniquifyIDs={true}
            {...(viewBox && { viewBox })}
          />
        </Box>
      )}
    </Box>
  );
};
