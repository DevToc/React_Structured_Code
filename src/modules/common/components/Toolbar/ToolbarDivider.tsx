import { ComponentProps } from 'react';
import { Divider } from '@chakra-ui/react';

/**
 * TOOLBAR DIVIDER COMPONENT
 *
 * This component renders a vertical divider to be used in the toolbar
 */
export const ToolbarDivider = (dividerProps: ComponentProps<typeof Divider>) => {
  return <Divider height={5} orientation={'vertical'} {...dividerProps} />;
};
