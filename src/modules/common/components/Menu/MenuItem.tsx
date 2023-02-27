import {
  ComponentWithAs,
  forwardRef,
  MenuItem as ChakraMenuItem,
  MenuItemProps as ChakraMenuItemProps,
} from '@chakra-ui/react';

export interface MenuItemProps extends ChakraMenuItemProps {
  // Placeholder
}

export const MenuItem: ComponentWithAs<'menuitem', MenuItemProps> = forwardRef(function MenuItem(inProps, ref) {
  const { children, ...other } = inProps;

  return (
    <ChakraMenuItem
      ref={ref}
      gap={'0.5rem'}
      margin={'0.125rem 0'}
      paddingY={'0.5rem'}
      paddingLeft={'0.75rem'}
      paddingRight={'1rem'}
      borderInlineStartStyle={'solid'}
      borderInlineStartWidth={'4px'}
      borderInlineStartColor={'white'}
      color={'font.500'}
      fontFamily={'Inter, Oxygen, Helvetica, Arial, sans-serif'}
      fontWeight={'normal'}
      fontSize={'14px'}
      lineHeight={'1.25rem'}
      _hover={{
        backgroundColor: 'hover.gray',
        borderInlineStartColor: 'hover.gray',

        _focus: {
          borderInlineStartColor: 'upgrade.blue.500',
        },
      }}
      _focus={{
        backgroundColor: 'hover.gray',
        borderInlineStartColor: 'upgrade.blue.500',
      }}
      _focusWithin={{
        backgroundColor: 'hover.gray',
        borderInlineStartColor: 'upgrade.blue.500',
      }}
      _selected={{
        color: 'upgrade.blue.700',
        backgroundColor: 'hover.blue',
      }}
      {...other}
    >
      {children}
    </ChakraMenuItem>
  );
});
