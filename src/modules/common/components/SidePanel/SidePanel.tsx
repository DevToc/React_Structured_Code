import { Box } from '@chakra-ui/react';
import { ReactElement, ReactNode, ComponentProps } from 'react';
import { NAVBAR_HEIGHT } from '../../../Editor/components/Navbar';

/**
 * SIDE PANEL COMPONENT
 *
 * Renders container for left / right side menus.
 * Uses Chakra's Box component, can override styling using any Box props.
 */
interface SidePanelProps extends ComponentProps<typeof Box> {
  children: ReactNode;
  isOpen: boolean;
  placement: 'left' | 'right';
  testId?: string;
}

const DEFAULT_SIDE_PANEL_WIDTH = 352;

export const SidePanel = ({ isOpen, children, testId, placement, ...boxProps }: SidePanelProps): ReactElement => {
  const shadow = placement === 'right' ? '-4px 0px 4px -4px rgb(0 0 0 / 30%)' : '4px 0px 4px -4px rgb(0 0 0 / 30%)';
  return (
    <Box
      role='dialog'
      w={`${DEFAULT_SIDE_PANEL_WIDTH}px`}
      shadow={shadow}
      display={isOpen ? 'flex' : 'none'}
      position='relative'
      flexDir='column'
      bg='white'
      height={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
      data-testid={testId}
      color={'font.500'}
      {...boxProps}
    >
      {children}
    </Box>
  );
};
