import { ReactNode, ReactElement, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Box, Flex, Text, IconButton, Collapse, useStyleConfig, BoxProps } from '@chakra-ui/react';

import { ReactComponent as ChevronUpIcon } from '../../../../assets/icons/chevron_up.svg';
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron_down.svg';

interface CollapsibleBoxProps extends BoxProps {
  title: string;
  collapseAriaLabel: string;
  children: ReactNode;
  titleIcon?: ReactElement;
  variant?: string;
  isOpenOnMount?: boolean;
}

const StyledIconButton = styled(IconButton)`
  &:hover {
    background-color: transparent;
  }
`;

/**
 * COLLAPSIBLE BOX COMPONENT
 *
 * Renders a box that can be expanded/collapsed.
 * When collapsed, only displays [title].
 * When expanded, will display [title] and [children].
 *
 * Note: In the future, can apply variants for different color themed boxes.
 * For now, just renders a blue info box - for example, can add error (red), warn (yellow),
 * success (green) themed boxes.
 */
export const CollapsibleBox = ({
  title,
  titleIcon,
  collapseAriaLabel,
  children,
  variant,
  isOpenOnMount,
  ...boxProps
}: CollapsibleBoxProps) => {
  const styles = useStyleConfig('CollapsibleBox', { variant });
  const [isOpen, setOpen] = useState(isOpenOnMount);

  const toggleCollapse = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  return (
    <Box __css={styles} {...boxProps}>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          {titleIcon}
          <Text fontWeight={700} fontSize={'xs'}>
            {title}
          </Text>
        </Flex>
        <StyledIconButton
          onClick={toggleCollapse}
          aria-label={collapseAriaLabel}
          bg={'transparent'}
          size={'xs'}
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        />
      </Flex>
      <Collapse in={isOpen}>{children}</Collapse>
    </Box>
  );
};
