import { useRef } from 'react';
import styled from '@emotion/styled';
import {
  Flex,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Avatar,
  Tooltip,
  useBoolean,
} from '@chakra-ui/react';
import { INFOGRAPH_URL } from '../../../../constants/infograph';
import { LinkButton } from './LinkButton';

const AvatarStyled = styled(Avatar)`
  &:hover,
  &:focus {
    cursor: pointer;
    boxshadow: var(--vg-shadows-outline);
  }
`;

export const UserAvatar = () => {
  const initial_focus_ref = useRef(null);
  const [is_tooltip_open, setIsTooltipOpen] = useBoolean(false);
  const [is_popover_open, setIsPopoverOpen] = useBoolean(false);

  return (
    <Box zIndex='navbar'>
      <Tooltip hasArrow isOpen={is_tooltip_open && !is_popover_open} placement='bottom' label='Account' bg='black'>
        <Box onMouseEnter={setIsTooltipOpen.on} onMouseLeave={setIsTooltipOpen.off}>
          <Popover
            initialFocusRef={initial_focus_ref}
            isOpen={is_popover_open}
            placement='bottom-end'
            onClose={setIsPopoverOpen.off}
            closeOnBlur={true}
            closeOnEsc={true}
          >
            <PopoverTrigger>
              <AvatarStyled
                onClick={setIsPopoverOpen.toggle}
                as='button'
                size='sm'
                name='Name here'
                aria-label='Account'
                data-testid='useravatar-button'
              />
            </PopoverTrigger>
            <PopoverContent width='121px' boxShadow='md' padding='0'>
              <PopoverArrow />
              <Flex direction='column' data-testid='useravatar-menu'>
                <LinkButton ref={initial_focus_ref} href={`${INFOGRAPH_URL}/account/profile`}>
                  My Account
                </LinkButton>
                <LinkButton href={`${INFOGRAPH_URL}/logout`}>Sign Out</LinkButton>
              </Flex>
            </PopoverContent>
          </Popover>
        </Box>
      </Tooltip>
    </Box>
  );
};
