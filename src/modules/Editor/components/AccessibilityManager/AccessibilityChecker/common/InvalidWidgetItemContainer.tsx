import { ReactNode, ReactElement, ComponentProps } from 'react';
import { Flex } from '@chakra-ui/react';

interface InvalidWidgetItemContainerProps extends ComponentProps<typeof Flex> {
  isActive: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const InvalidWidgetItemContainer = ({
  isActive,
  onClick,
  children,
  ...other
}: InvalidWidgetItemContainerProps): ReactElement => {
  return (
    <Flex
      bg={'gray.50'}
      mb={2}
      p={2}
      borderRadius={4}
      justifyContent={'space-between'}
      alignItems={'center'}
      _hover={{
        bg: 'upgrade.blue.50',
        cursor: 'pointer',
      }}
      sx={
        isActive
          ? {
              bg: 'upgrade.blue.50',
              color: 'upgrade.blue.700',
            }
          : {}
      }
      onClick={onClick}
      {...other}
    >
      {children}
    </Flex>
  );
};
