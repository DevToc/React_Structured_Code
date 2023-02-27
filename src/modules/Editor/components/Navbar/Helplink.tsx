import { useRef, ReactElement } from 'react';
import styled from '@emotion/styled';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, Flex, Tooltip, useBoolean } from '@chakra-ui/react';

import { LinkButton } from './LinkButton';
import { INFOGRAPH_URL } from '../../../../constants/infograph';

const StyledHelp = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--vg-colors-black);
  border-radius: 50%;
  font-size: var(--vg-fontSizes-sm);
  transition: all 0.12s;

  &:hover,
  &:focus {
    boxshadow: var(--vg-shadows-outline);
  }
`;

interface helpLink {
  title: string;
  url: string;
}
const HELP_LINKS: helpLink[] = [
  {
    title: 'Help Center',
    url: 'https://help.venngage.com/en',
  },
  {
    title: 'Onboarding Guide',
    url: `${INFOGRAPH_URL}/help/onboarding`,
  },
  {
    title: 'Editor Functions',
    url: `${INFOGRAPH_URL}/help/editor`,
  },
  {
    title: 'Design Blog',
    url: `${INFOGRAPH_URL}/blog`,
  },
  {
    title: 'Email Us',
    url: 'mailto:support@venngage.com',
  },
];

export const HelpLink = (): ReactElement => {
  const initial_focus_ref = useRef(null);

  const [is_tooltip_open, setIsTooltipOpen] = useBoolean(false);
  const [is_popover_open, setIsPopoverOpen] = useBoolean(false);

  return (
    <Tooltip hasArrow isOpen={is_tooltip_open && !is_popover_open} placement='bottom' label='Help' bg='black'>
      <div onMouseEnter={setIsTooltipOpen.on} onMouseLeave={setIsTooltipOpen.off}>
        <Popover
          initialFocusRef={initial_focus_ref}
          isOpen={is_popover_open}
          placement='bottom'
          onClose={setIsPopoverOpen.off}
          closeOnBlur={true}
          closeOnEsc={true}
        >
          <PopoverTrigger>
            <StyledHelp onClick={setIsPopoverOpen.toggle} aria-label='Help' data-testid='helplink-button'>
              ?
            </StyledHelp>
          </PopoverTrigger>
          <PopoverContent width='162px' boxShadow='md' padding='0'>
            <PopoverArrow />
            <Flex direction='column' data-testid='helplink-menu'>
              {HELP_LINKS.map((link, idx) => {
                const { url, title } = link;
                return (
                  <LinkButton ref={idx === 0 ? initial_focus_ref : null} key={title} href={url} target='_blank'>
                    {title}
                  </LinkButton>
                );
              })}
            </Flex>
          </PopoverContent>
        </Popover>
      </div>
    </Tooltip>
  );
};
