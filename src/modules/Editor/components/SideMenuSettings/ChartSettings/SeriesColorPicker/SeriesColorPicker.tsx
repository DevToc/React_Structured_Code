import { memo } from 'react';
import { SeriesColorPickerProps } from './SeriesColorPicker.types';
import { Flex, Text } from '@chakra-ui/react';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { useSideMenuSetting } from 'widgets/sdk';

const SeriesColorPicker = memo(({ label, series, placement = 'left-start', onChange }: SeriesColorPickerProps) => {
  const { setAllowScrolling } = useSideMenuSetting();
  return (
    <>
      <Text mb={2} fontSize='sm'>
        {label}
      </Text>
      {series.map(({ color, name }, index: number) => {
        const onChangeDataColor = (color: string) => onChange(color, index);

        return (
          <Flex align='center' key={index}>
            <ColorPicker
              color={color}
              onChange={onChangeDataColor}
              onOpen={setAllowScrolling.off}
              onClose={setAllowScrolling.on}
              placement={placement}
            />
            <Text pl={3} fontSize='sm'>
              {name}
            </Text>
          </Flex>
        );
      })}
    </>
  );
});

export default SeriesColorPicker;
