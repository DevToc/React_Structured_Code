import { useState, useRef, useEffect, CSSProperties } from 'react';
import { Flex, Link, VisuallyHidden, IconButton, Tooltip } from '@chakra-ui/react';
import { ReactComponent as VenngageLogoIcon } from '../../assets/icons/venngage_logo.svg';
import { ReactComponent as GoFullScreenIcon } from '../../assets/icons/go_fullscreen.svg';
import { ReactComponent as ExitFullScreenIcon } from '../../assets/icons/exit_fullscreen.svg';
import { useDebouncedCallback } from '../../hooks/useDebounce';
import { PageNavigation } from './PageNavigation';

const navbarHoverStyle: CSSProperties = {
  opacity: 1,
};

const logoStyle: CSSProperties = {
  width: '34px',
  height: '34px',
  cursor: 'pointer',
};

const fullScreenIconHoverStyle: CSSProperties = {
  background: 'gray.800',
};

interface PrivateLinkNavbarProps {
  isFullScreen: boolean;
  enterFullScreen: () => void;
  exitFullScreen?: () => void;
}

const PrivateLinkNavbar = ({ isFullScreen, enterFullScreen, exitFullScreen }: PrivateLinkNavbarProps) => {
  const [hoverStyleEnabled, setHoverStyleEnabled] = useState(false);
  const linkTagRef = useRef<HTMLAnchorElement>(null);
  const fullScreenBtnRef = useRef<HTMLButtonElement>(null);

  // In fullScreen mode, when either anchor tag or fullScreen icon is on focus, disable hoverStyle (navbar should appear)
  const disableHoverStyle = useDebouncedCallback(() => {
    if (
      isFullScreen &&
      hoverStyleEnabled &&
      (document.activeElement === linkTagRef.current || document.activeElement === fullScreenBtnRef.current)
    ) {
      setHoverStyleEnabled(false);
    }
  }, 100);

  // In fullScreen mode, when  anchor tag and fullScreen icon are not on focus, enable hoverStyle (navbar should disappear when navbar not onHover)
  const enableHoverStyle = useDebouncedCallback(() => {
    if (
      isFullScreen &&
      !hoverStyleEnabled &&
      document.activeElement !== linkTagRef.current &&
      document.activeElement !== fullScreenBtnRef.current
    ) {
      setHoverStyleEnabled(true);
    }
  }, 100);

  // When entering full screen mode, remove focus from fullScreen btn to enable hoverStyle on navbar (navbar would disappear when not on Hover) after 3 seconds
  // When exiting full screen mode, disable hoverStyle on navbar
  useEffect(() => {
    let timeoutId: null | ReturnType<typeof setTimeout>;
    if (isFullScreen) {
      timeoutId = setTimeout(() => {
        fullScreenBtnRef.current?.blur();
      }, 3000);
    } else {
      setHoverStyleEnabled(false);
    }
    return () => {
      if (!!timeoutId) clearTimeout(timeoutId);
    };
  }, [isFullScreen]);

  return (
    <Flex
      pos={'fixed'}
      left={0}
      bottom={0}
      w={'100%'}
      h={'60px'}
      px={5}
      bgColor={'var(--vg-colors-privateLinkView-navbarBg)'}
      justifyContent={'space-between'}
      alignItems={'center'}
      opacity={hoverStyleEnabled ? 0 : 1}
      _hover={hoverStyleEnabled ? navbarHoverStyle : {}}
    >
      <Link
        href='/infographics'
        ref={linkTagRef}
        onFocus={disableHoverStyle}
        onBlur={enableHoverStyle}
        data-testid='pl-logo-home-link'
      >
        <VenngageLogoIcon aria-hidden='true' style={logoStyle} fill='white' />
        <VisuallyHidden>Go to My Designs</VisuallyHidden>
      </Link>
      <PageNavigation />
      <Tooltip
        hasArrow
        portalProps={{ containerRef: fullScreenBtnRef }}
        label={isFullScreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
        placement={'top'}
        arrowSize={7.5}
        bg={'font.500'}
        color='white'
        fontSize='xs'
        fontWeight='medium'
        lineHeight='shorter'
        borderRadius='base'
        gutter={12}
        px={2}
        py={1}
        mr={2}
      >
        <IconButton
          size='sm'
          p={1}
          background={'transparent'}
          _hover={fullScreenIconHoverStyle}
          aria-label={isFullScreen ? 'exit full screen button' : 'go full screen button'}
          icon={isFullScreen ? <ExitFullScreenIcon /> : <GoFullScreenIcon />}
          onFocus={disableHoverStyle}
          onBlur={enableHoverStyle}
          onClick={isFullScreen ? exitFullScreen : enterFullScreen}
          ref={fullScreenBtnRef}
          data-testid='pl-fullscreen-btn'
        ></IconButton>
      </Tooltip>
    </Flex>
  );
};

export default PrivateLinkNavbar;
