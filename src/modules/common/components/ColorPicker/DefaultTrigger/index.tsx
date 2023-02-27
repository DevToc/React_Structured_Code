import { Box, Flex } from '@chakra-ui/react';
import { ReactComponent as TextColorPicker } from 'assets/icons/text_color_picker.svg';
import { TRIGGER_BUTTON_SIZE } from '../ColorPicker.constants';
import { DefaultTriggerProps, IconStyle } from '../ColorPicker.types';

interface Props extends DefaultTriggerProps {
  iconStyle: IconStyle;
  color: string;
}

const COLOR_ICON_SIZE = 5;

function DefaultTrigger({ iconStyle, color, ...defaultTriggerProps }: Props) {
  const isBorder = iconStyle === 'border';
  const isText = iconStyle === 'text';
  return (
    <Flex
      w={TRIGGER_BUTTON_SIZE}
      h={TRIGGER_BUTTON_SIZE}
      borderRadius='sm'
      as='button'
      transition='opacity 0.2s'
      _focus={{
        boxShadow: 'var(--vg-shadows-outline)',
        outline: 'none',
      }}
      _hover={{ bg: 'hover.gray' }}
      justifyContent='center'
      alignItems='center'
      {...defaultTriggerProps}
    >
      {isText ? (
        <TextColorPicker fill={color} />
      ) : (
        <Flex
          w={COLOR_ICON_SIZE}
          h={COLOR_ICON_SIZE}
          borderRadius='sm'
          background={color}
          border='1px solid var(--vg-colors-black-alpha-500)'
          justifyContent='center'
          alignItems='center'
        >
          {isBorder && (
            <Box w={2} h={2} bg='white' boxShadow='0px 0px 0px 1px var(--vg-colors-black-alpha-500) inset' />
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default DefaultTrigger;
