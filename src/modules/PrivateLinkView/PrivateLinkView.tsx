import { ReactElement, useState, useRef } from 'react';
import { Provider } from 'react-redux';
import { Flex, Center } from '@chakra-ui/react';
import fscreen from 'fscreen';
import { isTest } from '../../utils/environment';

import { store, useAppSelector } from '../Editor/store';
import {
  selectInfographHeightPx,
  selectInfographWidthPx,
  selectPageBackground,
} from '../../modules/Editor/store/infographSelector';

import { selectActivePage } from '../../modules/Editor/store/pageSelector';
import { Page } from '../common/components/Page';
import { ReadOnlyStructureTreeListWidgetRenderer } from '../../widgets/WidgetRenderer';
import { InfographLoader } from '../InfographLoader';
import PrivateLinkViewFooter from './PrivateLinkViewFooter';
import PrivateLinkNavbar from './PrivateLinkNavbar';

const InfographPrivateLinkViewLoader = (): ReactElement => {
  const widthPx = useAppSelector(selectInfographWidthPx);
  const heightPx = useAppSelector(selectInfographHeightPx);
  const activePageId = useAppSelector(selectActivePage);
  const pageBackground = useAppSelector(selectPageBackground(activePageId));
  const [isFullScreen, setIsFullScreen] = useState(false);

  const privateLinkViewScale = window.innerWidth > widthPx ? 1 : window.innerWidth / widthPx;
  const fullScreenScale = Math.min(window.innerWidth / widthPx, window.innerHeight / heightPx);
  const pageScale = isFullScreen ? fullScreenScale : privateLinkViewScale;

  const infographRef = useRef<HTMLDivElement>(null);

  const enterFullScreen = () => {
    if (fscreen.fullscreenElement === null && infographRef.current) {
      fscreen.requestFullscreen(infographRef.current);
    }
    // fscreen.fullscreenElement won't be available during test, bypass the logic related to fscreen lib when testing
    if (isTest) setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (!!fscreen.fullscreenElement) fscreen.exitFullscreen();
  };

  const screenChangeHandler = () => {
    if (!!fscreen.fullscreenElement && !isFullScreen) {
      setIsFullScreen(true);
    } else if (!fscreen.fullscreenElement && isFullScreen) {
      setIsFullScreen(false);
    }
  };
  fscreen.addEventListener('fullscreenchange', screenChangeHandler, false);

  return (
    <Flex
      w={'100%'}
      minH={'100vh'}
      pt={75}
      top={0}
      position={'absolute'}
      bgColor={'var(--vg-colors-privateLinkView-wrapperBg)'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <InfographLoader>
        <Center flexDir={'column'} ref={infographRef} aria-label='infograph container'>
          <Page
            testId={activePageId}
            className='page-container'
            bg={pageBackground}
            width={widthPx}
            height={heightPx}
            zoom={pageScale}
            borderRadius='none'
            boxShadow='none'
            overflow='hidden'
          >
            <ReadOnlyStructureTreeListWidgetRenderer pageId={activePageId} />
          </Page>
          {!isFullScreen && <PrivateLinkViewFooter />}
          <PrivateLinkNavbar
            isFullScreen={isFullScreen}
            enterFullScreen={enterFullScreen}
            exitFullScreen={exitFullScreen}
          />
        </Center>
      </InfographLoader>
    </Flex>
  );
};

const PrivateLinkView = (): ReactElement => {
  return (
    <Provider store={store}>
      <InfographPrivateLinkViewLoader />
    </Provider>
  );
};

export default PrivateLinkView;
