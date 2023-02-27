import { ComponentProps } from 'react';
import { Text } from '@chakra-ui/react';

const CheckDescriptionText = ({ children, ...props }: ComponentProps<typeof Text>) => {
  return (
    <Text fontSize='xs' fontWeight='400' lineHeight='var(--vg-lineHeights-shorter)' {...props}>
      {children}
    </Text>
  );
};

export { CheckDescriptionText };
