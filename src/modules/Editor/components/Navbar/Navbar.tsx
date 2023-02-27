import { ReactElement, CSSProperties, useCallback } from 'react';
import styled from '@emotion/styled';
import { Flex, Box, Button, Link, VisuallyHidden } from '@chakra-ui/react';

import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { AccessibilityButton } from './AccessibilityButton';
import { AutosaveIndicator } from './AutosaveIndicator';
import { TitleInput } from './TitleInput';
import { BetaBadge } from './Betabadge';
import { UserAvatar } from './UserAvatar';
import { HelpLink } from './Helplink';
import { UndoMenu } from './UndoMenu';
import { ZoomSelect } from './ZoomSelect';
import { DownloadMenu } from './DownloadMenu';
import { ShareButton } from './ShareButton';
import { FileMenu } from './FileMenu';

import { useAppSelector, useAppDispatch } from '../../store';
import { setTitle } from 'modules/Editor/store/infographSlice';
import { selectInfographTitle } from 'modules/Editor/store/infographSelector';
import { isProduction } from 'utils/environment';

import { ReactComponent as VenngageLogoIcon } from 'assets/icons/venngage_logo.svg';

export const NAVBAR_HEIGHT = 60;

export const Navbar = (): ReactElement => {
  const NavWrapper = styled.nav`
    color: var(--vg-colors-gray-600);
    width: 100%;
    height: ${NAVBAR_HEIGHT}px;
    display: flex;
    align-items: center;
    padding: 0 32px;
    box-shadow: 0 0 6px rgb(0 0 0 / 18%);
    position: relative;
  `;

  const logoStyle: CSSProperties = {
    width: '34px',
    height: '34px',
    cursor: 'pointer',
  };

  const dispatch = useAppDispatch();

  const infographTitle = useAppSelector(selectInfographTitle);

  const updateInfographTitle = useCallback(
    (newTitle: string) => {
      if (!newTitle) {
        return;
      }

      dispatch(setTitle({ title: newTitle }));
    },
    [dispatch],
  );

  return (
    <NavWrapper data-testid='navbar'>
      <Box>
        <Flex align='center'>
          <Link href='/infographics'>
            <VenngageLogoIcon aria-hidden='true' style={logoStyle} fill='var(--vg-colors-brand-500)' />
            <VisuallyHidden>Go to My Designs</VisuallyHidden>
          </Link>
          <BetaBadge />
        </Flex>
      </Box>
      <FileMenu />
      <ToolbarDivider mr={2} ml={2} />
      <AccessibilityButton />
      <Box ml={2}>
        <TitleInput title={infographTitle} onSubmit={updateInfographTitle} />
      </Box>
      <Box ml={2}>
        <ZoomSelect />
      </Box>
      <UndoMenu />
      <Box ml='auto' mr={2}>
        <AutosaveIndicator />
      </Box>
      <ToolbarDivider mr={2} ml={2} />
      <Box mr={2}>
        <DownloadMenu />
      </Box>
      <Box mr={2}>
        <ShareButton />
      </Box>
      {!isProduction && (
        <>
          <Button mr={2} colorScheme='brand' size='sm'>
            Upgrade
          </Button>
          <Box mr={2} zIndex='navbar'>
            <HelpLink />
          </Box>
          <UserAvatar />
        </>
      )}
    </NavWrapper>
  );
};
