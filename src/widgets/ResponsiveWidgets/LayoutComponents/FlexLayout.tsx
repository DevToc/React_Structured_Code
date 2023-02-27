import { Flex } from '@chakra-ui/react';
import { ComponentProps, forwardRef } from 'react';

export const FlexLayout = forwardRef<
  HTMLDivElement,
  Partial<
    Pick<
      ComponentProps<typeof Flex>,
      | 'children'
      | 'direction'
      | 'justifyContent'
      | 'alignItems'
      | 'position'
      | 'w'
      | 'h'
      | 'p'
      | 'flexDirection'
      | 'gap'
    >
  >
>(({ children, ...flexProps }, ref) => {
  return (
    <Flex ref={ref} {...flexProps}>
      {children}
    </Flex>
  );
});
