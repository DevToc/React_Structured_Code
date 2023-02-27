import { ChakraComponent, Select, SelectProps, Tooltip } from '@chakra-ui/react';
import { FONT_SIZES } from 'constants/fonts';

interface FontSizeSelectProps extends Omit<SelectProps, 'value'> {
  value: string | typeof FONT_SIZES[number];
}

export const FontSizeSelect: ChakraComponent<typeof Select, FontSizeSelectProps> = (props: FontSizeSelectProps) => {
  return (
    <Tooltip hasArrow placement='bottom' label='Font Size' bg='black'>
      <Select
        data-testid='fontsize-select'
        width={'80px'}
        size={'sm'}
        aria-label={'Font size select'}
        borderColor='outline.gray'
        {...props}
      >
        <option value={''}>size</option>
        {FONT_SIZES.map((value) => (
          <option key={`fontsize-${value}`} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
};
