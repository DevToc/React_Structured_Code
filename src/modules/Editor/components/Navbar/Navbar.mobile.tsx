import { ReactElement, CSSProperties } from 'react';
import styled from '@emotion/styled';
import { Box, Link, VisuallyHidden } from '@chakra-ui/react';
import { PageSwitcherMobile } from '../PageManager/PageSwitcher';

import { UndoMenu } from './UndoMenu';
import { DownloadMenuMobile } from './DownloadMenu';

import { AccessibilityToggle } from './AccessibilityToggle';
import { ReactComponent as VenngageLogoIcon } from '../../../../assets/icons/venngage_logo.svg';

export const NAVBAR_HEIGHT_MOBILE = 50;

export const NavbarMobile = (): ReactElement => {
  const NavWrapper = styled.nav`
    color: var(--vg-colors-gray-600);
    width: 100%;
    height: ${NAVBAR_HEIGHT_MOBILE}px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    box-shadow: 0 0 6px rgb(0 0 0 / 18%);
    z-index: 1;
    position: relative;
  `;

  const logoStyle: CSSProperties = {
    width: '34px',
    height: '34px',
    cursor: 'pointer',
  };

  return (
    <NavWrapper data-testid='navbar' style={{ justifyContent: 'space-evenly' }}>
      <Box>
        <Link href='/infographics'>
          <VenngageLogoIcon aria-hidden='true' style={logoStyle} fill='var(--vg-colors-brand-500)' />
          <VisuallyHidden>Go to My Designs</VisuallyHidden>
        </Link>
      </Box>
      <Box>
        <AccessibilityToggle />
      </Box>
      <Box ml={2}>
        <UndoMenu />
      </Box>
      <Box ml={2}>
        <PageSwitcherMobile />
      </Box>
      <Box ml={2}>
        <DownloadMenuMobile />
      </Box>
    </NavWrapper>
  );
};
