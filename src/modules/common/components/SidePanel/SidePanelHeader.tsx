import { Box, Heading, VisuallyHidden, IconButton, Text } from '@chakra-ui/react';
import { ReactNode, ComponentProps, forwardRef } from 'react';

import { ReactComponent as CloseIcon } from '../../../../assets/icons/close.svg';

/**
 * SIDE PANEL HEADER COMPONENT
 *
 * Use as a child of <SidePanel> component.
 * Will render heading for side panel with title and close button.
 * Can pass in ref for the close button.
 *
 * Renders a chakra Box component and styles can be overridden using the Box props.
 */
interface SidePanelHeaderProps extends ComponentProps<typeof Box> {
  title: string;
  titleId?: string;
  descriptionId?: string;
  description?: string;
  children?: ReactNode;
  onClose: () => void;
  closeButtonAriaLabel?: string;
  closeButtonTestId?: string;
}

export const SidePanelHeader = forwardRef<HTMLButtonElement, SidePanelHeaderProps>(
  (
    {
      title,
      titleId,
      descriptionId,
      description,
      onClose,
      children,
      closeButtonTestId,
      closeButtonAriaLabel = 'Close menu',
      ...boxProps
    },
    ref,
  ) => {
    return (
      <Box
        display='flex'
        alignItems='center'
        h='48px'
        p='16px'
        position='relative'
        borderTop='8px solid var(--vg-colors-upgrade-blue-500)'
        borderBottom='1px solid var(--vg-colors-divider-gray)'
        {...boxProps}
      >
        <Heading id={titleId} as='span' size='sm'>
          {title}
        </Heading>
        {description && (
          <VisuallyHidden>
            <Text id={descriptionId}>{description}</Text>
          </VisuallyHidden>
        )}
        <IconButton
          ref={ref}
          size='xs'
          aria-label={closeButtonAriaLabel}
          bg='transparent'
          position='absolute'
          right='0'
          m='10px'
          icon={<CloseIcon />}
          onClick={onClose}
          data-testid={closeButtonTestId}
        />
      </Box>
    );
  },
);
