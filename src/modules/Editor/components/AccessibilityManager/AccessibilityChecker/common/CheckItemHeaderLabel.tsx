import { ComponentProps, ReactElement } from 'react';
import { Text } from '@chakra-ui/react';

const CheckItemHeaderLabel = ({ children, ...props }: ComponentProps<typeof Text>): ReactElement => {
  return (
    <Text fontSize='sm' fontWeight='semibold' {...props}>
      {children}
    </Text>
  );
};

export { CheckItemHeaderLabel };
