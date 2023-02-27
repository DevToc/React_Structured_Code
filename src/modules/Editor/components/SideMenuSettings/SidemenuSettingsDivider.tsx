import { ChakraComponent, Divider, DividerProps } from '@chakra-ui/react';

/**
 * A divider specifically used on the right side-panel.
 * For other use-cases, the generic Divider from the chakra should be used.
 *
 * @param props DividerProps from chakra
 * @returns A Divider component
 */
export const SideSettingDivider: ChakraComponent<typeof Divider, DividerProps> = (props) => {
  return <Divider width={'calc(100% + 2rem)'} position='relative' left={'-1rem'} {...props} />;
};
