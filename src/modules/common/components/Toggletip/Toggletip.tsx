import { CSSProperties, ReactElement, ReactNode } from 'react';
import {
  IconButton,
  Center,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverProps,
  useDisclosure,
} from '@chakra-ui/react';

interface ToggletipProps extends Partial<PopoverProps> {
  label?: string;
  hasArrow: boolean;
  placement: 'top' | 'bottom' | 'left' | 'right';
  icon: ReactElement;
  buttonAriaLabel: string;
  testLabel?: string;
  children?: ReactNode;
  contentStyle?: CSSProperties;
}

/**
 * TOGGLETIP COMPONENT
 *
 * Renders a toggletip icon button.
 *
 * Behaviour:
 * - When icon is clicked, the tooltip is displayed.
 * - When clicking outside of tooltip, the tooltip will close.
 * - When the button is focused on using the keyboard, it will open when hitting 'Space' or 'enter'
 *   and will close when tabbing out.
 */
export const Toggletip = ({
  placement,
  hasArrow,
  icon,
  buttonAriaLabel,
  label = '',
  testLabel = '',
  children,
  contentStyle,
  ...other
}: ToggletipProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover returnFocusOnClose={false} isOpen={isOpen} onClose={onClose} placement={placement} {...other} isLazy>
      <PopoverAnchor>
        <IconButton
          bg={'transparent'}
          size={'xs'}
          aria-label={buttonAriaLabel}
          onClick={onOpen}
          icon={<Center>{icon}</Center>}
          borderRadius='full'
          variant='unstyled'
        />
      </PopoverAnchor>
      <PopoverContent bg={'font.500'} fontSize={'sm'} p={3} color={'white'} textAlign={'center'} style={contentStyle}>
        <PopoverArrow bg={'font.500'} />
        {children || label}
      </PopoverContent>
    </Popover>
  );
};
