import { ComponentProps, ReactElement } from 'react';
import { Checkbox, Flex, Text } from '@chakra-ui/react';

const MarkResolved = ({ children, ...props }: ComponentProps<typeof Checkbox>): ReactElement => {
  const { fontSize, fontWeight, lineHeight, isChecked } = props;

  return (
    <Flex w='100%' direction='row' p='3' gap='2' bg={'upgrade.blue.50'} borderRadius='var(--vg-radii-base)'>
      <Checkbox
        size='sm'
        alignItems='top'
        sx={{
          'span.chakra-checkbox__control': {
            background: isChecked ? 'upgrade.blue.500' : 'white',
            borderColor: 'upgrade.blue.500',
            marginTop: '2px',
          },
        }}
        {...props}
      >
        <Text
          fontSize={fontSize ?? 'xs'}
          fontWeight={fontWeight ?? 'semibold'}
          lineHeight={lineHeight ?? 'var(--vg-lineHeights-shorter)'}
        >
          {children}
        </Text>
      </Checkbox>
    </Flex>
  );
};

export { MarkResolved };
