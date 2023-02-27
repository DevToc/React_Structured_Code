import { Box } from '@chakra-ui/react';
import { ComponentProps } from 'react';
import { useAppSelector } from 'modules/Editor/store/hooks';
import { selectColorVisionMode } from 'modules/Editor/store/editorSettingsSelector';
import { ColorVisionMode } from 'modules/Editor/store/editorSettingsSlice.types';

/**
 * The preset color matrix algorithm can be found in below links
 * TODO: will write our own color blind detection for more dynamic color range
 * when we integrate with our new color palette generation
 *
 * @see https://en.wikipedia.org/wiki/Color_blindness
 * @see https://github.com/MaPePeR/jsColorblindSimulator/blob/master/colorblind.js
 * @returns
 */
const ColorVisionFilterPreset = () => (
  <svg style={{ display: 'none' }} width='0' height='0'>
    <filter id='__achromatopsia'>
      <feColorMatrix
        values='0.213  0.715  0.072  0.000  0.000
                0.213  0.715  0.072  0.000  0.000
                0.213  0.715  0.072  0.000  0.000
                0.000  0.000  0.000  1.000  0.000'
      ></feColorMatrix>
    </filter>
    <filter id='__deuteranopia'>
      <feColorMatrix
        values='0.367  0.861 -0.228  0.000  0.000
                0.280  0.673  0.047  0.000  0.000
              -0.012  0.043  0.969  0.000  0.000
                0.000  0.000  0.000  1.000  0.000'
      ></feColorMatrix>
    </filter>
    <filter id='__protanopia'>
      <feColorMatrix
        values='0.152  1.053 -0.205  0.000  0.000
                0.115  0.786  0.099  0.000  0.000
              -0.004 -0.048  1.052  0.000  0.000
                0.000  0.000  0.000  1.000  0.000'
      ></feColorMatrix>
    </filter>
    <filter id='__tritanopia'>
      <feColorMatrix
        values='1.256 -0.077 -0.179  0.000  0.000
              -0.078  0.931  0.148  0.000  0.000
                0.005  0.691  0.304  0.000  0.000
                0.000  0.000  0.000  1.000  0.000'
      ></feColorMatrix>
    </filter>
    {/* Note: cataracts needs to update with more proper value */}
    <filter id='__cataracts'>
      <feComponentTransfer>
        <feFuncR type='linear' slope='0.35' intercept='0.5' />
        <feFuncG type='linear' slope='0.35' intercept='0.5' />
        <feFuncB type='linear' slope='0.35' intercept='0.5' />
      </feComponentTransfer>
    </filter>
    <filter id='__lowvision'>
      <feGaussianBlur in='SourceGraphic' stdDeviation='2'></feGaussianBlur>
    </filter>
  </svg>
);

const PageColorVisionFilter = ({ children }: ComponentProps<typeof Box>) => {
  const colorVisionMode = useAppSelector(selectColorVisionMode);

  if (colorVisionMode === ColorVisionMode.none) {
    return <>{children}</>;
  }

  return (
    <Box filter={`url('#__${colorVisionMode}')`}>
      {children}
      <ColorVisionFilterPreset />
    </Box>
  );
};

export { PageColorVisionFilter };
